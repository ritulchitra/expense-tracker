"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Receipt } from "lucide-react";
import { toast } from "sonner";

export default function ExpensesPage() {
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Expense State
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [coSpaceId, setCoSpaceId] = useState(""); // Optional
    const [creating, setCreating] = useState(false);

    // Co-spaces list for dropdown (optional)
    const [coSpaces, setCoSpaces] = useState<any[]>([]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await api.get("/expenses/my");
            setExpenses(res.data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCoSpaces = async () => {
        try {
            const res = await api.get("/co-spaces");
            setCoSpaces(res.data);
        } catch (e) { console.error(e) }
    }

    useEffect(() => {
        fetchExpenses();
        fetchCoSpaces();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreating(true);
            const payload: any = {
                description,
                amount: parseFloat(amount),
            };
            if (coSpaceId) payload.co_space_id = coSpaceId;

            await api.post("/expenses", payload);
            toast.success("Expense created");
            setIsModalOpen(false);
            setDescription("");
            setAmount("");
            setCoSpaceId("");
            fetchExpenses();
        } catch (error) {
            toast.error("Failed to create expense");
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Expenses</h2>
                    <p className="text-muted-foreground">Track your personal and shared expenses.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Expense
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    {expenses.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">No expenses found.</div>
                    ) : (
                        <div className="space-y-4">
                            {expenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Receipt className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{expense.description}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">${expense.amount}</p>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Expense">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Input id="desc" value={description} onChange={e => setDescription(e.target.value)} required placeholder="e.g. Dinner" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cospace">Co-Space (Optional)</Label>
                        <select
                            id="cospace"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={coSpaceId}
                            onChange={e => setCoSpaceId(e.target.value)}
                        >
                            <option value="">Personal Expense</option>
                            {coSpaces.map(space => (
                                <option key={space.id} value={space.id}>{space.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={creating}>
                            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
