export type ResearchStatus = "pending" | "running" | "completed" | "failed";

export interface ResearchReport {
  topic?: string;
  summary?: string;
  key_findings?: unknown[];
  claims?: unknown[];
  limitations?: unknown[];
  sources?: unknown[];
  source_count?: number;
}

export interface ResearchJob {
  id: number;
  topic: string;
  status: ResearchStatus;
  created_at: string;
  report: ResearchReport | null;
  error: string | null;
}

export const ACTIVE_STATUSES: ResearchStatus[] = ["pending", "running"];

export function isActive(status: ResearchStatus | undefined): boolean {
  return status === "pending" || status === "running";
}
