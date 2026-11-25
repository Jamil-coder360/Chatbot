
"use client";

import Avatar from "@/components/common/Avatar";
import Icon from "@/components/common/Icon";
import type { User } from "@/types/user";

export default function ChatHeader({
  user,
  onBack,
}: {
  user: User;
  onBack: () => void;
}) {
  const btn =
    "grid h-10 w-10 place-items-center rounded-full text-brand transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand";

  return (
    <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 md:px-6">
      <button
        onClick={onBack}
        className={`${btn} md:hidden`}
        aria-label="Back to chats"
      >
        <Icon name="back" />
      </button>

      <Avatar
        src={user.profile ?? undefined}
        name={user.name}
        size={44}
      />

      <div>
        <p className="font-bold leading-tight">{user.name}</p>
        <p className="text-sm text-mute">Offline</p>
      </div>

      <div className="ml-auto flex gap-1">
        <button className={btn} aria-label="Voice call">
          <Icon name="phone" />
        </button>

        <button className={btn} aria-label="Video call">
          <Icon name="video" />
        </button>
      </div>
    </header>
  );
}
