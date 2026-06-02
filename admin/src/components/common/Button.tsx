import React, { type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent shadow-sm',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500 border border-transparent',
        outline: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-indigo-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent shadow-sm',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500'
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
        md: 'px-4 py-2 text-sm rounded-lg gap-2',
        lg: 'px-6 py-3 text-base rounded-xl gap-2.5'
    }

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    )
}

export default Button
