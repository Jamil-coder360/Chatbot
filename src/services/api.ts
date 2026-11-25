
import type { User } from "@/types/user";
import type { Conversation, Message } from "@/types/message";

const BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8001/api/v1";

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...init.headers,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }

  return (json.data ?? json) as T;
}

type LoginResponse = {
  accessToken: string;
};

const post = (body: unknown): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});


export const conversationApi = {
  getConversations: () =>
    request<Conversation[]>("/chats", {
      method: "GET",
    }),

  getOrCreateChat: (userId: string) =>
    request<Conversation>(`/chats/${userId}`, {
      method: "POST",
    }),
};

export const messageApi = {
  getMessages: (chatId: string) =>
    request<Message[]>(`/chats/${chatId}/messages`, {
      method: "GET",
    }),

  sendMessage: (chatId: string, text: string) =>
    request<Message>(`/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};



export const userApi = {
  getAllUsers: async () => {
    return request<User[]>("/user", {
      method: "GET",
    });
  },
};
export const api = {
  login: (b: {
    email: string;
    password: string;
  }) =>
    request<LoginResponse>("/auth/login", post(b)),

  register: (b: {
    name: string;
    email: string;
    password: string;
  }) =>
    request<{
      email: string;
      token: string;
    }>("/user/", post(b)),

  verifyOtp: (b: {
    token: string;
    otp: string;
  }) =>
    request<{
      id: string;
      email: string;
      accessToken: string;
    }>("/otp/verify-otp", post(b)),

  resendOtp: (b: {
    email: string;
  }) =>
    request<{
      token: string;
    }>("/otp/resend-otp", post(b)),

  conversations: () =>
    request<Conversation[]>("/chats"),

  messages: (chatId: string) =>
    request<Message[]>(`/chats/${chatId}/messages`),
};
