import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { useResearchJob, useResearchReport } from "@/hooks/useResearch";
import { toFriendlyMessage } from "@/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyButton } from "@/components/CopyButton";
import { EmptyNote, ItemList, ReportSection } from "@/components/ReportSection";
import { SourceList, normalizeSource } from "@/components/SourceList";
import { ErrorView, LoadingView, btnGhost, btnPrimary } from "@/components/StateViews";
import { asArray, formatDate, itemToText } from "@/lib/format";
import type { ResearchReport as Report } from "@/types/research";

function texts(v: unknown): string[] {
  return asArray(v).map(itemToText).filter(Boolean);
}

function reportToText(topic: string, r: Report, findings: string[], claims: string[], limits: string[]): string {
  const sources = asArray(r.sources).map((s) => {
    const n = normalizeSource(s);
    return n.url && n.url !== n.title ? `${n.title} — ${n.url}` : n.title;
  });
  const list = (xs: string[]) => xs.map((x, i) => `${i + 1}. ${x}`).join("\n");
  return [
    `# ${topic}`,
    `## Executive Summary\n${r.summary ?? ""}`,
    `## Key Findings\n${list(findings)}`,
    `## Claims\n${list(claims)}`,
    `## Limitations\n${list(limits)}`,
    `## Sources\n${list(sources)}`,
  ].join("\n\n");
}

export function ResearchReport({ id }: { id: string }) {
  const navigate = useNavigate();
  const job = useResearchJob(id);
  const status = job.data?.status;
  const report = useResearchReport(id, status === "completed");

  useEffect(() => {
    if (status && status !== "completed") navigate({ to: "/research/$id", params: { id }, replace: true });
  }, [status, id, navigate]);

  if (job.isPending || (status === "completed" && report.isPending)) return <LoadingView label="Loading report…" />;

  const err = job.error ?? report.error;
  if (err || !job.data)
    return (
      <div className="px-4 py-20">
        <ErrorView
          title="Couldn't load this report"
          message={toFriendlyMessage(err)}
          action={
            <>
              <button onClick={() => (job.error ? job.refetch() : report.refetch())} className={btnPrimary}>
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

  if (status !== "completed") return <LoadingView label="Redirecting…" />;

  const r: Report = report.data ?? {};
  const topic = r.topic || job.data.topic;
  const findings = texts(r.key_findings);
  const claims = texts(r.claims);
  const limits = texts(r.limitations);
  const sources = asArray(r.sources);
  const sourceCount = typeof r.source_count === "number" ? r.source_count : sources.length;
  const isEmpty = !r.summary && !findings.length && !claims.length && !limits.length && !sources.length;

  const nav = [
    { id: "summary", label: "Executive Summary" },
    { id: "findings", label: "Key Findings", n: findings.length },
    { id: "claims", label: "Claims", n: claims.length },
    { id: "limitations", label: "Limitations", n: limits.length },
    { id: "sources", label: "Sources", n: sources.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Research History
        </Link>
        <Link to="/" className={btnGhost}>
          <Plus className="h-4 w-4" /> Start New Research
        </Link>
      </div>

      <header className="surface-card mb-10 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={job.data.status} />
          <span className="font-mono text-xs text-muted-foreground">Research #{job.data.id}</span>
          <span className="font-mono text-xs text-muted-foreground">· {formatDate(job.data.created_at)}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{topic}</h1>
        <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-border pt-5">
          <Stat label="Sources" value={sourceCount} />
          <Stat label="Key findings" value={findings.length} />
          <Stat label="Claims" value={claims.length} />
          <div className="ml-auto">
            <CopyButton text={reportToText(topic, r, findings, claims, limits)} label="Copy full report" />
          </div>
        </div>
      </header>

      {isEmpty ? (
        <ErrorView title="This report is empty" message="The backend completed the job but returned no report content." />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
          <nav className="hidden lg:block">
            <ul className="sticky top-24 space-y-1 border-l border-border">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="-ml-px flex items-center justify-between border-l border-transparent py-1.5 pl-4 pr-2 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
                  >
                    {n.label}
                    {n.n !== undefined && <span className="font-mono text-xs">{n.n}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="min-w-0 space-y-12">
            <ReportSection id="summary" title="Executive Summary" copyText={r.summary || undefined}>
              {r.summary ? (
                <p className="whitespace-pre-line text-[17px] leading-8 text-foreground/90">{r.summary}</p>
              ) : (
                <EmptyNote>No summary was provided.</EmptyNote>
              )}
            </ReportSection>

            <ReportSection id="findings" title="Key Findings" count={findings.length} copyText={findings.join("\n") || undefined}>
              {findings.length ? <ItemList items={findings} variant="numbered" /> : <EmptyNote>No key findings were provided.</EmptyNote>}
            </ReportSection>

            <ReportSection id="claims" title="Claims" count={claims.length} copyText={claims.join("\n") || undefined}>
              {claims.length ? <ItemList items={claims} variant="bullet" /> : <EmptyNote>No claims were provided.</EmptyNote>}
            </ReportSection>

            <ReportSection id="limitations" title="Limitations" count={limits.length} copyText={limits.join("\n") || undefined}>
              {limits.length ? <ItemList items={limits} variant="warn" /> : <EmptyNote>No limitations were listed.</EmptyNote>}
            </ReportSection>

            <ReportSection id="sources" title="Sources" count={sourceCount}>
              {sources.length ? <SourceList sources={sources} /> : <EmptyNote>No sources were listed.</EmptyNote>}
            </ReportSection>
          </article>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
