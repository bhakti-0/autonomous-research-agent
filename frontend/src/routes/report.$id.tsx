import { createFileRoute } from "@tanstack/react-router";
import { ResearchReport } from "@/pages/ResearchReport";

export const Route = createFileRoute("/report/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Research report #${params.id} — Autonomous Research Agent` },
      { name: "description", content: "A structured, source-backed research report." },
      { property: "og:title", content: `Research report #${params.id}` },
      { property: "og:description", content: "A structured, source-backed research report." },
    ],
  }),
  component: ReportRoute,
});

function ReportRoute() {
  const { id } = Route.useParams();
  return <ResearchReport key={id} id={id} />;
}
