import type React from "react"
import AppRoutes from "./routes/AppRoutes"
import "./App.css"
import { ToastProvider } from "./components/common/ToastProvider"
import { HelmetProvider } from "react-helmet-async"

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ToastProvider>
        <div id="recaptcha-container" className="hidden" />
        <AppRoutes />
      </ToastProvider>
    </HelmetProvider>
  )
}

export default App
