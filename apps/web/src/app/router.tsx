import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import AppShell from "../components/layout/AppShell"
import AuthLayout from "../layouts/AuthLayout"
import ProtectedRoute from "../components/auth/ProtectedRoute"

import Home from "../pages/Home"
import Dashboard from "../pages/Dashboard"
import AI from "../pages/AI"
import Knowledge from "../pages/Knowledge"
import Analytics from "../pages/Analytics"
import Settings from "../pages/Settings"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ForgotPassword from "../pages/ForgotPassword"

import WorkflowsList from "../pages/workflows"
import CreateWorkflow from "../pages/workflows/create"
import WorkflowDetail from "../pages/workflows/[id]"
import TaskBoard from "../pages/workflows/tasks"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Register />,
      },
    ],
  },
  {
    path: "/forgot-password",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <ForgotPassword />,
      },
    ],
  },
  {
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/ai",
        element: <AI />,
      },
      {
        path: "/knowledge",
        element: <Knowledge />,
      },
      {
        path: "/workflows",
        element: <WorkflowsList />,
      },
      {
        path: "/workflows/create",
        element: <CreateWorkflow />,
      },
      {
        path: "/workflows/:id",
        element: <WorkflowDetail />,
      },
      {
        path: "/workflows/tasks",
        element: <TaskBoard />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
])

export default router