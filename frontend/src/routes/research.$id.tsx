import { createFileRoute } from "@tanstack/react-router";
import { ResearchProgress } from "@/pages/ResearchProgress";

export const Route = createFileRoute("/research/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Research #${params.id} in progress — Autonomous Research Agent` },
      { name: "description", content: "Live progress of an autonomous research job." },
      { property: "og:title", content: `Research #${params.id} — Autonomous Research Agent` },
      { property: "og:description", content: "Live progress of an autonomous research job." },
    ],
  }),
  component: ProgressRoute,
});

function ProgressRoute() {
  const { id } = Route.useParams();
  return <ResearchProgress key={id} id={id} />;
}
