import React, { useCallback } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { ImageUpload } from './ImageUpload';

// Supported field types for the dynamic form
export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'image';

export interface FormOption {
  value: string | number;
  label: string;
}

export interface FormField {
  name: string;
  label?: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormOption[]; // for select
  rows?: number; // for textarea
  min?: number | string; // for number/date inputs
  max?: number | string;
  step?: number | string;
  disabled?: boolean;
  helperText?: string;
  uploadProvider?: 'server' | 'aws' | 'cloudinary'; // align to ImageUpload
  maxSize?: number; // for image
  allowResize?: boolean; // for image
  componentProps?: Record<string, unknown>; // spread onto underlying component
}

export interface FormProps<T extends object> {
  fields: FormField[];
  value: T;
  onChange: (next: T) => void;
  onSubmit: (value: T) => void | Promise<void>;
  submitting?: boolean;
  className?: string;
  actionsClassName?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  layout?: 'vertical' | 'inline';
  renderActions?: (ctx: { value: T; submitting: boolean }) => React.ReactNode; // custom action section override
}

// Utility to update field value safely
function setField<T extends object>(value: T, name: string, fieldValue: unknown): T {
  return { ...value, [name]: fieldValue } as T;
}

export function Form<T extends object>(props: FormProps<T>) {
  const {
    fields,
    value,
    onChange,
    onSubmit,
    submitting = false,
    className = '',
    actionsClassName = 'flex justify-end space-x-2 pt-4',
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    onCancel,
    layout = 'vertical',
    renderActions,
  } = props;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  }, [onSubmit, value]);

  const baseFieldWrapper = layout === 'inline' ? 'flex items-center space-x-3' : 'space-y-1';

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {fields.map((field) => {
        const {
          name,
          label,
          type,
          required,
          placeholder,
          options,
          rows = 3,
          min,
          max,
          step,
          disabled,
          helperText,
          uploadProvider = 'server',
          maxSize = 5 * 1024 * 1024,
          allowResize = true,
          componentProps = {},
        } = field;
        const fieldValue = (value as unknown as Record<string, unknown>)?.[name];

        const commonLabel = label ? (
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
            {label}{required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        ) : null;

        let content: React.ReactNode;

        switch (type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
          case 'date':
            content = (
              <Input
                label={label}
                type={type}
                value={(fieldValue as string | number | undefined) ?? ''}
                onChange={(e) => onChange(setField(value, name, e.target.value))}
                required={required}
                placeholder={placeholder}
                min={min as number | string | undefined}
                max={max as number | string | undefined}
                step={step as number | string | undefined}
                disabled={disabled}
                helperText={helperText}
                {...componentProps}
              />
            );
            break;
          case 'textarea':
            content = (
              <div>
                {commonLabel}
                <textarea
                  value={(fieldValue as string | undefined) ?? ''}
                  onChange={(e) => onChange(setField(value, name, e.target.value))}
                  rows={rows}
                  required={required}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-background)]"
                  {...componentProps}
                />
                {helperText && (
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{helperText}</p>
                )}
              </div>
            );
            break;
          case 'select':
            content = (
              <div>
                {commonLabel}
                <select
                  value={(fieldValue as string | number | undefined) ?? ''}
                  onChange={(e) => onChange(setField(value, name, e.target.value))}
                  required={required}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-background)]"
                  {...componentProps}
                >
                  <option value="">Select...</option>
                  {Array.isArray(options) && options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {helperText && (
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{helperText}</p>
                )}
              </div>
            );
            break;
          case 'checkbox':
            content = (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!!fieldValue}
                  onChange={(e) => onChange(setField(value, name, e.target.checked))}
                  disabled={disabled}
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)] rounded"
                  {...componentProps}
                />
                {label && (
                  <label className="text-sm text-[var(--color-text-primary)]">{label}</label>
                )}
              </div>
            );
            break;
          case 'image':
            content = (
              <ImageUpload
                label={label || 'Image'}
                value={(fieldValue as string | undefined) ?? ''}
                onChange={(url: string) => onChange(setField(value, name, url))}
                uploadProvider={uploadProvider}
                maxSize={maxSize}
                allowResize={allowResize}
                required={required}
                {...componentProps}
              />
            );
            break;
          default:
            content = (
              <div className="text-[var(--color-error)] text-sm">Unsupported field type: {type}</div>
            );
        }

        return (
            <div key={name} className={baseFieldWrapper}>
              {content}
            </div>
        );
      })}

      {/* Actions */}
      {renderActions ? (
        renderActions({ value, submitting })
      ) : (
        <div className={actionsClassName}>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onCancel?.()}
              disabled={submitting}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={submitting}>
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}

export default Form;
