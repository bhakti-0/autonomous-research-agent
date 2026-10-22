import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResearchStatus as Status } from "@/types/research";

const STAGES = [
  "Research Queued",
  "Researching Sources",
  "Analyzing Sources",
  "Generating Report",
  "Completed",
];

/**
 * Visual pipeline. The backend only reports pending/running/completed/failed,
 * so the middle three stages are shown together as "in progress" while running.
 */
export function ResearchStatus({ status }: { status: Status }) {
  const stateFor = (i: number): "done" | "active" | "idle" | "failed" => {
    if (status === "completed") return "done";
    if (status === "pending") return i === 0 ? "active" : "idle";
    if (status === "running") return i === 0 ? "done" : i <= 3 ? "active" : "idle";
    // failed
    return i === 0 ? "done" : i === 4 ? "failed" : "idle";
  };

  return (
    <ol className="relative space-y-1">
      {STAGES.map((label, i) => {
        const st = stateFor(i);
        const last = i === STAGES.length - 1;
        return (
          <li key={label} className="relative flex gap-4 pb-5">
            {!last && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px",
                  st === "done" ? "bg-status-completed/50" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs",
                st === "done" && "border-status-completed/40 bg-status-completed/15 text-status-completed",
                st === "active" && "border-primary/50 bg-primary/15 text-primary",
                st === "idle" && "border-border bg-card text-muted-foreground",
                st === "failed" && "border-status-failed/40 bg-status-failed/15 text-status-failed",
              )}
            >
              {st === "done" ? (
                <Check className="h-4 w-4" />
              ) : st === "active" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : st === "failed" ? (
                <X className="h-4 w-4" />
              ) : (
                <span className="font-mono">{i + 1}</span>
              )}
            </span>
            <div className="pt-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  st === "idle" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {st === "failed" ? "Failed" : label}
              </p>
            </div>
          </li>
        );
      })}
      <p className="pl-12 text-xs text-muted-foreground">
        Stages are an approximate visualization. Live state comes from the backend status.
      </p>
    </ol>
  );
}
