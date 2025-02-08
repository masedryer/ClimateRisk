"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    };

    handleAuth();
  }, [router]);

  return <div>Authenticating...</div>;
}