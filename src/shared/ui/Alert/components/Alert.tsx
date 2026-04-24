import React, { useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { alertBaseStyles, alertVariantStyles } from '../style/style';
import type { AlertType } from '../style/style';

/* ── Icon map (kept in component — view concern) ──────────── */

const alertIcons: Record<AlertType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/* ── Props ─────────────────────────────────────────────────── */

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

/* ── Component ─────────────────────────────────────────────── */

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      closable = false,
      onClose,
      icon,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleClose = () => setIsLeaving(true);

    const handleAnimationEnd = () => {
      if (isLeaving) {
        setIsVisible(false);
        onClose?.();
      }
    };

    if (!isVisible) return null;

    const variant = alertVariantStyles[type];
    const base = alertBaseStyles;

    const DefaultIcon = alertIcons[type];
    const Icon = icon ? () => <>{icon}</> : DefaultIcon;

    return (
      <div
        ref={ref}
        role="alert"
        onAnimationEnd={handleAnimationEnd}
        className={cn(
          base.container,
          variant.container,
          isLeaving ? base.leave : base.enter,
          className,
        )}
        {...props}
      >
        {/* Icon */}
        <div className={base.iconWrapper}>
          <Icon className={cn(base.icon, variant.icon)} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className={base.content}>
          {title && (
            <h3 className={cn(base.title, variant.title)}>{title}</h3>
          )}
          <div className={cn(base.body, variant.body)}>{children}</div>
        </div>

        {/* Close button */}
        {closable && (
          <div className={base.closeWrapper}>
            <button
              onClick={handleClose}
              type="button"
              className={cn(base.closeButton, variant.closeButton)}
            >
              <span className="sr-only">Dismiss</span>
              <X className={base.closeIcon} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
