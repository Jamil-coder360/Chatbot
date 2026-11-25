"use client";
import { useState } from "react";
import Icon from "@/components/common/Icon";

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const submit = () => { const v = text.trim(); if (!v) return; onSend(v); setText(""); };
  return (
    <div className="flex items-center gap-2 border-t border-line bg-white px-4 py-3 md:px-6">
      <div className="flex flex-1 items-center gap-2 rounded-full bg-canvas px-4 py-1.5 focus-within:ring-2 focus-within:ring-brand/40">
        <button className="text-mute hover:text-brand" aria-label="Emoji"><Icon name="smile" /></button>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Write a message" className="h-10 flex-1 bg-transparent text-[15px] outline-none placeholder:text-mute" />
        <button className="text-mute hover:text-brand" aria-label="Attach file"><Icon name="clip" /></button>
      </div>
      <button onClick={submit} disabled={!text.trim()} className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white transition-opacity disabled:opacity-40" aria-label="Send message"><Icon name="send" size={20} /></button>
    </div>
  );
}
