import React from 'react';
import { cn } from '../../lib/utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading: React.FC<HeadingProps> = ({
    children,
    className,
    level = 2,
    variant,
    ...props
}) => {
    const Tag = `h${level}` as React.ElementType;

    // If variant is not provided, map from level
    const styleVariant = variant || `h${level}`;

    const styles = {
        h1: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight",
        h2: "text-2xl md:text-3xl font-bold text-gray-900 tracking-tight",
        h3: "text-xl md:text-2xl font-bold text-gray-900",
        h4: "text-lg md:text-xl font-semibold text-gray-900",
        h5: "text-base font-semibold text-gray-900",
        h6: "text-sm font-semibold text-gray-900 uppercase tracking-wide",
    };

    return (
        <Tag
            className={cn(
                styles[styleVariant as keyof typeof styles],
                className
            )}
            {...props}
        >
            {children}
        </Tag>
    );
};
