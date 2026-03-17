'use client';

interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export function FormTextarea({
  label,
  name,
  placeholder,
  value = '',
  onChange,
  error,
  required,
  disabled,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-critical ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 rounded-md border bg-card text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none ${
          error
            ? 'border-red-critical focus:ring-red-critical'
            : 'border-border focus:ring-primary'
        } focus:outline-none focus:ring-2`}
      />
      {error && <span className="text-sm text-red-critical">{error}</span>}
    </div>
  );
}
