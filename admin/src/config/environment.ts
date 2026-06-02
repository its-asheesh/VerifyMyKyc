// Environment configuration
export const config = {
  // Client app URL (where users login)
  CLIENT_URL: import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173',
  
  // API base URL
  API_URL: import.meta.env.VITE_API_URL || '/api',
  
  // Admin app URL
  ADMIN_URL: import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174',
}

// Helper function to redirect to client app
export const redirectToClient = (path: string = '/') => {
  window.location.href = `${config.CLIENT_URL}${path}`
}

// Helper function to redirect to admin login
export const redirectToLogin = () => {
  window.location.href = `${config.ADMIN_URL}/login`
} 