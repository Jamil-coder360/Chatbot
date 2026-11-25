"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import Avatar from "@/components/common/Avatar";
import Icon from "@/components/common/Icon";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/AuthContext";

const media = [11, 22, 33, 44, 55, 66].map((n) => `https://picsum.photos/seed/chat${n}/200`);

export default function ChatLayout() {
  const { user } = useAuth();
  const chat = useChat();
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const { active } = chat;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-white">
      <nav className="hidden w-[72px] flex-col items-center gap-2 bg-brand py-5 text-white/70 lg:flex" aria-label="Main">
        <span className="mb-4 text-2xl font-black text-white">m</span>
        {(["chat", "users", "bell", "gear"] as const).map((n, i) => (
          <button key={n} className={`grid h-11 w-11 place-items-center rounded-xl transition-colors hover:bg-white/15 ${i === 0 ? "bg-white/20 text-white" : ""}`} aria-label={n}><Icon name={n} /></button>
        ))}
        <div className="mt-auto flex flex-col items-center gap-3">
          <button className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/15" aria-label="Sign out"><Icon name="out" /></button>
          <Avatar name={user?.name ?? "Me"} src={user?.avatar} size={38} />
        </div>
      </nav>

      <div className={`${mobileView === "list" ? "flex" : "hidden"} w-full md:flex md:w-auto`}>
        <Sidebar conversations={chat.conversations} activeId={active.id} query={chat.query} onQuery={chat.setQuery}
          onSelect={(id) => { chat.setActiveId(id); setMobileView("chat"); }} />
      </div>

      <section className={`${mobileView === "chat" ? "flex" : "hidden"} min-w-0 flex-1 flex-col bg-canvas md:flex`}>
        <ChatHeader user={active.user} onBack={() => setMobileView("list")} />
        <MessageList messages={chat.messages} meId="me" typing={active.user.typing} />
        <ChatInput onSend={chat.send} />
      </section>

      <aside className="hidden w-[300px] shrink-0 flex-col border-l border-line bg-white p-6 xl:flex">
        <div className="flex flex-col items-center text-center">
          <Avatar src={active.user.avatar} name={active.user.name} size={104} />
          <h2 className="mt-4 text-xl font-extrabold">{active.user.name}</h2>
          <p className="text-sm text-mute">{active.user.online ? "Active now" : "Offline"}</p>
          <div className="mt-4 flex gap-3 text-brand">
            {(["bell", "search"] as const).map((n) => <button key={n} className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft" aria-label={n}><Icon name={n} size={18} /></button>)}
          </div>
        </div>
        <h3 className="mb-3 mt-8 text-sm font-bold">Shared media</h3>
        <div className="grid grid-cols-3 gap-2">
          {media.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="aspect-square rounded-lg object-cover" />
          ))}
        </div>
        <ul className="mt-8 space-y-1 text-sm font-semibold">
          <li><button className="w-full rounded-lg px-2 py-2.5 text-left hover:bg-canvas">Shared files</button></li>
          <li><button className="w-full rounded-lg px-2 py-2.5 text-left hover:bg-canvas">Privacy &amp; support</button></li>
          <li><button className="w-full rounded-lg px-2 py-2.5 text-left text-red-500 hover:bg-red-50">Block {active.user.name.split(" ")[0]}</button></li>
        </ul>
      </aside>
    </div>
  );
}
