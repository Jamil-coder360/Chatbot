"use client";
import { useCallback, useMemo, useState } from "react";
import type { Conversation, Message } from "@/types/message";

const av = (n: number) => `https://i.pravatar.cc/120?img=${n}`;
const people = [
  { id: "u1", name: "Nicol Zunch", avatar: av(47), online: true, typing: true },
  { id: "u2", name: "Mili Gomez", avatar: av(32), online: true },
  { id: "u3", name: "Javier Burgos", avatar: av(12), online: false },
  { id: "u4", name: "Alice Whitman", avatar: av(5), online: true },
  { id: "u5", name: "Victor Lazet", avatar: av(15), online: false },
  { id: "u6", name: "Gabi Yapur", avatar: av(44), online: true },
];
const ago = (m: number) => new Date(Date.now() - m * 60000).toISOString();
const lastLines = ["Typing…", "Okay, bring the laptop", "Class just ended haha", "Wow! Have a great time.", "Should be there by nine", "Don't forget to review the file"];
const seedConvos: Conversation[] = people.map((user, i) => ({
  id: `c${i}`, user, unread: i === 1 || i === 4 ? 2 : 0, lastAt: ago(10 + i * 37), lastMessage: lastLines[i],
}));
const seedMessages = (chatId: string): Message[] => [
  { id: `${chatId}-1`, chatId, senderId: "u1", text: "Hi! How are you? 😊", createdAt: ago(65), status: "read" },
  { id: `${chatId}-2`, chatId, senderId: "me", text: "Feeling great, how about you?", createdAt: ago(60), status: "read" },
  { id: `${chatId}-3`, chatId, senderId: "u1", text: "Hey, so happy you are down!", createdAt: ago(58), status: "read" },
  { id: `${chatId}-4`, chatId, senderId: "me", text: "That's a cool idea, let's plan it for Friday.", createdAt: ago(40), status: "delivered" },
];

export function useChat() {
  const [conversations] = useState(seedConvos);
  const [activeId, setActiveId] = useState(seedConvos[0].id);
  const [store, setStore] = useState<Record<string, Message[]>>({});
  const [query, setQuery] = useState("");

  const active = conversations.find((c) => c.id === activeId)!;
  const messages = store[activeId] ?? seedMessages(activeId);
  const filtered = useMemo(() => conversations.filter((c) => c.user.name.toLowerCase().includes(query.toLowerCase())), [conversations, query]);

  const send = useCallback((text: string) => {
    const msg: Message = { id: crypto.randomUUID(), chatId: activeId, senderId: "me", text, createdAt: new Date().toISOString(), status: "sent" };
    setStore((s) => ({ ...s, [activeId]: [...(s[activeId] ?? seedMessages(activeId)), msg] }));
    // TODO: socket.emit("message:send", msg)
  }, [activeId]);

  return { conversations: filtered, active, messages, setActiveId, query, setQuery, send };
}
