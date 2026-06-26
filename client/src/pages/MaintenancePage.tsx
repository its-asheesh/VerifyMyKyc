import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Clock } from 'lucide-react';
import systemApi from '../services/api/systemApi';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const MaintenancePage: React.FC = () => {
  const [title, setTitle] = useState('Scheduled Maintenance');
  const [message, setMessage] = useState('We are currently upgrading our systems. Please check back shortly.');
  const [estimatedEndTime, setEstimatedEndTime] = useState<string | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const fetchStatus = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const settings = await systemApi.getSystemSettings();
      setTitle(settings.maintenanceTitle);
      setMessage(settings.maintenanceMessage);
      setEstimatedEndTime(settings.estimatedEndTime);
      setShowCountdown(settings.showCountdown);

      // If maintenance mode was disabled, redirect to home page
      if (!settings.maintenanceMode) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
    } finally {
      if (showSpinner) {
        setTimeout(() => setIsRefreshing(false), 600);
      }
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll status every 30 seconds
    const interval = setInterval(() => fetchStatus(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!estimatedEndTime || !showCountdown) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = +new Date(estimatedEndTime) - +new Date();
      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      if (!left) {
        clearInterval(timer);
        // Refresh state once countdown hits zero
        fetchStatus();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [estimatedEndTime, showCountdown]);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f8fc] via-white to-[#f7f5ff] flex flex-col items-center justify-center p-4 relative overflow-hidden font-inter">
      {/* Background Soft Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-[130px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[130px] pointer-events-none select-none" />

      <div className="w-full max-w-xl text-center space-y-8 z-10">
        {/* Brand Logo Image */}
        <div className="flex justify-center select-none">
          <img
            src="/verifymykyclogo.svg"
            alt="VerifyMyKyc"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Clean Light Glassmorphic Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-blue-100/80 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(59,130,246,0.08)] text-center space-y-7 transition-all duration-500">
          {/* Status Indicator */}
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl border border-blue-100/80 shadow-sm">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="absolute top-[-3px] right-[-3px] flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-white"></span>
              </span>
            </div>
          </div>

          {/* Title and Message */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md mx-auto font-medium">
              {message}
            </p>
          </div>

          {/* Countdown Clock */}
          {showCountdown && timeLeft && (
            <div className="py-5 border-y border-slate-100 space-y-4">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Estimated Completion Time
              </div>
              
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center min-w-[50px]">
                  <span className="text-2xl md:text-3xl font-black text-slate-800 font-mono tracking-wider">
                    {formatNumber(timeLeft.days)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Days</span>
                </div>
                <span className="text-2xl md:text-3xl font-bold text-slate-300 leading-none">:</span>
                <div className="flex flex-col items-center min-w-[50px]">
                  <span className="text-2xl md:text-3xl font-black text-slate-800 font-mono tracking-wider">
                    {formatNumber(timeLeft.hours)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Hours</span>
                </div>
                <span className="text-2xl md:text-3xl font-bold text-slate-300 leading-none">:</span>
                <div className="flex flex-col items-center min-w-[50px]">
                  <span className="text-2xl md:text-3xl font-black text-slate-800 font-mono tracking-wider">
                    {formatNumber(timeLeft.minutes)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Mins</span>
                </div>
                <span className="text-2xl md:text-3xl font-bold text-slate-300 leading-none">:</span>
                <div className="flex flex-col items-center min-w-[50px]">
                  <span className="text-2xl md:text-3xl font-black text-slate-800 font-mono tracking-wider">
                    {formatNumber(timeLeft.seconds)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Secs</span>
                </div>
              </div>
            </div>
          )}

          {/* Expected Date Display (If countdown is disabled but time exists) */}
          {!showCountdown && estimatedEndTime && (
            <div className="text-xs font-bold text-slate-500 bg-slate-50 py-2.5 px-4 rounded-xl border border-blue-50/50 inline-block shadow-sm">
              Expected Restoration: <span className="text-blue-600 ml-1">{new Date(estimatedEndTime).toLocaleString()}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => fetchStatus(true)}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-600/50 disabled:to-indigo-600/50 text-white font-bold text-sm rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-[0_10px_25px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.3)] cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400 font-semibold tracking-wide">
          Thank you for your patience. We are improving performance, security, and reliability.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
