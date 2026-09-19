"use client";

import { Button } from "@/components/ui/button";

/**
 * Duolingo sends `X-Frame-Options: SAMEORIGIN`, so it cannot be embedded in an
 * iframe on this site (verified via `curl -I https://www.duolingo.com/`).
 * Opening it in a new tab is the only ToS-safe option — the existing
 * duolingo.com session cookie in the browser carries over automatically.
 */
export function DuolingoLaunchButton() {
  return (
    <Button
      render={
        <a href="https://www.duolingo.com/learn" target="_blank" rel="noreferrer" />
      }
      size="sm"
      variant="secondary"
    >
      Luyện Duolingo ↗
    </Button>
  );
}
