import { Link } from "@tanstack/react-router";
import { BookOpenCheck, Brain, Search } from "lucide-react";
import { ResearchInput } from "@/components/ResearchInput";

const STEPS = [
  { icon: Search, title: "Discover", text: "Searches the web for relevant sources on your topic." },
  { icon: Brain, title: "Analyze", text: "Reads and analyzes each source with a language model." },
  { icon: BookOpenCheck, title: "Report", text: "Writes a structured, source-backed research report." },
];

export function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="mx-auto max-w-3xl pb-16 pt-16 text-center sm:pt-24">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-status-completed" /> Autonomous research pipeline
        </p>
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Research, <span className="text-gradient">automated.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Turn a research question into a structured, source-backed report using an autonomous AI research
          pipeline.
        </p>
        <div className="mt-10 text-left">
          <ResearchInput />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Looking for earlier work?{" "}
          <Link to="/history" className="text-primary hover:underline">
            Browse research history
          </Link>
        </p>
      </section>

      <section className="grid gap-4 pb-24 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="surface-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-4 font-display font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
