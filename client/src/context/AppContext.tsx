"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { AppNotification, AppUser } from "../types/shared"

interface AppState {
  theme: "light" | "dark"
  sidebarOpen: boolean
  notifications: AppNotification[]
  user: AppUser | null
}

type AppAction =
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "ADD_NOTIFICATION"; payload: AppNotification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_USER"; payload: AppUser | null }

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

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
