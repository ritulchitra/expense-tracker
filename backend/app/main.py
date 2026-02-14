from fastapi import FastAPI
from app.api.user_routes import router as user_router
from app.api.fund_routes import router as fund_router
from app.api.co_space_routes import router as co_space_router
from app.api.expense_routes import router as expense_router
from app.api.approval_routes import router as approval_router
from app.api.dashboard_routes import router as dashboard_router





app = FastAPI(
    title="Collaborative Fund-Based Expense Management System",
    description="Backend APIs with Approval Workflow & AI Integration",
    version="1.0.0"
)

app.include_router(user_router)
app.include_router(fund_router)
app.include_router(co_space_router)
app.include_router(expense_router)
app.include_router(approval_router)
app.include_router(dashboard_router)



@app.get("/")
def root():
    return {
        "message": "Collaborative Fund-Based Expense Management System Running"
    }
