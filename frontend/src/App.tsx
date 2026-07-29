import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import AppRouter from "./router";

export default function App() {
  const fetchProfile = useAuthStore(state => state.fetchProfile);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return <AppRouter />;
}
