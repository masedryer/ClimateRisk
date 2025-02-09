"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
    phoneNumber: "",
    dateOfBirth: "",
    bio: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  // Validation function
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        username: formData.username,
        phoneNumber: formData.phoneNumber || null,
        dateOfBirth: formData.dateOfBirth || null,
        bio: formData.bio || ""
      });

      if (response.success) {
        setVerificationSent(true);

        // Reset form after successful signup
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          username: "",
          phoneNumber: "",
          dateOfBirth: "",
          bio: ""
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Verify Your Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              We've sent a verification email to {formData.email}. Please check your inbox and click the verification link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleSignUp}
            className="w-full mb-4 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4" autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium">
                Bio (Optional)
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
