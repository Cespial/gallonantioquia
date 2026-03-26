"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const labelStyles = "font-ui text-sm font-semibold text-texto-principal mb-1.5 block";

const inputBase =
  "w-full bg-blanco-calido border border-borde rounded-lg px-4 py-3 font-body text-texto-principal focus:outline-none focus:ring-2 focus:ring-verde-antioquia/30 focus:border-verde-antioquia transition";

const errorInputStyles = "border-red-400 focus:ring-red-300";

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  options = [],
  value,
  onChange,
  error,
}: FormFieldProps) {
  const inputClasses = cn(inputBase, error && errorInputStyles);

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClasses, "min-h-[120px] resize-y")}
        />
      );
    }

    if (type === "select") {
      return (
        <div className="relative">
          <select
            id={name}
            name={name}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClasses, "appearance-none pr-10")}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-secundario pointer-events-none"
          />
        </div>
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClasses}
      />
    );
  };

  return (
    <div>
      <label htmlFor={name} className={labelStyles}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-red-500 text-xs mt-1 font-ui">{error}</p>
      )}
    </div>
  );
}
