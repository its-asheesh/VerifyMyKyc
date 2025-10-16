// src/components/buttons/BackButton.tsx
import React from "react";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string; // default "Back"
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className, label = "Back" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center text-gray-600 hover:text-gray-900 ${className || ""}`}
      aria-label={label}
    >
      <span className="mr-2">←</span> {label}
    </button>
  );
};

export default BackButton;


