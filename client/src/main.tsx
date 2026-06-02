import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PricingProvider } from './context/PricingContext'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PricingProvider>
        <App />
      </PricingProvider>
    </QueryClientProvider>
  </StrictMode>,
)
