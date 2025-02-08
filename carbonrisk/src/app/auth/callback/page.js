"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase"; // Import the single instance of Supabase client

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Force refresh session to avoid stale data issues
      await supabase.auth.refreshSession();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("Authentication error:", error);
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    };

    handleAuth();
  }, [router]);

  return <div>Authenticating...</div>;
}
