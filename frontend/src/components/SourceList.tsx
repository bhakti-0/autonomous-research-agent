import { ExternalLink, FileText } from "lucide-react";
import { isUrl, itemToText } from "@/lib/format";

interface NormalizedSource {
  title: string;
  url?: string | undefined;
  snippet?: string | undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

export function normalizeSource(src: unknown): NormalizedSource {
  if (typeof src === "string") {
    return isUrl(src) ? { title: src, url: src } : { title: src };
  }
  if (src && typeof src === "object") {
    const o = src as Record<string, unknown>;
    const url = str(o["url"]) ?? str(o["link"]) ?? str(o["href"]) ?? str(o["source"]);
    const title = str(o["title"]) ?? str(o["name"]) ?? url ?? itemToText(src);
    const snippet = str(o["snippet"]) ?? str(o["summary"]) ?? str(o["description"]) ?? str(o["content"]);
    return { title, url: url && isUrl(url) ? url : undefined, snippet: snippet?.slice(0, 280) };
  }
  return { title: itemToText(src) };
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SourceList({ sources }: { sources: unknown[] }) {
  const items = sources.map(normalizeSource);
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {items.map((s, i) => (
        <li key={i} className="surface-card flex gap-3 rounded-xl p-4">
          <span className="font-mono text-xs text-muted-foreground">[{i + 1}]</span>
          <div className="min-w-0 flex-1">
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex max-w-full items-start gap-1.5 font-medium text-foreground hover:text-primary"
              >
                <span className="line-clamp-2 break-words">{s.title}</span>
                <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
              </a>
            ) : (
              <p className="flex items-start gap-1.5 break-words font-medium text-foreground">
                <FileText className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                {s.title}
              </p>
            )}
            {s.url && <p className="mt-0.5 truncate font-mono text-xs text-primary/70">{hostOf(s.url)}</p>}
            {s.snippet && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.snippet}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
