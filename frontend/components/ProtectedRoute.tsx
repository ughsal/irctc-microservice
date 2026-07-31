"use client";

import { useAuthStore } from "../lib/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return <p>Loading...</p>;

  return children;
}
