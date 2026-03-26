"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("collx_user");
    setUser(null);
    router.push("/");
  };

  return { user, login, logout, isLoading };
}
