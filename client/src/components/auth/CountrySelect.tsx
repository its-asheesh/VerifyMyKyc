import React from "react";
import { DIAL_CODES } from "../../utils/authUtils";

interface CountrySelectProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
    id = "dialCode",
    value,
    onChange,
    label = "Country",
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
            >
                {DIAL_CODES.map((o) => (
                    <option key={o.code} value={o.code}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
