"use client";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import type { Message } from "@/types/message";

export default function MessageList({ messages, meId, typing }: { messages: Message[]; meId: string; typing?: boolean }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length, typing]);
  return (
    <div className="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-5 md:px-8">
      <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-mute shadow-sm">Today</div>
      {messages.map((m) => <MessageBubble key={m.id} message={m} mine={m.senderId === meId} />)}
      {typing && <TypingIndicator />}
      <div ref={end} />
    </div>
  );
}
