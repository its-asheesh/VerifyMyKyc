import type React from "react"
import AppRoutes from "./routes/AppRoutes"
import "./App.css"
import { ToastProvider } from "./components/common/ToastProvider"

const App: React.FC = () => {
  return (
    <ToastProvider>
      <div id="recaptcha-container" className="hidden" />
      <AppRoutes />
    </ToastProvider>
  )
}

export default App
