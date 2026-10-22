import { cn } from "@/lib/utils";
import type { ResearchStatus } from "@/types/research";

const LABELS: Record<ResearchStatus, string> = {
  pending: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

const STYLES: Record<ResearchStatus, string> = {
  pending: "bg-status-pending/15 text-status-pending ring-status-pending/30",
  running: "bg-status-running/15 text-status-running ring-status-running/30",
  completed: "bg-status-completed/15 text-status-completed ring-status-completed/30",
  failed: "bg-status-failed/15 text-status-failed ring-status-failed/30",
};

export function StatusBadge({ status, className }: { status: ResearchStatus; className?: string }) {
  const s = (STYLES[status] ? status : "pending") as ResearchStatus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset",
        STYLES[s],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", s === "running" && "animate-pulse")} />
      {LABELS[s] ?? status}
    </span>
  );
}
