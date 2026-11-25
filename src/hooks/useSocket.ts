"use client";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "@/services/socket";

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const s = getSocket(localStorage.getItem("token") ?? undefined);
    s?.connect();
    setSocket(s);
    return () => { s?.disconnect(); };
  }, []);
  return socket;
}
