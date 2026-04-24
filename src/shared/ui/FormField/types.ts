import React from 'react';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date';

export interface FormOption {
  label?: string | React.ReactNode;
  value?: string | number | boolean | readonly string[];
  [key: string]: unknown;
}

export interface FormFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 'type' | 'size' | 'value'> {
  /** The type of form field to render */
  type: FormFieldType;
  /** Label for the field */
  label?: string | React.ReactNode;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the field */
  helperText?: React.ReactNode;
  /** Options array for select, radio, or checkbox groups */
  options?: FormOption[];
  /** Option key to use for the display label (default: 'label') */
  labelKey?: string;
  /** Option key to use for the value (default: 'value') */
  valueKey?: string;
  /** Whether the field should take up the full width (default: true) */
  fullWidth?: boolean;
  /** For textarea */
  rows?: number;
  /** For customizable UI sizes (optional) */
  size?: 'sm' | 'md' | 'lg';
  /** External wrapper class */
  wrapperClassName?: string;

  // Custom Value
  value?: unknown;

  // React Select like props
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;

  // Async select props
  /** Async function that returns options based on the search input.
   *  For infinite scroll, accept an optional `page` arg and return
   *  `{ options: FormOption[], hasMore: boolean }` instead of a plain array. */
  loadOptions?: (inputValue: string, page?: number) => Promise<LoadOptionsResult>;
  /** Whether to load options on mount / when dropdown first opens (default: false) */
  defaultOptions?: boolean;
  /** Cache previously loaded options per input string (default: true) */
  cacheOptions?: boolean;
  /** Message shown while options are loading */
  loadingMessage?: string;
  /** Message shown when no options match */
  noOptionsMessage?: string;

  // Date Picker props (type='date')
  /** Minimum selectable date – YYYY-MM-DD string or Date object */
  minDate?: string | Date;
  /** Maximum selectable date – YYYY-MM-DD string or Date object */
  maxDate?: string | Date;
  /** Show the "Today" shortcut button in the date picker footer */
  showTodayButton?: boolean;
  /** Whether the field contains PII (Personally Identifiable Information) and should be maskable */
  isPII?: boolean;
  /** Browser autocomplete behavior */
  autoComplete?: string;
  /** Whether to enable browser spell checking */
  spellCheck?: boolean | 'true' | 'false';
  /** Date format for display and parsing (e.g. 'dd-mm-yyyy', 'mm-dd-yyyy') */
  dateFormat?: 'dd-mm-yyyy' | 'mm-dd-yyyy' | 'yyyy-mm-dd' | 'yyyy-dd-mm' | 'dd-MMM-yyyy';
  /** Whether to show time picker */
  showTime?: boolean;
}

/** View modes for the advanced date picker */
export type DatePickerView = 'day' | 'month' | 'year';

/** Return type of a paginated loadOptions call */
export interface LoadOptionsPage {
  options: FormOption[];
  hasMore: boolean;
}

/** Either a plain array (non-paginated) or a paginated result */
export type LoadOptionsResult = FormOption[] | LoadOptionsPage;

export type CustomSelectProps = Omit<FormFieldProps, 'type'>;

export interface CustomDatePickerProps
  extends Omit<FormFieldProps, 'type' | 'options' | 'labelKey' | 'valueKey' | 'isMulti' | 'isSearchable'> {
  /** Minimum selectable date (YYYY-MM-DD string or Date) */
  minDate?: string | Date;
  /** Maximum selectable date (YYYY-MM-DD string or Date) */
  maxDate?: string | Date;
  /** Show a "Today" shortcut button */
  showTodayButton?: boolean;
}
