"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DuolingoLaunchButton } from "@/components/duolingo-launch-button";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/grammar", label: "Ngữ pháp" },
  { href: "/lessons", label: "Bài học" },
  { href: "/exercises", label: "Luyện tập" },
  { href: "/progress", label: "Tiến độ" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          English<span className="text-muted-foreground">.study</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <DuolingoLaunchButton />
      </div>
    </header>
  );
}
