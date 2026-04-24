import React from 'react';
import type { ModalBodyProps } from '../types';
import { cn } from '../../../utils/cn';
import { modalBodyStyles } from '../style/style';

/* ── Component ─────────────────────────────────────────────── */

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
  scrollable = true,
}) => {
  const s = modalBodyStyles;

  return (
    <div
      className={cn(
        s.root,
        scrollable && s.scrollable,
        className,
      )}
    >
      {children}
    </div>
  );
};
