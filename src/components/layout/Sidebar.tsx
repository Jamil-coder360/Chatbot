
"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/common/Avatar";
import Icon from "@/components/common/Icon";
import type { Conversation } from "@/types/message";

const tabs = ["All", "Unread", "Groups", "Archived"];

interface Props {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  query: string;
  onQuery: (q: string) => void;
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  query,
  onQuery,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fmt = (iso: string) => {
    if (!mounted) return "";

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <aside className="flex h-full w-full flex-col bg-white md:w-[340px] md:border-r md:border-line">
      <div className="px-5 pb-3 pt-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand">
          Messages
        </h1>

        <label className="mt-4 flex items-center gap-2 rounded-xl bg-canvas px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand/40">
          <Icon name="search" size={18} className="text-mute" />

          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search chats"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mute"
          />
        </label>

        <div className="mt-4 flex gap-4 text-sm font-semibold">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`pb-1.5 ${
                i === 0
                  ? "border-b-2 border-brand text-brand"
                  : "text-mute hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <ul className="scroll-thin flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const active = c.id === activeId;

          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
                  active ? "bg-brand-soft" : "hover:bg-canvas"
                }`}
              >
                <Avatar
                  src={c.user.avatar}
                  name={c.user.name}
                  size={48}
                  online={c.user.online}
                />

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-bold">
                      {c.user.name}
                    </span>

                    <span className="text-xs text-mute">
                      {fmt(c.lastAt)}
                    </span>
                  </span>

                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-sm ${
                        c.user.typing
                          ? "font-semibold text-brand"
                          : "text-mute"
                      }`}
                    >
                      {c.user.typing ? "Typing…" : c.lastMessage}
                    </span>

                    {c.unread > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-white">
                        {c.unread}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}

        {conversations.length === 0 && (
          <li className="px-5 py-8 text-sm text-mute">
            No chats match “{query}”. Try a different name.
          </li>
        )}
      </ul>
    </aside>
  );
}
