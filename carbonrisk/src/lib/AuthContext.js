// AuthContext.js
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Initialize session from local storage if available
        const savedSession = localStorage.getItem('supabase.auth.token');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                if (session?.currentSession?.access_token) {
                    supabase.auth.setSession({
                        access_token: session.currentSession.access_token,
                        refresh_token: session.currentSession.refresh_token
                    });
                }
            } catch (error) {
                console.error('Error restoring session:', error);
            }
        }

        // Get initial session
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                
                if (session) {
                    setUser(session.user);
                    await fetchUserProfile(session.user.id);
                    localStorage.setItem('supabase.auth.token', JSON.stringify({
                        currentSession: session
                    }));
                }
            } catch (error) {
                console.error('Session retrieval error:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Auth state change listener
        const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchUserProfile(session.user.id);
                    localStorage.setItem('supabase.auth.token', JSON.stringify({
                        currentSession: session
                    }));
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setUserProfile(null);
                localStorage.removeItem('supabase.auth.token');
            }

            if (event === 'EMAIL_CONFIRMED') {
                router.push('/dashboard');
                router.refresh();
            }

            setLoading(false);
        });

        // Periodic session refresh
        const refreshInterval = setInterval(async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session && !error) {
                setUser(session.user);
                await fetchUserProfile(session.user.id);
            }
        }, 1800000); // 30 minutes

        // Error handler
        const handleError = async (error) => {
            if (error?.message?.includes('JWT expired')) {
                await supabase.auth.refreshSession();
            }
        };

        supabase.auth.onError(handleError);

        return () => {
            subscription?.unsubscribe();
            clearInterval(refreshInterval);
        };
    }, []);

    const fetchUserProfile = async (userId) => {
        if (!userId) return;
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            if (data) {
                setUserProfile(data);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const signUp = async (email, password, userData) => {
        try {
            // Check if email already exists
            const { data: existingUser, error: emailCheckError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', email)
                .single();
    
            if (existingUser) {
                throw new Error('This email is already in use. Please use a different email.');
            }
    
            if (emailCheckError && emailCheckError.code !== 'PGRST116') {
                throw emailCheckError; // Throw only if it's not a "no rows found" error
            }
    
            // Proceed with signup if email is not found
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData,
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });
    
            if (error) throw error;
    
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: data.user.id,
                        email: email,
                        full_name: userData.fullName,
                        username: userData.username,
                        phone_number: userData.phoneNumber,
                        date_of_birth: userData.dateOfBirth,
                        bio: userData.bio,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        email_verified: false
                    }]);
    
                if (profileError) throw profileError;
            }
    
            return data;
        } catch (error) {
            throw error;
        }
    };
    
    const signInWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                        client_id: '135263384467-n14u02ci5micadg7rcl3rohct90lq4p1.apps.googleusercontent.com'
                    },
                    redirectTo: `${window.location.origin}/dashboard`
                }
                
            });
    
            if (error) throw error;
    
            if (data.session) {
                setUser(data.session.user);
                fetchUserProfile(data.session.user.id).then(() => {
                    router.push('/dashboard');
                    router.refresh();
                });
            }
            return data;
        } catch (error) {
            throw error;
        }
    };
    

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            router.push('/dashboard');
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
            router.push('/login');
            router.refresh();
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    };

    const updatePassword = async (token, newPassword) => {
        try {
            const { error } = await supabase.auth.updateUser(token, { password: newPassword });
            if (error) throw error;
            router.push('/login?reset=success');
            router.refresh();
        } catch (error) {
            console.error('Update password error:', error);
            throw error;
        }
    };
    

    const resendVerificationEmail = async (email) => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
        } catch (error) {
            throw error;
        }
    };

    const updateProfile = async (updates) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
            await fetchUserProfile(user.id);
            router.refresh();
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
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
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};