"use client";

import React from "react";
import { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/client";

interface AdminHeaderProps {
  user: User | null | undefined;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">
            IMENSIAH
          </h1>
          <Badge variant="error" className="bg-red-600 text-white">
            ADMIN
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 text-gray-300">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm">{user.fullName}</span>
              <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                {user.role}
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
