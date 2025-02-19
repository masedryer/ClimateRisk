"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext'; // Adjust this import path based on your project structure
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!email) {
            setError('Please enter your email address');
            setLoading(false);
            return;
        }

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (error) {
            console.error('Password reset error:', error);
            setError('Failed to send reset instructions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        Reset Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <Alert className="bg-green-50">
                            <AlertDescription className="text-center">
                                If an account exists with this email, you will receive password reset instructions shortly. Please check your inbox and spam folder.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1"
                                    placeholder="Enter your email"
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
                                disabled={loading}
                            >
                                {loading ? 'Sending reset instructions...' : 'Send reset instructions'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link href="/login" className="text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
