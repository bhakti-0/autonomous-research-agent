import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useResearchJob } from "@/hooks/useResearch";
import { toFriendlyMessage } from "@/api/client";
import { ResearchStatus } from "@/components/ResearchStatus";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorView, LoadingView, btnGhost, btnPrimary } from "@/components/StateViews";
import { formatDate, parseDate } from "@/lib/format";
import { isActive } from "@/types/research";

const HEADLINE = {
  pending: "Research queued",
  running: "Research in progress",
  completed: "Research completed",
  failed: "Research failed",
} as const;

function useElapsed(since: string | undefined, active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);
  if (!since) return null;
  const s = Math.max(0, Math.floor((now - parseDate(since)) / 1000));
  if (Number.isNaN(s)) return null;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

export function ResearchProgress({ id }: { id: string }) {
  const navigate = useNavigate();
  const { data: job, error, isPending, refetch } = useResearchJob(id);
  const active = isActive(job?.status);
  const elapsed = useElapsed(job?.created_at, active);

  useEffect(() => {
    if (job?.status === "completed") {
      navigate({ to: "/report/$id", params: { id }, replace: true });
    }
  }, [job?.status, id, navigate]);

  if (isPending) return <LoadingView label="Loading research…" />;
  if (error || !job)
    return (
      <div className="px-4 py-20">
        <ErrorView
          title="Couldn't load this research"
          message={toFriendlyMessage(error)}
          action={
            <>
              <button onClick={() => refetch()} className={btnPrimary}>
                Try again
              </button>
              <Link to="/history" className={btnGhost}>
                Research History
              </Link>
            </>
          }
        />
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={job.status} />
          <span className="font-mono text-xs text-muted-foreground">Job #{job.id}</span>
          <span className="font-mono text-xs text-muted-foreground">· {formatDate(job.created_at)}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {job.topic}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="surface-card rounded-2xl p-8">
          {job.status === "failed" ? (
            <div>
              <h2 className="font-display text-2xl font-semibold text-status-failed">Research failed</h2>
              <p className="mt-3 text-sm text-muted-foreground">The backend reported the following error:</p>
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg border border-status-failed/30 bg-status-failed/10 p-4 font-mono text-sm text-foreground">
                {job.error || "No error details were provided."}
              </pre>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to="/" className={btnPrimary}>
                  Start New Research
                </Link>
                <Link to="/history" className={btnGhost}>
                  Back to Research History
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                <span className="absolute inset-2 rounded-full border border-primary/30" />
                {job.status === "completed" ? (
                  <span className="text-status-completed">✓</span>
                ) : (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                )}
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">{HEADLINE[job.status]}</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {job.status === "completed"
                  ? "Opening your report…"
                  : "Your research is being prepared. This may take a few moments."}
              </p>
              {elapsed && active && (
                <p className="mt-4 font-mono text-xs text-muted-foreground">Elapsed {elapsed} · checking every few seconds</p>
              )}
            </div>
          )}
        </div>

        <aside className="surface-card rounded-2xl p-6">
          <h3 className="mb-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">Pipeline</h3>
          <ResearchStatus status={job.status} />
        </aside>
      </div>
    </div>
  );
}
