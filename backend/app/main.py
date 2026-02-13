from fastapi import FastAPI

app = FastAPI(
    title="Collaborative Fund-Based Expense Management System",
    description="Backend APIs with Approval Workflow & AI Integration",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Collaborative Fund-Based Expense Management System Running"
    }
