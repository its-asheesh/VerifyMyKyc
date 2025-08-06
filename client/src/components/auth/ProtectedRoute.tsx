import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'

interface ProtectedRouteProps {
  children: React.ReactElement
  requiredRole?: 'user' | 'admin'
  fallbackPath?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // If role is required and user doesn't have it
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Specific role-based route components
export const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin" fallbackPath="/login">
    {children}
  </ProtectedRoute>
)

export const UserRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
  <ProtectedRoute requiredRole="user" fallbackPath="/login">
    {children}
  </ProtectedRoute>
)

export const AnyRoleRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
  <ProtectedRoute fallbackPath="/login">
    {children}
  </ProtectedRoute>
) 