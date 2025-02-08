"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Ensure correct import
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Extract token from URL hash or search params
    const extractToken = () => {
      if (typeof window !== "undefined") {
        let token = null;

        // Supabase sends token as a hash fragment (after #)
        if (window.location.hash.includes("access_token")) {
          token = new URLSearchParams(window.location.hash.replace("#", "?")).get("access_token");
        } 
        // Check if it's in search params (some versions of Supabase may use ?access_token)
        else {
          token = searchParams.get("access_token");
        }

        if (token) {
          console.log("Reset token found:", token);
          setAccessToken(token);
        } else {
          console.error("No reset token found in URL");
          setError("Invalid or missing reset token. Please request a new password reset.");
        }
      }
    };

    extractToken();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      setError("Invalid or missing reset token. Please try requesting a new password reset.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Supabase method to update password
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      router.push("/login?reset=success");
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Set New Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !accessToken}>
              {loading ? "Updating password..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
