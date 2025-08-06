"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

interface AppState {
  theme: "light" | "dark"
  sidebarOpen: boolean
  notifications: Notification[]
  user: User | null
}

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  timestamp: string
}

type AppAction =
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_USER"; payload: User | null }

const initialState: AppState = {
  theme: "light",
  sidebarOpen: false,
  notifications: [],
  user: null,
}

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload }
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [...state.notifications, action.payload] }
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }
    case "SET_USER":
      return { ...state, user: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
