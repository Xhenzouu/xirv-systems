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
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },

  {
    element: <AppShell />,
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