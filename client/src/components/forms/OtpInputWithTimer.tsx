// src/components/forms/OtpInputWithTimer.tsx
import React, { useState, useEffect } from 'react';
import OtpInput from './OtpInput';

interface OtpInputWithTimerProps {
  value: string;
  onChange: (value: string) => void;
  onResend: () => void;
  error?: string | null; // ← Allow null
  numInputs?: number;
}

const OtpInputWithTimer: React.FC<OtpInputWithTimerProps> = ({
  value,
  onChange,
  onResend,
  error,
  numInputs = 6,
}) => {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleResend = () => {
    if (timer === 0) {
      onResend();
      setTimer(60);
    }
  };

  return (
    <div>
      <OtpInput value={value} onChange={onChange} numInputs={numInputs} error={error || undefined} />
      <div className="mt-2 text-center text-sm">
        {timer > 0 ? (
          <span className="text-gray-500">Resend OTP in {timer}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpInputWithTimer;