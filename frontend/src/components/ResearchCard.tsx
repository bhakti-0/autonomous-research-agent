import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/lib/format";
import type { ResearchJob } from "@/types/research";

export function JobAction({ job }: { job: ResearchJob }) {
  const id = String(job.id);
  const cls =
    "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/50 hover:text-primary";
  if (job.status === "completed")
    return (
      <Link to="/report/$id" params={{ id }} className={cls}>
        View Report <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    );
  return (
    <Link to="/research/$id" params={{ id }} className={cls}>
      {job.status === "failed" ? "View Details" : "View Progress"} <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}

/** Card layout used on small screens in history. */
export function ResearchCard({ job }: { job: ResearchJob }) {
  return (
    <div className="surface-card rounded-xl p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">#{job.id}</span>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-2 font-medium text-foreground">{job.topic}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formatDate(job.created_at)}</span>
        <JobAction job={job} />
      </div>
    </div>
  );
}
