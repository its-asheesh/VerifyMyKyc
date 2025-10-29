import type React from "react"
import AppRoutes from "./routes/AppRoutes"
import "./App.css"
import { ToastProvider } from "./components/common/ToastProvider"
import { useAutoLogout } from "./hooks/useAutoLogout"

const App: React.FC = () => {
  // Auto-logout after 15 days
  useAutoLogout()

  return (
    <ToastProvider>
      <div id="recaptcha-container" className="hidden" />
      <AppRoutes />
    </ToastProvider>
  )
}

export default App
