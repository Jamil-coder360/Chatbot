import Icon from "@/components/common/Icon";
import type { Message } from "@/types/message";

export default function MessageBubble({ message, mine }: { message: Message; mine: boolean }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <p className={`max-w-[78%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${mine ? "rounded-br-md bg-brand text-white" : "rounded-bl-md bg-white shadow-sm"}`}>
        {message.text}
      </p>
      <span className="mt-1 flex items-center gap-1 px-1 text-[11px] text-mute">
        {time}
        {mine && <Icon name="check" size={14} className={message.status === "read" ? "text-brand" : ""} />}
      </span>
    </div>
  );
}
