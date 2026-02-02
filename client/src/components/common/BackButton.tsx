"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface BackButtonProps {
    label?: string
    className?: string
    onClick?: () => void
}

export const BackButton: React.FC<BackButtonProps> = ({
    label = "Back",
    className = "",
    onClick,
}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (onClick) {
            onClick()
        } else {
            navigate(-1)
        }
    }

    return (
        <motion.button
            onClick={handleClick}
            className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3 transition-colors ${className}`}
            whileHover={{ x: -4 }}
        >
            <ArrowLeft className="w-4 h-4" />
            {label && <span>{label}</span>}
        </motion.button>
    )
}
