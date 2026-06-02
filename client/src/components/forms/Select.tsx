import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    name?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    error,
    placeholder = "Select an option",
    className,
    disabled = false,
    required = false,
    id,
}) => {
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={cn("w-full", className)}>
            <Listbox value={value} onChange={onChange} disabled={disabled}>
                {({ open }) => (
                    <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                            <Listbox.Label
                                htmlFor={id}
                                className="block text-sm font-semibold text-gray-700 transition-colors"
                            >
                                {label} {required && <span className="text-red-500">*</span>}
                            </Listbox.Label>
                        </div>

                        <ListboxButton
                            id={id}
                            className={cn(
                                "relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-4 transition-all duration-200",
                                "hover:border-blue-400 hover:bg-gray-50/50",
                                open ? "border-blue-500 ring-blue-500/10" : "",
                                error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10 bg-red-50/10" : "focus:border-blue-500 focus:ring-blue-500/10",
                                disabled ? "cursor-not-allowed opacity-60 bg-gray-100" : ""
                            )}
                        >
                            <span className={cn("block truncate font-medium", !selectedOption && "text-gray-400")}>
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 text-gray-400 transition-transform duration-200",
                                        open ? "rotate-180 text-blue-500" : ""
                                    )}
                                    aria-hidden="true"
                                />
                            </span>
                        </ListboxButton>

                        <AnimatePresence>
                            {open && (
                                <ListboxOptions
                                    as={motion.ul}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } }}
                                    exit={{ opacity: 0, y: -10, transition: { duration: 0.1, ease: "easeIn" } }}
                                    anchor="bottom start"
                                    className="absolute z-50 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                                >
                                    {options.map((option) => (
                                        <ListboxOption
                                            key={option.value}
                                            value={option.value}
                                            className={({ focus, selected }) =>
                                                cn(
                                                    "relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors",
                                                    focus ? "bg-blue-50 text-blue-900" : "text-gray-900",
                                                    selected ? "font-semibold bg-blue-50/50" : "font-medium"
                                                )
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={cn("block truncate", selected ? "font-semibold text-blue-600" : "")}>
                                                        {option.label}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                            <Check className="h-4 w-4" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </Listbox>
            {error && (
                <p className="mt-1.5 text-sm text-red-600 animate-in slide-in-from-left-1 flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
};
