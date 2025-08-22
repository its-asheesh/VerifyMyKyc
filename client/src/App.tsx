import type React from "react"
import AppRoutes from "./routes/AppRoutes"
import "./App.css"
import { ToastProvider } from "./components/common/ToastProvider"

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  )
}

export default App
