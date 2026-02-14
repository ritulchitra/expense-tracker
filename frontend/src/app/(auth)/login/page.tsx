"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // The backend expects x-www-form-urlencoded usually for OAuth2PasswordRequestForm
            // But the requirement says "FastAPI with JWT authentication" and requirements usually imply JSON or form data.
            // Standard FastAPI OAuth2 uses form-data.
            // The requirement says "POST /auth/login".
            // I will assume JSON first as per "modern" standards, but if it fails I'll switch to form-data.
            // Wait, typical FastAPI `OAuth2PasswordRequestForm` expects `username` and `password` as form data.
            // But the user prompt says "POST /auth/login" returns token.
            // I will try to send JSON first.

            const response = await api.post("/auth/login", formData); // Try JSON
            login(response.data.access_token);
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 422) {
                // It might be expecting form data
                try {
                    const formDataBody = new FormData();
                    formDataBody.append("username", formData.username);
                    formDataBody.append("password", formData.password);
                    const res = await api.post("/auth/login", formDataBody, {
                        headers: { "Content-Type": "multipart/form-data" } // or application/x-www-form-urlencoded
                    });
                    login(res.data.access_token);
                    return;
                } catch (retryError: any) {
                    toast.error(retryError.response?.data?.detail || "Login failed");
                }
            } else {
                toast.error(error.response?.data?.detail || "Invalid credentials");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            placeholder="johndoe"
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign In
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
