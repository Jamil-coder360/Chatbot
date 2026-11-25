import type { User } from "./user";

export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  reciverId: string;
  text: string | null;
  imgUrl?: string | null;
  isSeen: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastAt: string;
  unread: number;
}
