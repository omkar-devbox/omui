import React, { useState, useRef, useEffect, forwardRef } from "react";
import {
  cn,
  MONTH_NAMES_SHORT,
  MONTH_NAMES_LONG,
  DAY_NAMES,
  toMidnight,
} from "../../utils";
import {
  XIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../icons";
import type { CustomDatePickerProps, DatePickerView } from "../../types";

const CustomDatePicker = forwardRef<HTMLDivElement, CustomDatePickerProps>(
  (
    {
      value,
      onChange,
      disabled,
      placeholder = "Select date...",
      name,
      className,
      id,
      isClearable = false,
      minDate,
      maxDate,
      showTodayButton = true,
      dateFormat = "dd-mm-yyyy",
      showTime = false,
      ...rest
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<DatePickerView>("day");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [focusedDay, setFocusedDay] = useState<number | null>(null);
    const [focusedMonth, setFocusedMonth] = useState<number | null>(null);
    const [focusedYear, setFocusedYear] = useState<number | null>(null);

    // ── Parse helpers ────────────────────────────────────────────────────────
    const parseDate = (val: unknown): Date | null => {
      if (!val) return null;
      const d = new Date(val as string | number | Date);
      return isNaN(d.getTime()) ? null : showTime ? d : toMidnight(d);
    };

    const selectedDate = parseDate(value);
    const minD = parseDate(minDate);
    const maxD = parseDate(maxDate);

    // Display state for the input field
    const [inputValue, setInputValue] = useState("");

    const formatForDisplay = (date: Date | null) => {
      if (!date) return "";
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const MMM = MONTH_NAMES_SHORT[date.getMonth()];
      const y = String(date.getFullYear());
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");

      let res = dateFormat
        .replace("dd", d)
        .replace("mm", m)
        .replace("MMM", MMM)
        .replace("yyyy", y);

      if (showTime) res += ` ${hh}:${mm}`;
      return res;
    };

    useEffect(() => {
      setInputValue(formatForDisplay(selectedDate));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate?.getTime(), dateFormat, showTime]);

    const [viewDate, setViewDate] = useState<Date>(
      selectedDate || toMidnight(new Date()),
    );
    const [decadeStart, setDecadeStart] = useState<number>(
      () => Math.floor((selectedDate || new Date()).getFullYear() / 10) * 10,
    );

    useEffect(() => {
      if (selectedDate) {
        setViewDate(toMidnight(selectedDate));
        setDecadeStart(Math.floor(selectedDate.getFullYear() / 10) * 10);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate?.getTime()]);

    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          setView("day");
        }
      };
      if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    // ── Focus Management ──────────────────────────────────────────────────────
    useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          if (view === "day") {
            const current = focusedDay ?? selectedDate?.getDate() ?? today.getDate();
            const btn = containerRef.current?.querySelector<HTMLElement>(
              `[data-day="${current}"]`
            );
            btn?.focus();
          } else if (view === "month") {
            const current = focusedMonth ?? selectedDate?.getMonth() ?? today.getMonth();
            const btn = containerRef.current?.querySelector<HTMLElement>(
              `[data-month="${current}"]`
            );
            btn?.focus();
          } else if (view === "year") {
            const current = focusedYear ?? selectedDate?.getFullYear() ?? today.getFullYear();
            const btn = containerRef.current?.querySelector<HTMLElement>(
              `[data-year="${current}"]`
            );
            btn?.focus();
          }
        }, 50);
        return () => clearTimeout(timer);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, view]);

    // ── Change helpers ────────────────────────────────────────────────────────
    const triggerChange = (newDate: Date | null) => {
      if (!onChange) return;
      let dateStr = "";
      if (newDate) {
        if (showTime) {
          dateStr = newDate.toISOString();
        } else {
          const y = newDate.getFullYear();
          const m = String(newDate.getMonth() + 1).padStart(2, "0");
          const d = String(newDate.getDate()).padStart(2, "0");
          dateStr = `${y}-${m}-${d}`;
        }
      }
      const simulatedEvent = {
        target: { name, value: dateStr, type: "date" },
        currentTarget: { name, value: dateStr, type: "date" },
      } as unknown as React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >;
      onChange(simulatedEvent);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerChange(null);
      inputRef.current?.focus();
    };

    // ── Range helpers ─────────────────────────────────────────────────────────
    const isDateDisabled = (d: Date) => {
      const md = toMidnight(d);
      if (minD && md < minD) return true;
      if (maxD && md > maxD) return true;
      return false;
    };

    const isMonthDisabled = (year: number, month: number) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      if (maxD && firstDay > maxD) return true;
      if (minD && lastDay < minD) return true;
      return false;
    };

    const isYearDisabled = (year: number) => {
      if (maxD && year > maxD.getFullYear()) return true;
      if (minD && year < minD.getFullYear()) return true;
      return false;
    };

    // ── Day-view ──────────────────────────────────────────────────────────────
    const daysInMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0,
    ).getDate();
    const firstDayOfMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1,
    ).getDay();
    const today = toMidnight(new Date());

    const selectDay = (d: number, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      if (isDateDisabled(date)) return;
      triggerChange(date);
      setIsOpen(false);
      setView("day");
    };

    const renderDayGrid = () => {
      const cells: React.ReactNode[] = [];

      for (let i = 0; i < firstDayOfMonth; i++) {
        cells.push(<div key={`e-${i}`} />);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
        const isSelected =
          !!selectedDate && date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === today.toDateString();
        const isDisabled = isDateDisabled(date);
        const isFocused = focusedDay === d;

        cells.push(
          <div
            key={d}
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-pressed={isSelected}
            aria-disabled={isDisabled}
            data-day={d}
            onClick={(e) => selectDay(d, e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectDay(d);
              }
            }}
            onFocus={() => setFocusedDay(d)}
            onBlur={() => setFocusedDay(null)}
            className={cn(
              "flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-full text-sm font-medium transition-all duration-150 focus:outline-none",
              isDisabled
                ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                : isSelected
                  ? "bg-primary text-white shadow-sm hover:bg-primary-hover ring-2 ring-primary/30"
                  : isToday
                    ? "border border-primary text-primary dark:border-primary/80 dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/10"
                    : isFocused
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
            )}
          >
            {d}
          </div>,
        );
      }
      return cells;
    };

    const handleDayGridKeyDown = (e: React.KeyboardEvent) => {
      if (view !== "day") return;
      const current = focusedDay ?? selectedDate?.getDate() ?? today.getDate();
      let next = current;

      if (e.key === "ArrowRight") next = Math.min(current + 1, daysInMonth);
      else if (e.key === "ArrowLeft") next = Math.max(current - 1, 1);
      else if (e.key === "ArrowDown") next = Math.min(current + 7, daysInMonth);
      else if (e.key === "ArrowUp") next = Math.max(current - 7, 1);
      else if (e.key === "PageDown") {
        e.preventDefault();
        handleNext(e);
        return;
      } else if (e.key === "PageUp") {
        e.preventDefault();
        handlePrev(e);
        return;
      } else if (e.key === "Escape" || e.key === "Tab") {
        setIsOpen(false);
        setView("day");
        return;
      } else return;

      e.preventDefault();
      setFocusedDay(next);
      const btn = containerRef.current?.querySelector<HTMLElement>(
        `[data-day="${next}"]`,
      );
      btn?.focus();
    };

    // ── Month-picker view ─────────────────────────────────────────────────────
    const selectMonth = (month: number, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (isMonthDisabled(viewDate.getFullYear(), month)) return;
      setViewDate(new Date(viewDate.getFullYear(), month, 1));
      setView("day");
      setFocusedMonth(null);
    };

    const handleMonthGridKeyDown = (e: React.KeyboardEvent) => {
      if (view !== "month") return;
      const current = focusedMonth ?? viewDate.getMonth();
      let next = current;

      if (e.key === "ArrowRight") next = Math.min(current + 1, 11);
      else if (e.key === "ArrowLeft") next = Math.max(current - 1, 0);
      else if (e.key === "ArrowDown") next = Math.min(current + 3, 11);
      else if (e.key === "ArrowUp") next = Math.max(current - 3, 0);
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectMonth(current);
        return;
      } else if (e.key === "Escape" || e.key === "Tab") {
        setIsOpen(false);
        return;
      } else return;

      e.preventDefault();
      setFocusedMonth(next);
      const btn = containerRef.current?.querySelector<HTMLElement>(
        `[data-month="${next}"]`,
      );
      btn?.focus();
    };

    const renderMonthGrid = () =>
      MONTH_NAMES_SHORT.map((m, idx) => {
        const isCurrentMonth =
          viewDate.getMonth() === idx &&
          viewDate.getFullYear() === (selectedDate?.getFullYear() ?? -1);
        const isDisabled = isMonthDisabled(viewDate.getFullYear(), idx);
        return (
          <div
            key={m}
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            data-month={idx}
            onFocus={() => setFocusedMonth(idx)}
            onBlur={() => setFocusedMonth(null)}
            onClick={(e) => selectMonth(idx, e)}
            className={cn(
              "flex h-10 cursor-pointer select-none items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
              isDisabled
                ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                : isCurrentMonth
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : idx === today.getMonth() &&
                      viewDate.getFullYear() === today.getFullYear()
                    ? "border border-primary text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/10"
                    : focusedMonth === idx
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
            )}
          >
            {m}
          </div>
        );
      });

    // ── Year-picker view ──────────────────────────────────────────────────────
    const selectYear = (year: number, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (isYearDisabled(year)) return;
      setViewDate(new Date(year, viewDate.getMonth(), 1));
      setDecadeStart(Math.floor(year / 10) * 10);
      setView("month");
      setFocusedYear(null);
    };

    const handleYearGridKeyDown = (e: React.KeyboardEvent) => {
      if (view !== "year") return;
      const current = focusedYear ?? viewDate.getFullYear();
      let next = current;

      if (e.key === "ArrowRight") next = Math.min(current + 1, decadeStart + 11);
      else if (e.key === "ArrowLeft") next = Math.max(current - 1, decadeStart);
      else if (e.key === "ArrowDown") next = Math.min(current + 3, decadeStart + 11);
      else if (e.key === "ArrowUp") next = Math.max(current - 3, decadeStart);
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectYear(current);
        return;
      } else if (e.key === "Escape" || e.key === "Tab") {
        setIsOpen(false);
        return;
      } else return;

      e.preventDefault();
      setFocusedYear(next);
      const btn = containerRef.current?.querySelector<HTMLElement>(
        `[data-year="${next}"]`,
      );
      btn?.focus();
    };

    const renderYearGrid = () => {
      const years: React.ReactNode[] = [];
      for (let y = decadeStart; y < decadeStart + 12; y++) {
        const isCurrentYear = y === viewDate.getFullYear();
        const isDisabled = isYearDisabled(y);
        years.push(
          <div
            key={y}
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            data-year={y}
            onFocus={() => setFocusedYear(y)}
            onBlur={() => setFocusedYear(null)}
            onClick={(e) => selectYear(y, e)}
            className={cn(
              "flex h-10 cursor-pointer select-none items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
              isDisabled
                ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                : isCurrentYear
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : y === today.getFullYear()
                    ? "border border-primary text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/10"
                    : focusedYear === y
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
            )}
          >
            {y}
          </div>,
        );
      }
      return years;
    };

    // ── Header navigation ─────────────────────────────────────────────────────
    const handlePrev = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (view === "day")
        setViewDate(
          new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1),
        );
      if (view === "month")
        setViewDate(
          new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1),
        );
      if (view === "year") setDecadeStart((s) => s - 10);
    };

    const handleNext = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (view === "day")
        setViewDate(
          new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1),
        );
      if (view === "month")
        setViewDate(
          new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1),
        );
      if (view === "year") setDecadeStart((s) => s + 10);
    };

    const headerLabel = () => {
      if (view === "day")
        return (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setView("month");
              }}
              className="px-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              {MONTH_NAMES_LONG[viewDate.getMonth()]}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setView("year");
              }}
              className="px-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              {viewDate.getFullYear()}
            </button>
          </>
        );
      if (view === "month")
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setView("year");
            }}
            className="px-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
          >
            {viewDate.getFullYear()}
          </button>
        );
      return (
        <span className="font-semibold">
          {decadeStart} – {decadeStart + 11}
        </span>
      );
    };

    // ── Display formatting ────────────────────────────────────────────────────

    // ── Input Handling ────────────────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      if (val === "") {
        setInputValue("");
        triggerChange(null);
        return;
      }

      // Auto-pad single digits if a separator is typed
      const lastChar = val[val.length - 1];
      if (["-", "/", ".", " "].includes(lastChar)) {
        const parts = val.slice(0, -1).split(/[-/.\s:]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.length === 1 && /^\d$/.test(lastPart)) {
          val =
            val.slice(0, -(lastPart.length + 1)) + "0" + lastPart + lastChar;
        }
      }

      // Auto-pad if user types a digit that forces a new segment
      const partsArr = val.split(/[-/.\s:]/);
      const currentSegment = partsArr[partsArr.length - 1];
      const segmentIndex = partsArr.length - 1;

      if (
        currentSegment &&
        currentSegment.length === 1 &&
        /^\d$/.test(currentSegment)
      ) {
        const digit = parseInt(currentSegment);
        let shouldPad = false;

        if (dateFormat === "dd-mm-yyyy" || dateFormat === "dd-MMM-yyyy") {
          if (segmentIndex === 0 && digit > 3) shouldPad = true;
          if (segmentIndex === 1 && digit > 1 && !dateFormat.includes("MMM"))
            shouldPad = true;
        } else if (dateFormat === "mm-dd-yyyy") {
          if (segmentIndex === 0 && digit > 1) shouldPad = true;
          if (segmentIndex === 1 && digit > 3) shouldPad = true;
        }

        if (shouldPad) {
          partsArr[segmentIndex] = "0" + currentSegment;
          val = partsArr.join(lastChar || "-");
        }
      }

      setInputValue(val);

      // Try to parse if it looks like a complete date
      // yyyy-mm-dd or dd-mm-yyyy etc.
      // We'll normalize separators to - for parsing
      const cleanVal = val.replace(/[/.]/g, "-");
      const parts = cleanVal.split(/[- :]/); // split by - or space or :

      let d: number,
        m: number,
        y: number,
        hh = 0,
        mm = 0;

      if (dateFormat === "dd-mm-yyyy") {
        [d, m, y] = parts.map(Number);
      } else if (dateFormat === "mm-dd-yyyy") {
        [m, d, y] = parts.map(Number);
      } else if (dateFormat === "yyyy-mm-dd") {
        [y, m, d] = parts.map(Number);
      } else if (dateFormat === "yyyy-dd-mm") {
        [y, d, m] = parts.map(Number);
      } else if (dateFormat === "dd-MMM-yyyy") {
        d = Number(parts[0]);
        const monthStr = parts[1]?.toLowerCase();
        m =
          MONTH_NAMES_SHORT.findIndex(
            (name) => name.toLowerCase() === monthStr,
          ) + 1;
        if (m === 0) {
          m =
            MONTH_NAMES_LONG.findIndex(
              (name) => name.toLowerCase() === monthStr,
            ) + 1;
        }
        y = Number(parts[2]);
      }

      if (showTime && parts.length >= 5) {
        hh = Number(parts[parts.length - 2]);
        mm = Number(parts[parts.length - 1]);
      }

      if (y > 1000 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const date = new Date(y, m - 1, d, hh, mm);
        if (!isNaN(date.getTime()) && !isDateDisabled(date)) {
          triggerChange(date);
        }
      }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Enter") {
        setIsOpen(false);
        if (selectedDate) {
          setInputValue(formatForDisplay(selectedDate));
        }
      }

      // Strict filtering logic as requested:
      // No day > 31, no month > 12, no "0" alone
      // This is best handled by checking the proposed value

      const char = e.key;
      // Allow navigation and edit keys
      if (
        [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          "Enter",
          "Escape",
        ].includes(char)
      )
        return;

      // Allow digits, separators, and alphabets for MMM format
      if (
        !/[\d-/.]/.test(char) &&
        !(/[a-zA-Z]/.test(char) && dateFormat.includes("MMM")) &&
        !(/[ : ]/.test(char) && showTime)
      ) {
        e.preventDefault();
        return;
      }
    };

    // ── Today shortcut ────────────────────────────────────────────────────────
    const handleToday = (e: React.MouseEvent) => {
      e.stopPropagation();
      const t = showTime ? new Date() : toMidnight(new Date());
      if (!isDateDisabled(t)) {
        triggerChange(t);
        setIsOpen(false);
        setView("day");
      } else {
        setViewDate(t);
        setView("day");
      }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {/* Trigger Input */}
        <div
          className={cn(
            "flex w-full items-center min-h-[42px] justify-between rounded-md border border-input-border-default bg-white px-3 py-1.5 text-sm transition-colors duration-200 cursor-text",
            "focus-within:border-input-border-focus focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none",
            "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus-within:border-primary dark:focus-within:ring-primary/50",
            disabled &&
              "cursor-not-allowed opacity-50 bg-input-bg-disabled dark:bg-gray-800/50",
            rest["aria-invalid"] &&
              "!border-error focus-within:ring-error/50 dark:!border-error bg-error-bg dark:bg-error-bg/10",
          )}
          onClick={(e) => {
            if (disabled) return;
            // Prevent toggling if clicking the input itself
            if (e.target === inputRef.current) return;
            setIsOpen((o) => !o);
          }}
        >
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="text"
            disabled={disabled}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => {
              if (!disabled) setIsOpen(true);
            }}
            onBlur={() => {
              if (selectedDate) setInputValue(formatForDisplay(selectedDate));
            }}
            autoComplete="off"
            className="flex-1 bg-transparent border-none outline-none p-0 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />

          <div className="flex items-center gap-1.5 ml-2 text-gray-400 shrink-0">
            {isClearable && value && (
              <XIcon
                className="h-4 w-4 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                onClick={handleClear}
              />
            )}
            {isClearable && value && (
              <span className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
            )}
            <CalendarIcon
              className={cn(
                "h-4 w-4 cursor-pointer transition-colors hover:text-primary",
                isOpen && "text-primary",
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) setIsOpen((o) => !o);
              }}
            />
          </div>
        </div>

        {/* Calendar Popover */}
        {isOpen && !disabled && (
          <div
            className="absolute z-50 mt-1 w-[288px] rounded-xl border border-gray-200 bg-white shadow-xl shadow-black/10 dark:border-gray-700 dark:bg-gray-900 focus:outline-none overflow-hidden"
            onKeyDown={(e) => {
              if (view === "day") handleDayGridKeyDown(e);
              else if (view === "month") handleMonthGridKeyDown(e);
              else if (view === "year") handleYearGridKeyDown(e);
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1 text-sm text-gray-800 dark:text-gray-100 select-none">
                {headerLabel()}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Next"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-3">
              {view === "day" && (
                <>
                  <div className="grid grid-cols-7 mb-1">
                    {DAY_NAMES.map((d) => (
                      <div
                        key={d}
                        className="flex h-8 items-center justify-center text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 select-none"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-0.5">
                    {renderDayGrid()}
                  </div>
                </>
              )}

              {view === "month" && (
                <div className="grid grid-cols-3 gap-1.5">
                  {renderMonthGrid()}
                </div>
              )}

              {view === "year" && (
                <div className="grid grid-cols-3 gap-1.5">
                  {renderYearGrid()}
                </div>
              )}
            </div>

            {/* Footer */}
            {(showTodayButton || selectedDate || showTime) && (
              <div className="flex flex-col border-t border-gray-100 dark:border-gray-800 px-3 py-2 gap-2">
                {showTime && (
                  <div className="flex items-center justify-center gap-2 pb-2 border-b border-gray-50 dark:border-gray-800/50">
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={selectedDate?.getHours() ?? 0}
                        onChange={(e) => {
                          const h = Math.min(
                            23,
                            Math.max(0, parseInt(e.target.value) || 0),
                          );
                          const newD = new Date(selectedDate || new Date());
                          newD.setHours(h);
                          triggerChange(newD);
                        }}
                        className="w-12 rounded border border-gray-200 bg-gray-50 p-1 text-center text-sm dark:border-gray-700 dark:bg-gray-800"
                      />
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        HRS
                      </span>
                    </div>
                    <span className="font-bold text-gray-400">:</span>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={selectedDate?.getMinutes() ?? 0}
                        onChange={(e) => {
                          const m = Math.min(
                            59,
                            Math.max(0, parseInt(e.target.value) || 0),
                          );
                          const newD = new Date(selectedDate || new Date());
                          newD.setMinutes(m);
                          triggerChange(newD);
                        }}
                        className="w-12 rounded border border-gray-200 bg-gray-50 p-1 text-center text-sm dark:border-gray-700 dark:bg-gray-800"
                      />
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        MIN
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {showTodayButton && (
                    <button
                      type="button"
                      onClick={handleToday}
                      className={cn(
                        "text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors",
                        isDateDisabled(today) &&
                          "opacity-40 cursor-not-allowed",
                      )}
                    >
                      {showTime ? "Now" : "Today"}
                    </button>
                  )}
                  <div className="flex-1" />
                  {selectedDate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerChange(null);
                      }}
                      className="text-xs font-semibold text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
CustomDatePicker.displayName = "CustomDatePicker";

export { CustomDatePicker };
