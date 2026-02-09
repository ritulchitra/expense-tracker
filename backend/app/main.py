from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users, projects, pending_expenses, expense_approvals,finalize_expenses,project_fund, balances

app = FastAPI(
    title="Expense Tracker API",
    version="0.1.0"
)

# routers
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(pending_expenses.router)
app.include_router(expense_approvals.router)
app.include_router(finalize_expenses.router)
app.include_router(project_fund.router)
app.include_router(balances.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "expense-tracker-backend"
    }