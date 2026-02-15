# Collaborative Fund-Based Expense Management System - Frontend

A modern Next.js application for managing personal and shared expenses with approval workflows.

## Features

- **Authentication**: Secure login and signup with JWT flow.
- **User Dashboard**: Overview of funds, expenses, and pending tasks.
- **Personal Fund**: Manage your personal balance.
- **Co-Spaces**: Create and manage shared expense pools.
- **Expenses**: Track personal and group expenses with status (Pending, Approved, Rejected).
- **Approvals**: Review and approve/reject expense requests.
- **Responsive UI**: Built with Tailwind CSS and Shadcn-like components.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, clsx, tailwind-merge using Shadcn UI principles
- **State Management**: React Context (`AuthContext`)
- **API Client**: Axios with Interceptors
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Create `.env.local` and set your backend URL:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## Project Structure

- `src/app`: App Router pages and layouts.
- `src/components`: Reusable UI components and features.
- `src/context`: React Context providers (Auth).
- `src/lib`: Utilities and API configuration.
- `src/hooks`: Custom React hooks.

## API Integration

The frontend expects a FastAPI backend running at `NEXT_PUBLIC_API_URL`.
Key endpoints used:
- `/auth/login`, `/auth/signup`
- `/users/me/dashboard`, `/users/me/fund`
- `/co-spaces`, `/co-spaces/{id}`
- `/expenses`, `/expenses/pending`
