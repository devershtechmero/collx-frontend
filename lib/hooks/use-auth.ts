"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useAuth() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("collx_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    if (email === "root@gmail.com" && pass === "root") {
      const newUser = { email, name: "Root Admin" };
      localStorage.setItem("collx_user", JSON.stringify(newUser));
      setUser(newUser);
      router.push("/dashboard");
      toast.success("Welcome back, Root Admin!");
      return true;
    }
    toast.error("Invalid email or password");
    return false;
  };

  const logout = () => {
    localStorage.removeItem("collx_user");
    setUser(null);
    router.push("/");
    toast.info("Logged out successfully");
  };

  return { user, login, logout, isLoading };
}
