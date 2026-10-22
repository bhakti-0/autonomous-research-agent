import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { useCreateResearch } from "@/hooks/useResearch";
import { toFriendlyMessage } from "@/api/client";

export function ResearchInput() {
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();
  const create = useCreateResearch();
  const trimmed = topic.trim();
  const disabled = !trimmed || create.isPending;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (disabled) return;
    create.mutate(trimmed, {
      onSuccess: (job) => navigate({ to: "/research/$id", params: { id: String(job.id) } }),
    });
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="surface-card group rounded-2xl p-2 transition focus-within:ring-2 focus-within:ring-primary/50">
        <label htmlFor="topic" className="sr-only">
          Research topic
        </label>
        <textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={onKey}
          rows={3}
          maxLength={500}
          placeholder="Impact of large language models on education"
          className="w-full resize-none bg-transparent px-4 pt-3 text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-2">
          <span className="font-mono text-xs text-muted-foreground">
            <kbd className="rounded border border-border px-1.5 py-0.5">⌘/Ctrl</kbd> +{" "}
            <kbd className="rounded border border-border px-1.5 py-0.5">Enter</kbd> to start
          </span>
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {create.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Starting…
              </>
            ) : (
              <>
                Start Research <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
      {create.isError && (
        <p role="alert" className="mt-3 text-sm text-status-failed">
          {toFriendlyMessage(create.error)}
        </p>
      )}
    </form>
  );
}
