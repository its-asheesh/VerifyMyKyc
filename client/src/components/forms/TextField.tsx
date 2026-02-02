// src/components/forms/TextField.tsx
import React, { useState, forwardRef } from 'react';
import { type LucideIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  id: string;
  error?: string;
  icon?: LucideIcon;
  showVisibilityToggle?: boolean; // if undefined, auto-enables for password
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: string) => void;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  error,
  icon: Icon,
  disabled = false,
  className,
  value,
  onChange,
  onValueChange,
  showVisibilityToggle,
  ...props
}, ref) => {
  const isPassword = type === 'password';
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? 'text' : 'password') : type;
  const shouldShowToggle = typeof showVisibilityToggle === 'boolean' ? showVisibilityToggle : isPassword;

  // Handle both controlled (onChange prop) and uncontrolled (ref) modes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2 transition-colors">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          className={cn(
            "block w-full rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm py-3 px-4 transition-all hover:border-gray-400 font-medium placeholder:font-normal placeholder-gray-400 focus:outline-none",
            Icon ? 'pl-10' : 'pl-4',
            shouldShowToggle ? 'pr-10' : 'pr-4',
            error && "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/30",
            disabled && "opacity-60 cursor-not-allowed bg-gray-50"
          )}
          placeholder={placeholder}
          {...props}
        />
        {shouldShowToggle && (
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center outline-none"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
          >
            {show ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5 animate-in slide-in-from-left-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
});

TextField.displayName = "TextField";

export default TextField;