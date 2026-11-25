import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export function getSocket(token?: string): Socket | null {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!url) return null; // no backend configured: UI runs on mock data
  if (!socket) socket = io(url, { auth: { token }, autoConnect: false });
  return socket;
}
