import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  buttonBaseStyles,
  buttonSizeStyles,
  buttonSpinnerSizeStyles,
  buttonVariantStyles,
} from '../style/style';
import type { ButtonVariant, ButtonSize } from '../style/style';

/* ── Props ─────────────────────────────────────────────────── */

interface ButtonTheme {
  primary?:   string;
  secondary?: string;
  danger?:    string;
  outline?:   string;
  ghost?:     string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  theme?:     ButtonTheme;
}

/* ── Component ─────────────────────────────────────────────── */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant  = 'primary',
      size     = 'md',
      loading  = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      theme,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // Merge custom theme with defaults
    const activeTheme = { ...buttonVariantStyles, ...theme };
    const variantClass = activeTheme[variant];
    const base = buttonBaseStyles;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          base.root,
          buttonSizeStyles[size],
          variantClass,
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && (
          <svg
            className={cn('animate-spin text-current', buttonSpinnerSizeStyles[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && leftIcon && (
          <span className={base.iconWrapper}>{leftIcon}</span>
        )}

        {children}

        {!loading && rightIcon && (
          <span className={base.iconWrapper}>{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
