// src/components/forms/OtpInput.tsx
import React from 'react';
import OTPInput from 'react-otp-input';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
  error?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  numInputs = 6,
  error,
}) => {
  return (
    <div>
      <OTPInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        inputType="tel"
        renderInput={(props) => <input {...props} />}
        inputStyle={{
          width: '44px',
          height: '48px',
          margin: '0 4px',
          fontSize: '16px',
          borderRadius: '8px',
          border: error ? '1px solid #f87171' : '1px solid #d1d5db',
          outline: 'none',
          textAlign: 'center',
        }}
        containerStyle={{ justifyContent: 'center' }}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default OtpInput;