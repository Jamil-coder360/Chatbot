
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { User } from "@/types/user";
import type {
  Message,
  Conversation,
} from "@/types/message";

import {
  userApi,
  conversationApi,
  messageApi,
} from "@/services/api";

import { useAuth } from "@/context/AuthContext";

export function useChat() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState("");
  const [activeChat, setActiveChat] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const selectionVersion = useRef(0);

  useEffect(() => {
    if (!currentUser?.id) return;

    let active = true;
    const fetchUsers = async () => {
      try {
        const data = await userApi.getAllUsers();
        if (active) {
          setUsers(data.filter((item) => item.id !== currentUser.id));
        }
      } catch (error) {
        if (active) {
          console.error("Failed to load users:", error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchUsers();
    return () => {
      active = false;
    };
  }, [currentUser?.id]);

  // Selected user
  const activeUser = useMemo(
    () =>
      users.find((item) => item.id === activeUserId) ?? null,
    [users, activeUserId]
  );

  // Search users
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return users.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search)
    );
  }, [users, query]);

  // Select user and load/create chat
  const setActiveId = useCallback(
    async (userId: string) => {
      const selection = ++selectionVersion.current;

      setActiveUserId(userId);
      setActiveChat(null);
      setMessages([]);
      setChatError("");
      setMessagesLoading(true);

      try {
        const conversation =
          await conversationApi.getOrCreateChat(userId);

        if (selection !== selectionVersion.current) return;
        setActiveChat(conversation);

        const data = await messageApi.getMessages(
          conversation.id
        );

        if (selection === selectionVersion.current) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to open chat:", error);
        if (selection === selectionVersion.current) {
          setChatError(
            error instanceof Error ? error.message : "Failed to open chat."
          );
        }
      } finally {
        if (selection === selectionVersion.current) {
          setMessagesLoading(false);
        }
      }
    },
    []
  );

  // Send message to database
  const activeChatId = activeChat?.id;
  const send = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();

      if (!trimmedText || !activeChatId || sending) return;

      try {
        setSending(true);

        const savedMessage = await messageApi.sendMessage(
          activeChatId,
          trimmedText
        );

        setMessages((previous) => [
          ...previous,
          savedMessage,
        ]);
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      } finally {
        setSending(false);
      }
    },
    [activeChatId, sending]
  );

  return {
    conversations: filtered,
    users: filtered,

    active: activeUser
      ? {
          id: activeChat?.id ?? "",
          user: activeUser,
        }
      : null,

    messages,

    setActiveId,
    activeUserId,
    query,
    setQuery,
    send,

    loading,
    messagesLoading,
    sending,
    chatError,
  };
}
