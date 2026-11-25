"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell, { primary } from "@/components/common/AuthShell";
import TextField from "@/components/common/TextField";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { signin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try { await signin(form); router.push("/chat"); }
    catch (err) { setErrors({ form: err instanceof Error ? err.message : "Could not sign in. Check your details and try again." }); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to pick up your conversations."
      footer={<>New here? <Link href="/register" className="font-bold text-brand hover:underline">Create an account</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-5">
        <TextField label="Email" icon="mail" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} error={errors.email} onChange={(v) => setForm({ ...form, email: v })} />
        <TextField label="Password" icon="lock" type="password" autoComplete="current-password" placeholder="Your password" value={form.password} error={errors.password} onChange={(v) => setForm({ ...form, password: v })} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-mute"><input type="checkbox" className="h-4 w-4 accent-brand" /> Keep me signed in</label>
          <button type="button" className="font-semibold text-brand hover:underline">Forgot password?</button>
        </div>
        {errors.form && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.form}</p>}
        <button className={primary} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </AuthShell>
  );
}
