import React from 'react';
import { cn } from '../../lib/utils';
import { Container } from './Container';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'gradient' | 'white' | 'gray';
    containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
    withContainer?: boolean;
}

export const Section: React.FC<SectionProps> = ({
    children,
    className,
    variant = 'default',
    containerSize = '7xl',
    withContainer = true,
    ...props
}) => {
    const variants = {
        default: "bg-transparent",
        white: "bg-white",
        gray: "bg-gray-50",
        gradient: "bg-gradient-to-br from-blue-50 to-purple-50",
    };

    const content = withContainer ? (
        <Container size={containerSize}>
            {children}
        </Container>
    ) : children;

    return (
        <section
            className={cn(
                "py-8 md:py-12",
                variants[variant],
                className
            )}
            {...props}
        >
            {content}
        </section>
    );
};
