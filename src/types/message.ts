import type { User } from "./user";

export type MessageStatus = "sent" | "delivered" | "read";
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO
  status: MessageStatus;
}
export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastAt: string;
  unread: number;
}
