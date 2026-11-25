"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import AuthShell, { primary } from "@/components/common/AuthShell";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

function Form() {
  const router = useRouter(); const email = useSearchParams().get("email") ?? ""; const { signIn } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const change = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits]; next[i] = v; setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try { const r = await api.verifyOtp({ email, otp: digits.join("") }); signIn(r.user, r.token); router.push("/chat"); }
    catch (err) { setError(err instanceof Error ? err.message : "That code didn't work. Check it and try again."); }
    finally { setBusy(false); }
  };
  return (
    <AuthShell title="Enter your code" subtitle={`We sent a 6-digit code to ${email || "your email"}.`}
      footer={<>Wrong email? <a href="/register" className="font-bold text-brand hover:underline">Start over</a></>}>
      <form onSubmit={submit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`}
              onChange={(e) => change(i, e.target.value)} onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
              className="h-14 w-12 rounded-xl border border-line bg-canvas text-center text-xl font-bold outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" />
          ))}
        </div>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <button className={primary} disabled={busy || digits.some((d) => !d)}>{busy ? "Verifying…" : "Verify"}</button>
      </form>
    </AuthShell>
  );
}
export default function VerifyOTP() { return <Suspense><Form /></Suspense>; }
