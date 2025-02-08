"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase"; // Import the single instance of Supabase client

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      // Ensure fresh session data
      await supabase.auth.refreshSession();
      const { data: { session } } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    // Listen for authentication state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, "Session:", session);

        if (session) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }

        if (event === "SIGNED_IN" || event === "EMAIL_CONFIRMED") {
          router.push("/dashboard");
          router.refresh();
        } else if (event === "SIGNED_OUT") {
          router.push("/login");
          router.refresh();
        }

        setLoading(false);
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: email,
            full_name: userData.fullName,
            username: userData.username,
            phone_number: userData.phoneNumber,
            date_of_birth: userData.dateOfBirth,
            bio: userData.bio,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email_verified: false,
          },
        ]);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      router.push("/dashboard");
      router.refresh();

      return data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (token, newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser(token, {
        password: newPassword,
      });
      if (error) throw error;
      router.push("/login?reset=success");
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
      await fetchUserProfile(user.id);
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        resendVerificationEmail,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
