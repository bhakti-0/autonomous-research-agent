import { createFileRoute } from "@tanstack/react-router";
import { ResearchHistory } from "@/pages/ResearchHistory";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Research History — Autonomous Research Agent" },
      { name: "description", content: "Browse, search and filter all your previous research jobs." },
      { property: "og:title", content: "Research History — Autonomous Research Agent" },
      { property: "og:description", content: "Browse, search and filter all your previous research jobs." },
    ],
  }),
  component: ResearchHistory,
});
