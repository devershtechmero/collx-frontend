"use client";

import { useAuth as useClerkAuth, useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";
import {
  changeProfilePassword,
  deleteProfile,
  requestForgotPasswordOtp,
  requestLoginOtp,
  requestSignupOtp,
  resetForgottenPassword,
  syncOauthUser,
  updateProfileName,
  verifyLoginOtp,
  verifyForgotPasswordOtp,
  verifySignupOtp,
  type AuthApiError,
  type AuthUser,
} from "@/lib/api/auth";
import { clearAllCollectionData } from "@/lib/store/collection-store";

const AUTH_STORAGE_KEY = "collx_user";
const AUTH_EVENT = "collx-user-updated";
let cachedStoredUserRaw: string | null | undefined;
let cachedStoredUserValue: AuthUser | null = null;

const readStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUserRaw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (storedUserRaw === cachedStoredUserRaw) {
    return cachedStoredUserValue;
  }

  cachedStoredUserRaw = storedUserRaw;
  cachedStoredUserValue = storedUserRaw
    ? (JSON.parse(storedUserRaw) as AuthUser)
    : null;

  return cachedStoredUserValue;
};

const clearStoredUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  cachedStoredUserRaw = null;
  cachedStoredUserValue = null;
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const writeStoredUser = (nextUser: AuthUser | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!nextUser) {
    clearStoredUser();
    return;
  }

  const nextUserRaw = JSON.stringify(nextUser);
  window.localStorage.setItem(AUTH_STORAGE_KEY, nextUserRaw);
  cachedStoredUserRaw = nextUserRaw;
  cachedStoredUserValue = nextUser;
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export function useAuth() {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const clerk = useClerk();
  const router = useRouter();
  const storedUser = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      window.addEventListener(AUTH_EVENT, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(AUTH_EVENT, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    readStoredUser,
    () => null,
  );

  useEffect(() => {
    if (!isLoaded || !clerkUser) {
      return;
    }

    const nextUser = {
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      name:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        clerkUser.username ||
        "Collector",
    };

    if (!nextUser.email) {
      return;
    }

    const syncUser = async () => {
      const token = await getToken();

      if (!token) {
        writeStoredUser(nextUser);
        return;
      }

      try {
        const response = await syncOauthUser({
          ...nextUser,
          clerkId: clerkUser.id,
          token,
        });
        writeStoredUser(response.user);
      } catch {
        writeStoredUser(nextUser);
      }
    };

    void syncUser();
  }, [clerkUser, getToken, isLoaded]);

  const user = clerkUser?.primaryEmailAddress?.emailAddress
    ? {
        email: clerkUser.primaryEmailAddress.emailAddress,
        name:
          storedUser?.name ||
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          "Collector",
      }
    : storedUser;

  const isLoading = !isLoaded;

  const login = async (email: string, pass: string) => {
    try {
      return await requestLoginOtp(email, pass);
    } catch (error) {
      toast.error((error as AuthApiError).message || "Invalid email or password");
      return null;
    }
  };

  const verifyLogin = async (email: string, otp: string) => {
    try {
      const response = await verifyLoginOtp(email, otp);
      const newUser = response.user;
      writeStoredUser(newUser);
      router.push("/dashboard");
      toast.success(`Welcome back, ${newUser.name}!`);
      return true;
    } catch (error) {
      toast.error((error as AuthApiError).message || "Invalid email or password");
      return false;
    }
  };

  const signup = async (email: string, password: string) => {
    return requestSignupOtp(email, password);
  };

  const verifySignup = async (email: string, otp: string) => {
    const response = await verifySignupOtp(email, otp);
    const newUser = response.user;
    writeStoredUser(newUser);
    router.push("/dashboard");
    toast.success(`Welcome, ${newUser.name}!`);
    return response;
  };

  const startForgotPassword = async (email: string) => {
    return requestForgotPasswordOtp(email);
  };

  const verifyForgotPassword = async (email: string, otp: string) => {
    return verifyForgotPasswordOtp(email, otp);
  };

  const resetPassword = async (
    email: string,
    password: string,
    resetToken: string,
  ) => {
    await resetForgottenPassword(email, password, resetToken);
    toast.success("Password updated successfully.");
  };

  const logout = async () => {
    clearStoredUser();

    if (clerkUser) {
      toast.info("Logged out successfully");
      await clerk.signOut({ redirectUrl: "/" });
      return;
    }

    router.replace("/");
    toast.info("Logged out successfully");
  };

  const updateUserName = async (name: string) => {
    if (!user) return false;

    try {
      const token = clerkUser ? await getToken() : undefined;
      const response = await updateProfileName({
        email: user.email,
        name,
        clerkId: clerkUser?.id,
        token: token || undefined,
      });
      writeStoredUser(response.user);
      toast.success("Profile name updated");
      return true;
    } catch (error) {
      toast.error((error as AuthApiError).message || "Unable to update profile name");
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!user) return false;

    try {
      const token = clerkUser ? await getToken() : undefined;
      await changeProfilePassword({
        email: user.email,
        currentPassword,
        newPassword,
        clerkId: clerkUser?.id,
        token: token || undefined,
      });
      toast.success("Password updated successfully.");
      return true;
    } catch (error) {
      toast.error((error as AuthApiError).message || "Unable to update password");
      return false;
    }
  };

  const deleteAccount = async () => {
    if (!user) return false;

    try {
      const token = clerkUser ? await getToken() : undefined;
      await deleteProfile({
        email: user.email,
        clerkId: clerkUser?.id,
        token: token || undefined,
      });
    } catch (error) {
      toast.error((error as AuthApiError).message || "Unable to delete account");
      return false;
    }

    clearAllCollectionData();
    clearStoredUser();
    if (clerkUser) {
      await clerk.signOut({ redirectUrl: "/" });
      return true;
    }

    toast.success("Account deleted successfully");
    router.replace("/");
    return true;
  };

  return {
    user,
    login,
    verifyLogin,
    logout,
    signup,
    verifySignup,
    startForgotPassword,
    verifyForgotPassword,
    resetPassword,
    updateUserName,
    changePassword,
    deleteAccount,
    isLoading,
  };
}
