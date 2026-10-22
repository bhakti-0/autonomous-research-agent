import type { ReactNode } from "react";
import { CopyButton } from "./CopyButton";

export function ReportSection({
  id,
  title,
  count,
  copyText,
  children,
}: {
  id: string;
  title: string;
  count?: number | undefined;
  copyText?: string | undefined;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
        <h2 className="font-display text-xl font-semibold text-foreground">
          {title}
          {count !== undefined && (
            <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">{count}</span>
          )}
        </h2>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </section>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="text-sm italic text-muted-foreground">{children}</p>;
}

export function ItemList({ items, variant }: { items: string[]; variant: "numbered" | "bullet" | "warn" }) {
  return (
    <ul className="space-y-3">
      {items.map((t, i) => (
        <li key={i} className="surface-card flex gap-4 rounded-xl p-4">
          <span
            className={
              variant === "numbered"
                ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-xs font-semibold text-primary"
                : variant === "warn"
                  ? "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-status-pending"
                  : "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
            }
          >
            {variant === "numbered" ? String(i + 1).padStart(2, "0") : null}
          </span>
          <p className="leading-relaxed text-foreground/90">{t}</p>
        </li>
      ))}
    </ul>
  );
}
