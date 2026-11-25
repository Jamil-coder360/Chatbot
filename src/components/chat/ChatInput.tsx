"use client";

import { useState } from "react";
import Icon from "@/components/common/Icon";

interface ChatInputProps {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    const value = text.trim();
    if (!value || disabled || sending) return;

    setSending(true);
    setError("");

    try {
      await onSend(value);
      setText("");
    } catch (sendError) {
      setError(
        sendError instanceof Error ? sendError.message : "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="border-t border-line bg-white px-4 py-3 md:px-6"
    >
      {error && (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-canvas px-4 py-1.5 focus-within:ring-2 focus-within:ring-brand/40">
          <button type="button" className="text-mute hover:text-brand" aria-label="Emoji"><Icon name="smile" /></button>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={disabled || sending}
            placeholder="Write a message"
            className="h-10 flex-1 bg-transparent text-[15px] outline-none placeholder:text-mute"
          />
          <button type="button" className="text-mute hover:text-brand" aria-label="Attach file"><Icon name="clip" /></button>
        </div>
        <button
          type="submit"
          disabled={!text.trim() || disabled || sending}
          className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white transition-opacity disabled:opacity-40"
          aria-label="Send message"
        >
          <Icon name="send" size={20} />
        </button>
      </div>
    </form>
  );
}
