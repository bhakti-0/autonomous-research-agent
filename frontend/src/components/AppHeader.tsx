import { Link } from "@tanstack/react-router";
import { Telescope } from "lucide-react";

const navCls =
  "rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
            <Telescope className="h-4 w-4" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base">
            Autonomous Research Agent
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className={navCls} activeOptions={{ exact: true }}>
            New Research
          </Link>
          <Link to="/history" className={navCls}>
            Research History
          </Link>
        </nav>
      </div>
    </header>
  );
}
