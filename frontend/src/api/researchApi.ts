import { apiRequest } from "./client";
import type { ResearchJob, ResearchReport } from "@/types/research";

export const researchApi = {
  create(topic: string): Promise<ResearchJob> {
    return apiRequest<ResearchJob>("/research", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });
  },
  list(): Promise<ResearchJob[]> {
    return apiRequest<ResearchJob[]>("/research");
  },
  get(id: number | string): Promise<ResearchJob> {
    return apiRequest<ResearchJob>(`/research/${encodeURIComponent(String(id))}`);
  },
  report(id: number | string): Promise<ResearchReport> {
    return apiRequest<ResearchReport>(`/research/${encodeURIComponent(String(id))}/report`);
  },
};
