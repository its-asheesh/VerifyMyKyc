import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import systemApi from '../services/api/systemApi';
import type { SystemSettings } from '../services/api/systemApi';
import MaintenancePage from '../pages/MaintenancePage';

interface MaintenanceContextType {
  settings: SystemSettings | null;
  loading: boolean;
  checkStatus: () => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.auth);

  const checkStatus = async () => {
    try {
      const data = await systemApi.getSystemSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch system settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If maintenance is enabled and the user is NOT an admin, render the Maintenance Page globally
  if (settings?.maintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  return (
    <MaintenanceContext.Provider value={{ settings, loading, checkStatus }}>
      {children}
    </MaintenanceContext.Provider>
  );
};
