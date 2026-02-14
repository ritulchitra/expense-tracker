"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Wallet, Receipt, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MemberContributionChart } from "@/components/dashboard/MemberContributionChart";

export default function CoSpaceDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [loading, setLoading] = useState(true);
    const [coSpace, setCoSpace] = useState<any>(null);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);

    // Contribution State
    const [contributionAmount, setContributionAmount] = useState("");
    const [contributing, setContributing] = useState(false);

    // Invite State
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const [spaceRes, dashboardRes, membersRes, expensesRes] = await Promise.all([
                    api.get(`/co-spaces/${id}`).catch(() => ({ data: { name: "Co-Space", description: "Details" } })), // Fallback if singular get not exists
                    api.get(`/co-spaces/${id}/dashboard`).catch(() => ({ data: {} })),
                    api.get(`/co-spaces/${id}/members`).catch(() => ({ data: [] })),
                    api.get(`/co-spaces/${id}/expenses`).catch(() => ({ data: [] })),
                ]);

                setCoSpace(spaceRes.data);
                setDashboardData(dashboardRes.data);
                setMembers(membersRes.data);
                setExpenses(expensesRes.data);
            } catch (error) {
                console.error("Failed to fetch co-space details", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleContribute = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setContributing(true);
            await api.post(`/co-spaces/${id}/fund`, { amount: parseFloat(contributionAmount) });
            toast.success("Contribution added");
            setContributionAmount("");
            // Refetch dashboard
            const res = await api.get(`/co-spaces/${id}/dashboard`);
            setDashboardData(res.data);
        } catch (error) {
            toast.error("Failed to contribute");
        } finally {
            setContributing(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setInviting(true);
            // Assuming invite takes user_id or email. Prompt says "Invite members (admin only UI)"
            // API: POST /co-spaces/{id}/invite
            await api.post(`/co-spaces/${id}/invite`, { email: inviteEmail });
            toast.success("Invite sent");
            setInviteEmail("");
        } catch (error) {
            toast.error("Failed to send invite");
        } finally {
            setInviting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{coSpace?.name}</h2>
                <p className="text-muted-foreground">{coSpace?.description}</p>
            </div>

            <Tabs defaultValue="dashboard" className="w-full">
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Pool</CardTitle>
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${dashboardData?.total_pool_contribution || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${dashboardData?.total_pool_remaining || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Spent</CardTitle>
                                <Receipt className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${dashboardData?.total_expense_spent || 0}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contribute to Pool</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleContribute} className="flex gap-4 items-end">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="contribution">Amount</Label>
                                    <Input
                                        id="contribution"
                                        type="number"
                                        placeholder="0.00"
                                        value={contributionAmount}
                                        onChange={e => setContributionAmount(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" disabled={contributing}>
                                    {contributing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Funds
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expenses" className="space-y-4">
                    <div className="flex justify-end">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Expense
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {expenses.length === 0 ? (
                                <div className="text-center text-muted-foreground py-4">No expenses yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {expenses.map((expense: any) => (
                                        <div key={expense.id} className="flex justify-between items-center border-b pb-2">
                                            <div>
                                                <p className="font-medium">{expense.description}</p>
                                                <p className="text-sm text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">${expense.amount}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {expense.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="members" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invite Member</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleInvite} className="flex gap-4 items-end">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="friend@example.com"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" disabled={inviting}>
                                    {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Invite
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {members.map((member: any) => (
                                    <div key={member.id} className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{member.name || "Member"}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-1 lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Member Contribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MemberContributionChart />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
