"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Token extraction logic
    const extractToken = () => {
      if (typeof window !== 'undefined') {
        // First, check hash fragment
        const hash = window.location.hash;
        const hashToken = hash.split('access_token=')[1]?.split('&')[0];
        
        if (hashToken) {
          console.log('Token found in hash', hashToken);
          setAccessToken(hashToken);
          return;
        }

        // Then, check search parameters
        const urlParams = new URLSearchParams(window.location.search);
        const searchToken = urlParams.get('access_token');
        
        if (searchToken) {
          console.log('Token found in search params', searchToken);
          setAccessToken(searchToken);
          return;
        }

        // Log full URL for debugging
        console.log('Full URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        console.log('Search:', window.location.search);

        // Set error if no token found
        setError('Invalid or missing reset token. Please try requesting a new password reset.');
      }
    };

    extractToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      setError('Invalid or missing reset token. Please try requesting a new password reset.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use Supabase's updateUser method directly
      const { error } = await supabase.auth.updateUser(accessToken, {
        password: password
      });

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      router.push('/login?reset=success');
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
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
                className="mt-1"
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
                className="mt-1"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !accessToken}
            >
              {loading ? 'Updating password...' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;