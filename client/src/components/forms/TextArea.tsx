import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    id: string;
    error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    label,
    id,
    className,
    error,
    required,
    ...props
}, ref) => {
    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2 transition-colors">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                ref={ref}
                id={id}
                className={cn(
                    "block w-full rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm py-3 px-4 transition-all hover:border-gray-400 font-medium placeholder:font-normal placeholder-gray-400 focus:outline-none resize-none",
                    error && "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/30",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-600 animate-in slide-in-from-left-1">
                    {error}
                </p>
            )}
        </div>
    );
});

TextArea.displayName = "TextArea";
