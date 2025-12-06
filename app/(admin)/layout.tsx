"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNav } from "@/components/admin/AdminNav";
import { LoadingState } from "@/components/ui/state-components";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Fetch current user
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  // Redirect non-admins to user dashboard
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  React.useEffect(() => {
    if (user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center">
        <LoadingState message="Carregando..." size="lg" />
      </div>
    );
  }

  // Don't render while redirecting non-admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center">
        <LoadingState message="Redirecionando..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
