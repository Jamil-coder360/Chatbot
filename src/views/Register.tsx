"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell, { primary } from "@/components/common/AuthShell";
import TextField from "@/components/common/TextField";
import { api } from "@/services/api";

type Errors = Partial<Record<"name" | "email" | "password" | "confirm" | "form", string>>;

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  const strength = [/.{8,}/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(form.password)).length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await api.register({ name: form.name.trim(), email: form.email, password: form.password });
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) { setErrors({ form: err instanceof Error ? err.message : "Could not create the account. Try again." }); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title="Create your account" subtitle="We'll email you a code to confirm it's you."
      footer={<>Already have an account? <Link href="/login" className="font-bold text-brand hover:underline">Sign in</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField label="Full name" icon="user" autoComplete="name" placeholder="Vivien Hale" value={form.name} error={errors.name} onChange={set("name")} />
        <TextField label="Email" icon="mail" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} error={errors.email} onChange={set("email")} />
        <div>
          <TextField label="Password" icon="lock" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} error={errors.password} onChange={set("password")} />
          {form.password && (
            <div className="mt-2 flex gap-1" aria-hidden>
              {[1, 2, 3, 4].map((i) => <span key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? (strength < 3 ? "bg-amber-400" : "bg-emerald-500") : "bg-line"}`} />)}
            </div>
          )}
        </div>
        <TextField label="Confirm password" icon="lock" type="password" autoComplete="new-password" placeholder="Repeat your password" value={form.confirm} error={errors.confirm} onChange={set("confirm")} />
        {errors.form && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.form}</p>}
        <button className={primary} disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
    </AuthShell>
  );
}
