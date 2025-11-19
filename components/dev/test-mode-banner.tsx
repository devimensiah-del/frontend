"use client";

import { isTestMode, getTestRole, setTestRole } from "@/lib/test-mode";
import { useEffect, useState } from "react";

export function TestModeBanner() {
  const [enabled, setEnabled] = useState(false);
  const [role, setRole] = useState<string>("user");

  useEffect(() => {
    setEnabled(isTestMode());
    setRole(getTestRole());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "__TEST_ROLE") setRole(e.newValue || "user");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-white/95 shadow-lg backdrop-blur p-3 flex items-center gap-2 text-sm">
      <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-900 border border-yellow-300">TEST MODE</span>
      <span className="text-gray-600">Role:</span>
      <button
        className={`px-2 py-1 rounded border ${role === 'user' ? 'bg-[hsl(195_100%_8%)] text-white' : 'bg-white'}`}
        onClick={() => setTestRole('user')}
      >User</button>
      <button
        className={`px-2 py-1 rounded border ${role === 'admin' ? 'bg-[hsl(195_100%_8%)] text-white' : 'bg-white'}`}
        onClick={() => setTestRole('admin')}
      >Admin</button>
    </div>
  );
}

