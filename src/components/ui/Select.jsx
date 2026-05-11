import { useMemo, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Select({
  options = [],
  value,
  onChange,
  disabled = false,
  className,
  triggerClassName,
  placeholder = 'Pilih opsi',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  function handleSelect(optionValue) {
    onChange?.(optionValue);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        className={cn(
          'flex h-[45px] w-full items-center justify-between gap-2 rounded-xl border border-black bg-transparent pl-2 pr-3 text-left text-body1 font-normal text-[#0f172a]',
          'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-normal/30',
          disabled && 'cursor-not-allowed opacity-50',
          triggerClassName
        )}
        onClick={() => !disabled && setIsOpen((current) => !current)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn(!selectedOption && 'text-[#64748b]')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          className={cn(
            'size-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 max-h-60 w-full overflow-y-auto rounded-xl border border-black bg-white py-1 shadow-sm"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'flex min-h-[45px] w-full items-center px-3 text-left text-body1 font-normal text-[#0f172a] transition-colors duration-150 hover:bg-green-light-hover cursor-pointer',
                option.value === value && 'border-l-4 border-green-normal',
              )}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
