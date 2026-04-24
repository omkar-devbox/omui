import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  type KeyboardEvent,
} from 'react';
import { cn } from '../../utils';
import { ChevronDownIcon, CheckIcon, XIcon } from '../../icons';
import type { CustomSelectProps, FormOption } from '../../types';

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ small = false }: { small?: boolean }) => (
  <svg
    className={cn('animate-spin text-primary', small ? 'h-3 w-3' : 'h-4 w-4')}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Cache key ─────────────────────────────────────────────────────────────────
const cacheKey = (input: string, page: number) => `${input}__page${page}`;

// ─── Component ────────────────────────────────────────────────────────────────
const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(
  (
    {
      options: staticOptions = [],
      value,
      onChange,
      disabled,
      placeholder = 'Select option...',
      labelKey = 'label',
      valueKey = 'value',
      name,
      className,
      id,
      isMulti = false,
      isSearchable = false,
      isClearable = false,
      // Async props
      loadOptions,
      defaultOptions = false,
      cacheOptions = true,
      loadingMessage = 'Loading…',
      noOptionsMessage = 'No options found',
      ...rest
    },
    ref
  ) => {
    const isAsync = typeof loadOptions === 'function';

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    // Async / pagination state
    const [asyncOptions, setAsyncOptions] = useState<FormOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const optionCache = useRef<Record<string, FormOption[]>>({});
    const hasMoreCache = useRef<Record<string, boolean>>({});
    // Persistent map of value→option for every option ever seen —
    // used to keep the selected label visible even after asyncOptions resets.
    const [knownOptions, setKnownOptions] = useState<Map<unknown, FormOption>>(new Map());

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const getOptionLabel = useCallback((opt: FormOption) =>
      typeof opt === 'object' && opt !== null
        ? (opt[labelKey] as React.ReactNode)
        : String(opt), [labelKey]);
  
    const getOptionValue = useCallback((opt: FormOption) =>
      typeof opt === 'object' && opt !== null ? opt[valueKey] : opt, [valueKey]);

    // ── Options to show ──────────────────────────────────────────────────────
    const baseOptions = isAsync ? asyncOptions : staticOptions;
    const filteredOptions = isAsync
      ? baseOptions
      : baseOptions.filter((o) =>
          String(getOptionLabel(o)).toLowerCase().includes(searchTerm.toLowerCase())
        );

    // ── Core async loader ────────────────────────────────────────────────────
    const load = useCallback(
      async (input: string, pageNum: number, append = false) => {
        if (!loadOptions) return;

        const key = cacheKey(input, pageNum);

        if (cacheOptions && optionCache.current[key] !== undefined) {
          const cached = optionCache.current[key];
          const cachedHasMore = hasMoreCache.current[key] ?? false;
          setAsyncOptions((prev) => (append ? [...prev, ...cached] : cached));
          setHasMore(cachedHasMore);
          return;
        }

        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        if (!append) {
          setPage(1);
          setHasMore(false);
        }

        try {
          const result = await loadOptions(input, pageNum);

          let opts: FormOption[];
          let more = false;

          if (Array.isArray(result)) {
            opts = result;
            more = false;
          } else {
            opts = result.options;
            more = result.hasMore;
          }

          if (cacheOptions) {
            optionCache.current[key] = opts;
            hasMoreCache.current[key] = more;
          }

          // Accumulate into the known-options map so selected labels survive resets
          setKnownOptions(prev => {
            const next = new Map(prev);
            opts.forEach((o) => next.set(getOptionValue(o), o));
            return next;
          });

          setAsyncOptions((prev) => (append ? [...prev, ...opts] : opts));
          setHasMore(more);
        } catch {
          if (!append) setAsyncOptions([]);
        } finally {
        if (append) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
        }
      },
      [loadOptions, cacheOptions, getOptionValue]
    );

    useEffect(() => {
      if (!isAsync || !isOpen) return;
      load(debouncedSearch, 1, false);
    }, [debouncedSearch, isAsync, isOpen, load]);

    // ── Infinite scroll – IntersectionObserver on sentinel ───────────────────
    useEffect(() => {
      if (!isAsync || !isOpen || !hasMore || isLoadingMore) return;

      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const nextPage = page + 1;
            setPage(nextPage);
            load(debouncedSearch, nextPage, true);
          }
        },
        { root: listRef.current, threshold: 0.1 }
      );

      observer.observe(sentinel);
      return () => observer.disconnect();
    }, [isAsync, isOpen, hasMore, isLoadingMore, page, debouncedSearch, load]);

    // ── Close on outside click ───────────────────────────────────────────────
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };
      if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    // ── Change emitter ───────────────────────────────────────────────────────
    const triggerChange = (newVal: unknown) => {
      if (onChange) {
        const simulatedEvent = {
          target: { name, value: newVal, type: 'select-one' },
          currentTarget: { name, value: newVal, type: 'select-one' },
        } as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
        onChange(simulatedEvent);
      }
    };

    // ── Option selection ─────────────────────────────────────────────────────
    const handleSelectOption = (opt: FormOption) => {
      const optValue = getOptionValue(opt);

      // Persist so the label survives asyncOptions resets
      setKnownOptions(prev => {
        const next = new Map(prev);
        next.set(optValue, opt);
        return next;
      });

      if (isMulti) {
        const currentVals = Array.isArray(value) ? value : [];
        const isSelected = currentVals.includes(optValue);
        const nextVals = isSelected
          ? currentVals.filter((v) => v !== optValue)
          : [...currentVals, optValue];
        triggerChange(nextVals);
        setSearchTerm('');
        inputRef.current?.focus();
      } else {
        triggerChange(optValue);
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerChange(isMulti ? [] : '');
      setSearchTerm('');
      setHighlightedIndex(0);
      if (isAsync) {
        setAsyncOptions([]);
        setPage(1);
        setHasMore(false);
        if (defaultOptions) load('', 1, false);
      }
      // Keep focus on the input after clearing
      inputRef.current?.focus();
    };

    const handleRemoveMulti = (e: React.MouseEvent, optValue: unknown) => {
      e.stopPropagation();
      const currentVals = Array.isArray(value) ? value : [];
      triggerChange(currentVals.filter((v) => v !== optValue));
    };

    // ── Keyboard navigation ──────────────────────────────────────────────────
    useEffect(() => {
      if (isOpen && listRef.current && highlightedIndex >= 0) {
        const list = listRef.current;
        const highlighted = list.querySelector(`[data-index="${highlightedIndex}"]`) as HTMLElement;
        if (highlighted) {
          const listRect = list.getBoundingClientRect();
          const itemRect = highlighted.getBoundingClientRect();

          if (itemRect.top < listRect.top) {
            list.scrollTop -= listRect.top - itemRect.top;
          } else if (itemRect.bottom > listRect.bottom) {
            list.scrollTop += itemRect.bottom - listRect.bottom;
          }
        }
      }
    }, [highlightedIndex, isOpen]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (e.key === 'Backspace' && !searchTerm) {
        if (isMulti) {
          const currentVals = Array.isArray(value) ? value : [];
          if (currentVals.length > 0)
            triggerChange(currentVals.slice(0, currentVals.length - 1));
        } else if (isClearable && hasValue) {
          triggerChange('');
          setHighlightedIndex(0);
        }
        inputRef.current?.focus();
      }

      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % (filteredOptions.length || 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(
            (prev) =>
              (prev - 1 + filteredOptions.length) % (filteredOptions.length || 1)
          );
          break;
        case 'Home':
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setHighlightedIndex(Math.max(0, filteredOptions.length - 1));
          break;
        case 'PageUp':
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(0, prev - 5));
          break;
        case 'PageDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            Math.min(filteredOptions.length - 1, prev + 5)
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[highlightedIndex])
            handleSelectOption(filteredOptions[highlightedIndex]);
          break;
        case 'Escape':
        case 'Tab':
          if (e.key === 'Escape') e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    const selectedValues = isMulti
      ? Array.isArray(value)
        ? value
        : []
      : [value];

    // For async mode: resolve selected labels from the persistent known-options
    // map so they survive asyncOptions being wiped on close/reopen/search.
    const selectedOptions = isAsync
      ? (selectedValues
          .map((v) =>
            knownOptions.get(v) ??
            asyncOptions.find((o) => getOptionValue(o) === v)
          )
          .filter(Boolean) as FormOption[])
      : baseOptions.filter((o) => selectedValues.includes(getOptionValue(o)));

    const showPlaceholder =
      isMulti
        ? selectedOptions.length === 0
        : selectedOptions.length === 0 && !searchTerm;

    const hasValue =
      isMulti
        ? (selectedValues as unknown[]).length > 0
        : selectedValues[0] !== undefined && selectedValues[0] !== '';

    // ── Render ───────────────────────────────────────────────────────────────
    return (
      <div
        ref={containerRef}
        className={cn('relative', className)}
        onKeyDown={handleKeyDown}
      >
        {/* Control */}
        <div
          ref={ref}
          id={id}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            'flex w-full items-center min-h-[42px] justify-between rounded-md border border-input-border-default bg-white px-3 py-1.5 text-sm transition-colors duration-200 cursor-text',
            'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none focus:outline-none',
            'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus-within:border-primary dark:focus-within:ring-primary/50',
            disabled && 'cursor-not-allowed opacity-50 bg-input-bg-disabled dark:bg-gray-800/50',
            rest['aria-invalid'] &&
              '!border-error focus-within:ring-error/50 dark:!border-error bg-error-bg dark:bg-error-bg/10'
          )}
          onFocus={() => {
            if (disabled) return;
            if (isSearchable || isAsync) {
              inputRef.current?.focus();
            }
          }}
          onClick={() => {
            if (disabled) return;
            setIsOpen(true);
            if (isSearchable || isAsync) inputRef.current?.focus();
          }}
        >
          {/* 
            Inner content area using in-flow elements for height management.
            This prevents container collapse when children (selected labels/placeholder) are present.
          */}
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 py-0.5 relative">
            {/* Multi-select badges */}
            {isMulti &&
              selectedOptions.map((opt, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 rounded tracking-wide bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary shrink-0"
                >
                  {getOptionLabel(opt)}
                  <XIcon
                    className="h-3 w-3 cursor-pointer hover:text-primary/70 dark:text-primary"
                    onClick={(e) => handleRemoveMulti(e, getOptionValue(opt))}
                  />
                </span>
              ))}

            {/* Single-select: selected label (in-flow) */}
            {!isMulti && !searchTerm && selectedOptions.length > 0 && (
              <span className="flex-1 truncate text-sm text-gray-900 dark:text-gray-50 leading-5">
                {getOptionLabel(selectedOptions[0])}
              </span>
            )}

            {/* Placeholder */}
            {showPlaceholder && !searchTerm && (
              <span className="absolute inset-y-0 left-0 flex items-center text-sm text-gray-400 dark:text-gray-500 leading-5 pointer-events-none truncate max-w-full">
                {placeholder}
              </span>
            )}

            {/* Search input */}
            <input
              ref={inputRef}
              disabled={disabled || (!isSearchable && !isAsync)}
              readOnly={!isSearchable && !isAsync}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(0);
                if (!isOpen) setIsOpen(true);
              }}
              className={cn(
                'bg-transparent outline-none p-0 text-sm leading-5 dark:text-gray-100 min-w-0',
                // Non-searchable non-async: fully hidden, no space
                !isSearchable && !isAsync && 'w-0 opacity-0 cursor-pointer',
                // Single-select: hide visually when a label is showing (not typing)
                !isMulti && !searchTerm && hasValue && 'w-0 opacity-0',
                (isMulti || searchTerm || !hasValue) && 'flex-1'
              )}
              size={1}
              aria-autocomplete={isAsync ? 'list' : undefined}
            />
          </div>

          {/* Right indicators */}
          <div className="flex items-center gap-1.5 ml-2 text-gray-400 shrink-0">
            {isLoading && <Spinner />}
            {isClearable && hasValue && !isLoading && (
              <XIcon
                className="h-4 w-4 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                onClick={handleClear}
              />
            )}
            {isClearable && !isLoading && (
              <span className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
            )}
            <ChevronDownIcon
              className={cn(
                'h-4 w-4 transition-transform duration-200 cursor-pointer',
                isOpen && 'rotate-180'
              )}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            ref={listRef}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg shadow-black/5 dark:border-gray-700 dark:bg-gray-800 focus:outline-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                <Spinner />
                {loadingMessage}
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {noOptionsMessage}
              </div>
            ) : (
              <>
                {filteredOptions.map((opt, idx) => {
                  const optValue = getOptionValue(opt);
                  const key = String(optValue != null ? optValue : idx);
                  const isSelected = selectedValues.includes(optValue);
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <div
                      key={`${key}-${idx}`}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      data-index={idx}
                      className={cn(
                        'flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors',
                        isSelected
                          ? 'bg-primary/10 text-primary dark:bg-primary/20'
                          : isHighlighted
                            ? 'bg-neutral-bg dark:bg-gray-700/50 text-gray-900 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-200'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOption(opt);
                      }}
                    >
                      <span>{getOptionLabel(opt)}</span>
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </div>
                  );
                })}

                {/* Infinite-scroll sentinel */}
                {hasMore && (
                  <div ref={sentinelRef} className="flex items-center justify-center gap-2 px-3 py-2">
                    {isLoadingMore ? (
                      <>
                        <Spinner small />
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Loading more…
                        </span>
                      </>
                    ) : (
                      /* invisible sentinel – observer triggers fetch */
                      <span className="h-1 w-full" />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = 'CustomSelect';

export { CustomSelect };
