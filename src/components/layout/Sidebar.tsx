
"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/common/Avatar";
import Icon from "@/components/common/Icon";
import type { User } from "@/types/user";
import { userApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
  query: string;
  onQuery: (q: string) => void;
}

export default function Sidebar({
  activeId,
  onSelect,
  query,
  onQuery,
}: Props) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const data = await userApi.getAllUsers();

        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.id !== currentUser?.id &&
    (user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()))
  );

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
            placeholder="Search users"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mute"
          />
        </label>
      </div>

      <ul className="scroll-thin flex-1 overflow-y-auto">
        {loading ? (
          <li className="px-5 py-8 text-center text-sm text-mute">
            Loading users...
          </li>
        ) : (
          <>
            {filteredUsers.map((user) => {
              const active = user.id === activeId;

              return (
                <li key={user.id}>
                  <button
                    onClick={() => onSelect(user.id)}
                    className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                      active ? "bg-brand-soft" : "hover:bg-canvas"
                    }`}
                  >
                    <Avatar
                      src={user.profile ?? undefined}
                      name={user.name}
                      size={48}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">
                        {user.name}
                      </span>

                      <span className="block truncate text-sm text-mute">
                        {user.email}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}

            {filteredUsers.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-mute">
                No users found.
              </li>
            )}
          </>
        )}
      </ul>
    </aside>
  );
}
