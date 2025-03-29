// lib/auth.ts

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  return !!token; // ✅ Returns true if token exists
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const checkAuthentication = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);
};
