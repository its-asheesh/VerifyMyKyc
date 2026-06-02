import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    noPadding = false,
    ...props
}) => {
    return (
        <div
            className={cn(
                "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",
                !noPadding && "p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
