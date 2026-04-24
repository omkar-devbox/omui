import { ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Controlled open state */
  open: boolean;
  /** Callback fired when the modal should close */
  onClose: () => void;
  /** Size variant */
  size?: ModalSize;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlay?: boolean;
  /** Whether the escape key closes the modal */
  closeOnEsc?: boolean;
  /** Show close (X) button */
  showCloseButton?: boolean;
  /** Content of the modal */
  children: ReactNode;
  /** Custom class for the modal container */
  className?: string;
  /** Custom class for the overlay */
  overlayClassName?: string;
}

export interface ModalHeaderProps {
  /** Title of the modal */
  title?: ReactNode;
  /** Description or subtitle */
  description?: ReactNode;
  /** Custom icon or element to display next to title */
  icon?: ReactNode;
  /** Whether to show the close button (inherited from Modal if possible) */
  onClose?: () => void;
  /** Custom classes */
  className?: string;
}

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
  /** Whether to enable inner scrolling (default: true) */
  scrollable?: boolean;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
  /** Alignment of footer actions */
  align?: 'left' | 'center' | 'right';
}
