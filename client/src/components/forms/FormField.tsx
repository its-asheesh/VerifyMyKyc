import { useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";
import { AlertCircle } from "lucide-react";
import TextField from "./TextField";

import type { LucideIcon } from "lucide-react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    icon?: LucideIcon;
}

export const FormField: React.FC<FormFieldProps> = ({ name, label, icon, className, ...props }) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
        <div className={cn("space-y-1.5", className)}>
            <TextField
                id={name}
                label={label}
                icon={icon}
                error={error}
                {...register(name)}
                {...props}
            />
            {error && !props.type?.includes('text') && (
                <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
};
