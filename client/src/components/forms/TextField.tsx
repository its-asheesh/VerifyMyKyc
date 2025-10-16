// src/components/forms/TextField.tsx
import React, { useState } from 'react';
import { type LucideIcon, Eye, EyeOff } from 'lucide-react';

interface TextFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  showVisibilityToggle?: boolean; // if undefined, auto-enables for password
  maxLength?: number;
  pattern?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  error,
  icon: Icon,
  disabled = false,
  inputMode,
  autoComplete,
  value,
  onChange,
  showVisibilityToggle,
  maxLength,
  pattern,
}) => {
  const isPassword = type === 'password';
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? 'text' : 'password') : type;
  const shouldShowToggle = typeof showVisibilityToggle === 'boolean' ? showVisibilityToggle : isPassword;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          type={inputType}
          inputMode={inputMode}
          autoComplete={autoComplete}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          pattern={pattern}
          className={`appearance-none relative block w-full ${
            Icon ? 'pl-10' : 'pl-3'
          } ${isPassword ? 'pr-10' : 'pr-3'} py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
        {shouldShowToggle && (
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
          >
            {show ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextField;