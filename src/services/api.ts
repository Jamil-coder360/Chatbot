import type { User } from "@/types/user";
import type { Conversation, Message } from "@/types/message";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? "Request failed");
  return res.json();
}

type Session = { token: string; user: User };
const post = (body: unknown): RequestInit => ({ method: "POST", body: JSON.stringify(body) });

export const api = {
  login: (b: { email: string; password: string }) => request<Session>("/auth/login", post(b)),
  register: (b: { name: string; email: string; password: string }) => request<{ email: string }>("/auth/register", post(b)),
  verifyOtp: (b: { email: string; otp: string }) => request<Session>("/auth/verify-otp", post(b)),
  conversations: () => request<Conversation[]>("/chats"),
  messages: (chatId: string) => request<Message[]>(`/chats/${chatId}/messages`),
};
