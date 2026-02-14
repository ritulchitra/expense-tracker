"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Topbar() {
    const { user, logout } = useAuth();

    return (
        <header className="flex h-14 items-center justify-between border-b bg-card px-6 text-card-foreground">
            <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium">Welcome back</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                    {/* Display user name or email if available, otherwise generic */}
                    {user?.name || "User"}
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}
