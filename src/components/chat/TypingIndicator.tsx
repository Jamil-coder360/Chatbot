export default function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm" role="status" aria-label="Typing">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 rounded-full bg-mute" style={{ animation: "bounce-dot 1.1s infinite", animationDelay: `${d}ms` }} />
      ))}
    </div>
  );
}
