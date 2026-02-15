"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Loader2, Check, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

export default function ApprovalsPage() {
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState<any[]>([]);

    // Confirmation State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [processing, setProcessing] = useState(false);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const res = await api.get("/expenses/pending");
            setPending(res.data);
        } catch (error) {
            console.error("Failed to fetch pending approvals", error);
            // Mock
            setPending([
                { id: "101", description: "Team Dinner", amount: 150, user: "Alice", date: "2024-02-14" },
                { id: "102", description: "Taxi", amount: 25, user: "Bob", date: "2024-02-13" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const openConfirm = (expense: any, type: "approve" | "reject") => {
        setSelectedExpense(expense);
        setActionType(type);
        setConfirmOpen(true);
    };

    const handleAction = async () => {
        if (!selectedExpense || !actionType) return;
        try {
            setProcessing(true);
            // POST /expenses/{expense_id}/approve or reject
            await api.post(`/expenses/${selectedExpense.id}/${actionType}`);
            toast.success(`Expense ${actionType}ed successfully`);
            setConfirmOpen(false);
            fetchPending();
        } catch (error) {
            toast.error(`Failed to ${actionType} expense`);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
                <p className="text-muted-foreground">Review expenses that require your approval.</p>
            </div>

            <div className="grid gap-4">
                {pending.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <Check className="h-10 w-10 text-green-500 mb-4" />
                            <p className="text-muted-foreground">All caught up! No pending approvals.</p>
                        </CardContent>
                    </Card>
                ) : (
                    pending.map(expense => (
                        <Card key={expense.id}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{expense.description}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Requested by <span className="font-semibold">{expense.user}</span> on {new Date(expense.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right mr-4">
                                        <p className="text-lg font-bold">${expense.amount}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => openConfirm(expense, "reject")}>
                                            <X className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openConfirm(expense, "approve")}>
                                            <Check className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Modal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title={actionType === "approve" ? "Approve Expense" : "Reject Expense"}
                description={`Are you sure you want to ${actionType} this expense of $${selectedExpense?.amount}?`}
            >
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        variant={actionType === "reject" ? "destructive" : "default"}
                        onClick={handleAction}
                        disabled={processing}
                        className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm {actionType === "approve" ? "Approval" : "Rejection"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
