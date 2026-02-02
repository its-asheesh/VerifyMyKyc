"use client"

import type React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"

interface ButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode
    variant?: "default" | "contained" | "outlined" | "ghost" | "gradient"
    size?: "default" | "sm" | "lg"
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = "",
    variant = "default",
    size = "default",
    onClick,
    ...props
}) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variantClasses = {
        default: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
        contained: "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl",
        outlined: "border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50",
        ghost: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
        gradient:
            "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    }

    const sizeClasses = {
        default: "px-4 py-2.5 text-sm",
        sm: "px-3 py-2 text-xs",
        lg: "px-8 py-4 text-base",
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    )
}
