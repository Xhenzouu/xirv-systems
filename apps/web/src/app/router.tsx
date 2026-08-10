import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import AppShell from "../components/layout/AppShell"
import AuthLayout from "../layouts/AuthLayout"

import Home from "../pages/Home"
import Dashboard from "../pages/Dashboard"
import AI from "../pages/AI"
import Knowledge from "../pages/Knowledge"
import Analytics from "../pages/Analytics"
import Settings from "../pages/Settings"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ForgotPassword from "../pages/ForgotPassword"

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
    path: "/dashboard",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/ai",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <AI />,
      },
    ],
  },
  {
    path: "/knowledge",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Knowledge />,
      },
    ],
  },
  {
    path: "/analytics",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Analytics />,
      },
    ],
  },
  {
    path: "/settings",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Settings />,
      },
    ],
  },
])

export default router