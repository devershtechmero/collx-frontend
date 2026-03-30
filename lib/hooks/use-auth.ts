"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { clearAllCollectionData } from "@/lib/store/collection-store";

const AUTH_STORAGE_KEY = "collx_user";
const AUTH_EVENT = "collx-user-updated";

export function useAuth() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    syncUser();
    setIsLoading(false);

    window.addEventListener(AUTH_EVENT, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const persistUser = (nextUser: { email: string; name: string } | null) => {
    if (nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new Event(AUTH_EVENT));
    setUser(nextUser);
  };

  const login = (email: string, pass: string) => {
    if (email === "root@gmail.com" && pass === "root") {
      const newUser = { email, name: "Root Admin" };
      persistUser(newUser);
      router.push("/dashboard");
      toast.success("Welcome back, Root Admin!");
      return true;
    }
    toast.error("Invalid email or password");
    return false;
  };

  const logout = () => {
    persistUser(null);
    router.push("/");
    toast.info("Logged out successfully");
  };

  const updateUserName = (name: string) => {
    if (!user) return;
    persistUser({ ...user, name });
    toast.success("Profile name updated");
  };

  const deleteAccount = () => {
    clearAllCollectionData();
    persistUser(null);
    toast.success("Account deleted successfully");
    router.push("/");
  };

  return { user, login, logout, updateUserName, deleteAccount, isLoading };
}
