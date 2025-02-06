//ProtectedRoute.js
"use client";

import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation'; // Correct use of next/navigation
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter(); // Correctly using useRouter from next/navigation
  const pathname = usePathname(); // Correctly using usePathname from next/navigation

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/about'];

  useEffect(() => {
    // Redirect to login if not loading, no user is authenticated, and the path is not one of the public paths
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push('/login'); // Redirect to login
      router.refresh(); // Ensuring the page is refreshed to reflect the current auth state
    }
  }, [user, loading, pathname]); // Dependency array includes user, loading state, and current pathname

  if (loading) {
    // Show a loading spinner while authentication state is being determined
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Optionally render nothing if user is not authenticated and the path requires authentication
  if (!user && !publicPaths.includes(pathname)) {
    return null;
  }

  // Render children for routes that are either public or when the user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
