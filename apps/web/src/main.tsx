import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import router from "./app/router"
import "./index.css"
import { AuthProvider } from "./context/AuthContext"
import ToastProvider from "./components/ui/ToastProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)