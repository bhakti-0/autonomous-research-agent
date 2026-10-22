import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { researchApi } from "@/api/researchApi";
import { ApiError } from "@/api/client";
import { isActive, type ResearchJob } from "@/types/research";

export const POLL_INTERVAL_MS = 2500;

export const researchKeys = {
  all: ["research"] as const,
  list: () => ["research", "list"] as const,
  job: (id: string) => ["research", "job", id] as const,
  report: (id: string) => ["research", "report", id] as const,
};

/** Polling interval for a job: poll only while pending/running. */
export function pollIntervalFor(job: ResearchJob | undefined): number | false {
  return job && isActive(job.status) ? POLL_INTERVAL_MS : false;
}

const noRetryOn4xx = (count: number, err: unknown) =>
  !(err instanceof ApiError && err.status !== null && err.status < 500) && count < 2;

/** Single job. React Query dedupes by key, so only one poller exists per job. */
export function useResearchJob(id: string) {
  return useQuery({
    queryKey: researchKeys.job(id),
    queryFn: () => researchApi.get(id),
    refetchInterval: (q) => pollIntervalFor(q.state.data),
    refetchIntervalInBackground: true,
    retry: noRetryOn4xx,
  });
}

export function useResearchReport(id: string, enabled = true) {
  return useQuery({
    queryKey: researchKeys.report(id),
    queryFn: () => researchApi.report(id),
    enabled,
    retry: noRetryOn4xx,
  });
}

export function useResearchList() {
  return useQuery({
    queryKey: researchKeys.list(),
    queryFn: () => researchApi.list(),
    refetchInterval: (q) => (q.state.data?.some((j) => isActive(j.status)) ? 5000 : false),
    retry: noRetryOn4xx,
  });
}

export function useCreateResearch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (topic: string) => researchApi.create(topic),
    onSuccess: (job) => {
      qc.setQueryData(researchKeys.job(String(job.id)), job);
      qc.invalidateQueries({ queryKey: researchKeys.list() });
    },
  });
}
