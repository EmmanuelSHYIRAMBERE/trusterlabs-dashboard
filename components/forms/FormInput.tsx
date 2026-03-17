'use client';

import { useState } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  step?: string;
}

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value = '',
  onChange,
  error,
  required,
  disabled,
  min,
  max,
  step,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-critical ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 rounded-md border bg-card text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          error
            ? 'border-red-critical focus:ring-red-critical'
            : 'border-border focus:ring-primary'
        } focus:outline-none focus:ring-2`}
      />
      {error && <span className="text-sm text-red-critical">{error}</span>}
    </div>
  );
}
