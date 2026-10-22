import { describe, expect, it } from "vitest";
import { POLL_INTERVAL_MS, pollIntervalFor } from "@/hooks/useResearch";
import type { ResearchJob } from "@/types/research";

const job = (status: ResearchJob["status"]): ResearchJob => ({
  id: 1, topic: "t", status, created_at: "2026-10-17T04:59:13", report: null, error: null,
});

describe("polling", () => {
  it("polls every 2-3s while pending", () => expect(pollIntervalFor(job("pending"))).toBe(POLL_INTERVAL_MS));
  it("polls while running", () => expect(pollIntervalFor(job("running"))).toBe(POLL_INTERVAL_MS));
  it("stops when completed", () => expect(pollIntervalFor(job("completed"))).toBe(false));
  it("stops when failed", () => expect(pollIntervalFor(job("failed"))).toBe(false));
  it("interval is between 2 and 3 seconds", () => {
    expect(POLL_INTERVAL_MS).toBeGreaterThanOrEqual(2000);
    expect(POLL_INTERVAL_MS).toBeLessThanOrEqual(3000);
  });
});
