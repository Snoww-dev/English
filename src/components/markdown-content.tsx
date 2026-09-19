"use client";

import ReactMarkdown from "react-markdown";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-medium prose-headings:mt-4 prose-headings:mb-2">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
