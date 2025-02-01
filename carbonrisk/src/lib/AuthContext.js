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
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchUserProfile(session.user.id);
            }
            setLoading(false);
        };

        getSession();

        const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchUserProfile(session.user.id);
            } else {
                setUserProfile(null);
            }

            if (event === 'EMAIL_CONFIRMED') {
                router.push('/dashboard');
                router.refresh();
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
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
                   redirectTo: 'https://ycimfxsnhtqakxqaknmj.supabase.co/auth/v1/callback'
                }
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
            console.log('Updating password with token:', token ? 'Present' : 'Missing');
            
            if (!token) {
                throw new Error('Password reset token is missing');
            }
    
            const { error } = await supabase.auth.updateUser(
                { password: newPassword }
            );
            
            console.log('Update password response:', error || 'Success');
            
            if (error) {
                console.error('Update password error:', error);
                throw error;
            }
            
            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error('Caught update password error:', error);
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