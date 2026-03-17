'use client';

interface FormSelectProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormSelect({
  label,
  name,
  options,
  value = '',
  onChange,
  error,
  required,
  disabled,
}: FormSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-critical ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-md border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          error
            ? 'border-red-critical focus:ring-red-critical'
            : 'border-border focus:ring-primary'
        } focus:outline-none focus:ring-2`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-critical">{error}</span>}
    </div>
  );
}
