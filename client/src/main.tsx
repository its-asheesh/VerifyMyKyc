// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PricingProvider } from './context/PricingContext';
import { AuthProvider } from './context/AuthContext'; // ✅ Import AuthProvider

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PricingProvider>
        <AuthProvider> {/* 👈 ADD THIS */}
          <App />
        </AuthProvider>
      </PricingProvider>
    </QueryClientProvider>
  </StrictMode>,
);