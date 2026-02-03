import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'solid-error' | 'solid-warning' | 'solid-success' | 'solid-info';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    className,
    variant = 'default',
    size = 'md',
    ...props
}) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800",
        info: "bg-blue-100 text-blue-800",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm",
        "solid-error": "bg-red-500 text-white shadow-sm",
        "solid-warning": "bg-amber-500 text-white shadow-sm",
        "solid-success": "bg-green-500 text-white shadow-sm",
        "solid-info": "bg-blue-500 text-white shadow-sm"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm"
    };

    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
