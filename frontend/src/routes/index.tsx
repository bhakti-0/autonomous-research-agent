import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Autonomous Research Agent — Research, automated." },
      { name: "description", content: "Turn a research question into a structured, source-backed report with an autonomous AI research pipeline." },
      { property: "og:title", content: "Autonomous Research Agent" },
      { property: "og:description", content: "Turn a research question into a structured, source-backed report." },
    ],
  }),
  component: Dashboard,
});
