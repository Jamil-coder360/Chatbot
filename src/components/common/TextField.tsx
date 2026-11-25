"use client";
import { useState } from "react";
import Icon, { IconName } from "./Icon";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string; icon: IconName; value: string; onChange: (v: string) => void; error?: string;
}

export default function TextField({ label, icon, value, onChange, error, type = "text", ...rest }: Props) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className={`flex items-center gap-2 rounded-xl border bg-canvas px-3.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30 ${error ? "border-red-400" : "border-line"}`}>
        <Icon name={icon} size={18} className="text-mute" />
        <input {...rest} type={isPw && show ? "text" : type} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error}
          className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-mute" />
        {isPw && (
          <button type="button" onClick={() => setShow((s) => !s)} className="text-mute hover:text-brand" aria-label={show ? "Hide password" : "Show password"}>
            <Icon name={show ? "eyeOff" : "eye"} size={18} />
          </button>
        )}
      </div>
      {error && <p role="alert" className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
