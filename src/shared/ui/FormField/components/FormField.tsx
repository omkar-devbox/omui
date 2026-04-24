import React, { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../utils';
import { CustomSelect } from './Select';
import { CustomDatePicker } from './DatePicker';
import type { FormFieldProps } from '../types';
import { formFieldBaseStyles } from '../style/style';

/* ── Component ─────────────────────────────────────────────── */

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement, FormFieldProps>(
  (
    {
      type,
      label,
      error,
      helperText,
      options       = [],
      labelKey      = 'label',
      valueKey      = 'value',
      fullWidth     = true,
      className,
      wrapperClassName,
      id: externalId,
      required,
      disabled,
      rows          = 3,
      minDate,
      maxDate,
      showTodayButton,
      dateFormat,
      showTime,
      isPII         = false,
      autoComplete,
      spellCheck,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      size: _size,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const id          = externalId || `${type}-${generatedId}`;
    const [isMasked, setIsMasked] = useState(true);
    const s           = formFieldBaseStyles;

    const toggleMask = () => setIsMasked((prev) => !prev);

    const baseInputStyles = cn(
      s.input,
      disabled && s.inputDisabled,
      error    && s.inputError,
      isPII    && s.inputPII,
      className,
    );

    const renderInput = () => {
      switch (type) {
        case 'textarea':
          return (
            <textarea
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              id={id}
              disabled={disabled}
              required={required}
              className={baseInputStyles}
              rows={rows}
              autoComplete={autoComplete}
              spellCheck={spellCheck ?? (isPII ? false : undefined)}
              aria-invalid={!!error}
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          );

        case 'select':
          return (
            <CustomSelect
              ref={ref as React.ForwardedRef<HTMLDivElement>}
              id={id}
              disabled={disabled}
              options={options}
              labelKey={labelKey}
              valueKey={valueKey}
              className={className}
              aria-invalid={!!error}
              {...rest}
            />
          );

        case 'date':
          return (
            <CustomDatePicker
              ref={ref as React.ForwardedRef<HTMLDivElement>}
              id={id}
              disabled={disabled}
              className={className}
              aria-invalid={!!error}
              minDate={minDate}
              maxDate={maxDate}
              showTodayButton={showTodayButton}
              dateFormat={dateFormat}
              showTime={showTime}
              {...rest}
            />
          );

        case 'checkbox':
          return (
            <div ref={ref as React.ForwardedRef<HTMLInputElement>} className={s.toggleRow}>
              <input
                id={id}
                type="checkbox"
                disabled={disabled}
                required={required}
                className={cn(
                  s.checkboxInput,
                  error && s.checkboxInputError,
                  className,
                )}
                aria-invalid={!!error}
                checked={rest.value as boolean}
                {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
              />
              {label && (
                <label
                  htmlFor={id}
                  className={cn(
                    s.inlineLabel,
                    disabled && s.inlineLabelDisabled,
                  )}
                >
                  {label}
                  {required && <span className={s.requiredMark}>*</span>}
                </label>
              )}
            </div>
          );

        case 'radio':
          return (
            <div className={cn(s.radioGroup, className)}>
              {options.map((opt, idx) => {
                const optLabel = typeof opt === 'object' && opt !== null ? opt[labelKey] : String(opt);
                const optValue = typeof opt === 'object' && opt !== null ? opt[valueKey] : opt;
                const valStr   = String(optValue != null ? optValue : idx);
                const optId    = `${id}-${idx}`;
                const isChecked = rest.value !== undefined ? rest.value === optValue : rest.defaultChecked;

                return (
                  <div key={`${valStr}-${idx}`} className={s.toggleRow}>
                    <input
                      id={optId}
                      type="radio"
                      name={rest.name || id}
                      value={optValue as string | number}
                      disabled={disabled}
                      required={required && idx === 0}
                      className={cn(
                        s.radioInput,
                        error && s.radioInputError,
                      )}
                      aria-invalid={!!error}
                      onChange={rest.onChange as React.ChangeEventHandler<HTMLInputElement>}
                      checked={isChecked}
                    />
                    <label
                      htmlFor={optId}
                      className={cn(
                        s.inlineLabel,
                        disabled && s.inlineLabelDisabled,
                      )}
                    >
                      {optLabel as React.ReactNode}
                    </label>
                  </div>
                );
              })}
            </div>
          );

        case 'text':
        case 'email':
        case 'password':
        case 'number':
        default: {
          const inputType = isPII
            ? isMasked
              ? 'password'
              : type === 'password'
                ? 'text'
                : type
            : type;

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (type === 'number') {
              const allowedKeys = [
                'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
              ];
              if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
              if (!/^\d$/.test(e.key)) e.preventDefault();
            }
          };

          const inputElement = (
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              id={id}
              type={inputType}
              disabled={disabled}
              required={required}
              className={baseInputStyles}
              autoComplete={autoComplete}
              spellCheck={spellCheck ?? (isPII ? false : undefined)}
              aria-invalid={!!error}
              onKeyDown={(e) => {
                handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>);
                if (rest.onKeyDown) rest.onKeyDown(e as React.KeyboardEvent<HTMLInputElement>);
              }}
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          );

          if (isPII) {
            return (
              <div className={s.piiWrapper}>
                {inputElement}
                <button
                  type="button"
                  onClick={toggleMask}
                  disabled={disabled}
                  className={cn(
                    s.piiToggleButton,
                    disabled && s.piiToggleButtonDisabled,
                  )}
                  aria-label={isMasked ? 'Show sensitive information' : 'Hide sensitive information'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleMask();
                    }
                  }}
                >
                  {isMasked ? <Eye className={s.piiIcon} /> : <EyeOff className={s.piiIcon} />}
                </button>
              </div>
            );
          }

          return inputElement;
        }
      }
    };

    const hideTopLabel = type === 'checkbox';

    return (
      <div
        className={cn(
          s.wrapper,
          fullWidth ? s.wrapperFull : s.wrapperAuto,
          wrapperClassName,
        )}
      >
        {label && !hideTopLabel && (
          <label
            htmlFor={id}
            className={cn(s.label, disabled && s.labelDisabled)}
          >
            {label}
            {required && <span className={s.requiredMark}>*</span>}
          </label>
        )}

        {renderInput()}

        {(helperText || error) && (
          <p
            className={error ? s.errorText : s.helperText}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
