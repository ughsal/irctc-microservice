"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../lib/store/auth.store";

export default function Providers({ children }: { children: ReactNode }) {
  const fetchProfile = useAuthStore(state => state.fetchProfile);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
      {children}
    </GoogleOAuthProvider>
  );
}
