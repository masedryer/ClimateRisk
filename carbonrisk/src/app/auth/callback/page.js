"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Listen for auth state change
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth event:", event, session);
            if (session) {
              console.log("User authenticated, redirecting...");
              router.push("/dashboard");
            } else {
              console.warn("No session found, redirecting to login.");
              router.push("/login");
            }
          }
        );

        // Manually check if session exists in case auth state change didn't trigger
        const { data: session } = await supabase.auth.getSession();

        if (session.session) {
          console.log("Session found on first check, redirecting...");
          router.push("/dashboard");
        } else {
          console.log("No session found on first check, waiting for auth change...");
        }

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login");
      }
    };

    handleAuth();
  }, [router]);

  return <div>Authenticating...</div>;
}
