import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { RefreshCw, Search } from "lucide-react";
import { useResearchList } from "@/hooks/useResearch";
import { toFriendlyMessage } from "@/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import { JobAction, ResearchCard } from "@/components/ResearchCard";
import { ErrorView, LoadingView, btnGhost, btnPrimary } from "@/components/StateViews";
import { formatDate, parseDate } from "@/lib/format";
import type { ResearchStatus } from "@/types/research";
import { cn } from "@/lib/utils";

const FILTERS: Array<ResearchStatus | "all"> = ["all", "pending", "running", "completed", "failed"];

export function ResearchHistory() {
  const { data, error, isPending, refetch, isFetching } = useResearchList();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<ResearchStatus | "all">("all");

  const jobs = useMemo(() => {
    const list = Array.isArray(data) ? [...data] : [];
    list.sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at) || b.id - a.id);
    const needle = q.trim().toLowerCase();
    return list.filter(
      (j) => (filter === "all" || j.status === filter) && (!needle || j.topic?.toLowerCase().includes(needle)),
    );
  }, [data, q, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Research History</h1>
          <p className="mt-1 text-sm text-muted-foreground">All research jobs from your backend, newest first.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className={btnGhost} aria-label="Refresh">
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </button>
          <Link to="/" className={btnPrimary}>
            New Research
          </Link>
        </div>
      </div>

      {isPending ? (
        <LoadingView label="Loading research history…" />
      ) : error ? (
        <ErrorView
          title="Couldn't load research history"
          message={toFriendlyMessage(error)}
          action={
            <button onClick={() => refetch()} className={btnPrimary}>
              Try again
            </button>
          }
        />
      ) : !data?.length ? (
        <div className="surface-card rounded-2xl px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-foreground">No research projects yet.</p>
          <Link to="/" className={cn(btnPrimary, "mt-6")}>
            Start your first research
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by topic…"
                className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium capitalize transition",
                    filter === f ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {jobs.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No research matches your filters.</p>
          ) : (
            <>
              <div className="surface-card hidden overflow-x-auto rounded-2xl md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-medium">ID</th>
                      <th className="px-5 py-3 font-medium">Topic</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Created</th>
                      <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {jobs.map((j) => (
                      <tr key={j.id} className="transition hover:bg-accent/40">
                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">#{j.id}</td>
                        <td className="max-w-md px-5 py-4 font-medium text-foreground">{j.topic}</td>
                        <td className="px-5 py-4"><StatusBadge status={j.status} /></td>
                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{formatDate(j.created_at)}</td>
                        <td className="px-5 py-4 text-right"><JobAction job={j} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 md:hidden">
                {jobs.map((j) => (
                  <ResearchCard key={j.id} job={j} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
