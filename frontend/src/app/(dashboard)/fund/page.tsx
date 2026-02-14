"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
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
import { Loader2, Plus, RefreshCw } from "lucide-react";

export default function FundPage() {
    const [loading, setLoading] = useState(true);
    const [fund, setFund] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [updating, setUpdating] = useState(false);

    const fetchFund = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users/me/fund");
            setFund(response.data);
        } catch (error) {
            console.error("Failed to fetch fund", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFund();
    }, []);

    const handleUpdateFund = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        try {
            setUpdating(true);
            // Assuming PUT updates the total or POST adds to it.
            // Prompt says: POST /users/me/fund, PUT /users/me/fund
            // Let's try PUT to set/update the fund.
            await api.put("/users/me/fund", { amount: parseFloat(amount) });
            toast.success("Fund updated successfully");
            setAmount("");
            fetchFund();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update fund");
        } finally {
            setUpdating(false);
        }
    };

    if (loading && !fund) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">My Fund</h2>
                <p className="text-muted-foreground">Manage your personal expense fund.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Balance</CardTitle>
                    <CardDescription>Your available funds for expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        ${fund?.amount?.toFixed(2) || "0.00"}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Add Funds</CardTitle>
                    <CardDescription>Top up your personal fund.</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateFund}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-7"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={updating}>
                            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Plus className="mr-2 h-4 w-4" /> Add Funds
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
