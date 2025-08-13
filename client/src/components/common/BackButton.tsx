import React from "react"

interface BackButtonProps {
  onClick: () => void
  label: string
  className?: string
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  label, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center text-blue-600 hover:text-blue-800 transition-colors ${className}`}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </button>
  )
}

export default BackButton
