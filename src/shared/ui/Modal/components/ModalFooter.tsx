import React from 'react';
import type { ModalFooterProps } from '../types';
import { cn } from '../../../utils/cn';
import { modalFooterStyles, modalFooterAlignStyles } from '../style/style';

/* ── Component ─────────────────────────────────────────────── */

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
  align = 'right',
}) => {
  const s = modalFooterStyles;

  return (
    <div
      className={cn(
        s.root,
        modalFooterAlignStyles[align],
        className,
      )}
    >
      {children}
    </div>
  );
};
