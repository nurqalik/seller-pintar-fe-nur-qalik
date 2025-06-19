"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useUserDataStore } from "../../../store/userdata";

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { userData } = useUserDataStore();

  // Auto-fill form if coming from registration
  useEffect(() => {
    const username = userData.username;
    const password = userData.password;

    if (username && password) {
      setFormData({
        username: decodeURIComponent(username),
        password: decodeURIComponent(password),
      });
    }
  }, [userData.username, userData.password]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "https://test-fe.mysellerpintar.com/api/auth/login",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      // Login successful
      toast.success("Login successful!", {
        description: "Welcome back! Redirecting to dashboard...",
        duration: 3000,
      });

      // Store the token if it's returned in the response
      if (response.data?.token && typeof window !== undefined) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("username", formData.username);
      }

      // Redirect to dashboard
      setTimeout(() => {
        const role = typeof window !== undefined && localStorage.getItem("role");
        if (role === "Admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      // Type guard for AxiosError (without using any or unknown)
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as import("axios").AxiosError).isAxiosError
      ) {
        const axiosError = error as import("axios").AxiosError<{ message?: string; error?: string }>;
        if (axiosError.response) {
          errorMessage =
            axiosError.response.data?.message ||
            axiosError.response.data?.error ||
            errorMessage;
          setErrors({ general: errorMessage });
        } else if (axiosError.request) {
          errorMessage =
            "Network error. Please check your connection and try again.";
          setErrors({ general: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: errorMessage });
      }

      toast.error("Login failed", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-blue-200">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <LogIn className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-blue-900">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-blue-600">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-blue-900 font-medium">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`border-blue-200 focus:border-blue-500 focus:ring-blue-500 ${
                errors.username ? "border-red-500" : ""
              }`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-900 font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`border-blue-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-medium text-blue-700 hover:text-blue-800 underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
