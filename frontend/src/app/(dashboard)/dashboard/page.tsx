"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/users/me/dashboard");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                // Mock data for development if backend is not ready
                setData({
                    total_fund: 5000,
                    remaining_fund: 3200,
                    monthly_expense: 450,
                    yearly_expense: 5400,
                    pending_approvals: 2,
                    recent_expenses: [
                        { id: "1", description: "Team Lunch", amount: 120, date: "2024-02-14", status: "approved" },
                        { id: "2", description: "Office Supplies", amount: 45, date: "2024-02-12", status: "pending" },
                        { id: "3", description: "Taxi", amount: 25, date: "2024-02-10", status: "approved" },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <StatsCards data={data} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    {/* Chart placeholder */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OverviewChart />
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3">
                    <RecentExpenses expenses={data.recent_expenses || []} />
                </div>
            </div>
        </div>
    );
}
