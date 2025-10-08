// src/components/forms/PasswordStrengthMeter.tsx
import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const getStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length > 0) strength += 1;
    if (pwd.length >= 6) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getText = () => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded ${i < strength ? getColor() : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-xs mt-1 text-gray-600">{getText()} password</p>
    </div>
  );
};

export default PasswordStrengthMeter;