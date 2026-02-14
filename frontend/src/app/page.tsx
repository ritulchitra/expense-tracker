"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [loading, isAuthenticated, router]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 pb-2">
                    ExpenseTracker
                </h1>
                <p className="text-xl text-muted-foreground text-center max-w-2xl">
                    Collaborative fund-based expense management with approval workflows.
                    Manage your personal and shared expenses with ease.
                </p>

                <div className="flex gap-4 mt-8">
                    <Link
                        href="/login"
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-500/20"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/signup"
                        className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </main>
    );
}
