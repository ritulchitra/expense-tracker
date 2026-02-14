import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: string;
}

interface RecentExpensesProps {
    expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>
                    You made {expenses.length} transactions this month.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{expense.description}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(expense.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">-{expense.amount}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
