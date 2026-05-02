import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LegalAccordion({ items }) {
  const [openItemId, setOpenItemId] = useState(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {items.map((item) => {
        const isOpen = openItemId === item.id;
        const panelId = `${item.id}-panel`;
        const buttonId = `${item.id}-button`;

        return (
          <article key={item.id}>
            <h2>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex min-h-[76px] w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-extrabold text-text transition-colors hover:bg-green-light focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-green-normal sm:px-7 sm:text-lg"
                onClick={() => {
                  setOpenItemId(isOpen ? null : item.id);
                }}
              >
                <span className="min-w-0">{item.question}</span>
                <ChevronDown
                  className={cn(
                    'size-5 shrink-0 text-green-dark transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
            </h2>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-6 text-sm font-medium leading-relaxed text-text-muted sm:px-7 sm:text-base"
            >
              {item.answer}
            </div>
          </article>
        );
      })}
    </div>
  );
}
