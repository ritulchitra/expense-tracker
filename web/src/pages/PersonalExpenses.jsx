import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

function PersonalExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TEMP: hardcoded member id (same idea as Flutter)
  const MEMBER_ID = "me";

  useEffect(() => {
    apiFetch(`/expenses/personal?member_id=${MEMBER_ID}`)
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const total = expenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  if (loading) return <p>Loading personal expenses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Personal Expenses</h2>
      <p><strong>Total spent:</strong> ₹{total}</p>

      {expenses.length === 0 ? (
        <p>No personal expenses yet</p>
      ) : (
        <ul>
          {expenses.map((e) => (
            <li key={e.expense_id}>
              {e.description} — ₹{e.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PersonalExpenses;
