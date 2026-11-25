
"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import AuthShell, {
  primary,
} from "@/components/common/AuthShell";

import { api } from "@/services/api";

function Form() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(
    Array(6).fill("")
  );

  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Get email from URL or sessionStorage
  useEffect(() => {
    const urlEmail = searchParams.get("email");

    const savedEmail =
      sessionStorage.getItem("otpEmail");

    const finalEmail = urlEmail || savedEmail || "";

    setEmail(finalEmail);

    if (urlEmail) {
      sessionStorage.setItem("otpEmail", urlEmail);
    }
  }, [searchParams]);

  // OTP input change
  const change = (i: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[i] = value;

    setDigits(next);
    setError("");

    if (value && i < 5) {
      refs.current[i + 1]?.focus();
    }
  };

  // Verify OTP
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = sessionStorage.getItem(
      "otpVerificationToken"
    );

    if (!token) {
      setError(
        "Verification token missing. Please register again."
      );
      return;
    }

    if (!email) {
      setError(
        "Email address missing. Please register again."
      );
      return;
    }

    const otp = digits.join("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const result = await api.verifyOtp({
        token,
        otp,
      });

      if (!result?.accessToken) {
        throw new Error(
          "OTP verification response is missing access token."
        );
      }

      // OTP successfully verified
      sessionStorage.removeItem(
        "otpVerificationToken"
      );

      sessionStorage.removeItem("otpEmail");

      router.replace("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "OTP verification failed."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Enter your code"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}.`
          : "Enter the 6-digit code sent to your email."
      }
      footer={
        <>
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-bold text-brand hover:underline"
          >
            Start over
          </Link>
        </>
      }
    >
      <form
        onSubmit={submit}
        className="space-y-6"
      >
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              onChange={(e) =>
                change(i, e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" &&
                  !d &&
                  i > 0
                ) {
                  refs.current[i - 1]?.focus();
                }
              }}
              className="h-14 w-12 rounded-xl border border-line bg-canvas text-center text-xl font-bold outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="text-sm text-red-500"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className={primary}
          disabled={
            busy ||
            digits.some((d) => !d) ||
            !email
          }
        >
          {busy ? "Verifying…" : "Verify"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">
          Loading...
        </div>
      }
    >
      <Form />
    </Suspense>
  );
}
