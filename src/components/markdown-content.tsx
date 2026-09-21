"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "cn";
import { buildHeadingIdLookup, getCategoryStyle, slugifyHeading } from "@/lib/grammar-style";

// react-markdown's `li` renderer isn't told whether its list is ordered, so
// the surrounding `ol`/`ul` renderer provides that via context instead.
const OrderedListContext = createContext(false);
const VIETNAMESE_CHARACTER_PATTERN = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
const ENGLISH_WORD_PATTERN = /^[A-Za-z]+(?:['’-][A-Za-z]+)*$/;
const WORD_TOKEN_PATTERN = /(\p{L}+(?:['’-]\p{L}+)*)/gu;
const PRONUNCIATION_BUTTON_CLASS =
  "-mx-0.5 inline cursor-pointer rounded-sm px-0.5 text-left text-inherit transition-colors hover:bg-slate-200 hover:text-slate-700 focus-visible:bg-slate-200 focus-visible:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500";
const WORD_PRONUNCIATION_CLASS =
  "underline decoration-dotted decoration-current/40 underline-offset-4";

function plainText(children: ReactNode): string | null {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (!Array.isArray(children)) return null;

  const parts = children.map((child) =>
    typeof child === "string" || typeof child === "number" ? String(child) : null,
  );
  return parts.every((part) => part !== null) ? parts.join("") : null;
}

function isLikelyEnglishExample(text: string) {
  if (!/[A-Za-z]/.test(text)) return false;
  if (!VIETNAMESE_CHARACTER_PATTERN.test(text)) return true;
  return /^\s*ví dụ\s*:/i.test(text);
}

function getSingleEnglishSentence(text: string) {
  const prefix = text.match(/^\s*ví dụ\s*:\s*/i)?.[0] ?? "";
  const remainder = text.slice(prefix.length);
  const leadingSpace = remainder.match(/^\s*/)?.[0] ?? "";
  const trailingSpace = remainder.match(/\s*$/)?.[0] ?? "";
  const sentence = remainder.slice(leadingSpace.length, remainder.length - trailingSpace.length).trim();
  const words = sentence.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
  const commaParts = sentence
    .replace(/[.!?]+["'”’)]*$/, "")
    .split(",")
    .map((part) => part.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)?.length ?? 0);
  const looksLikeWordList = commaParts.length > 1 && commaParts.every((wordCount) => wordCount <= 2);

  if (
    words.length < 2 ||
    !/[.!?]+["'”’)]*$/.test(sentence) ||
    sentence.includes(" / ") ||
    looksLikeWordList
  ) {
    return null;
  }

  return { prefix: `${prefix}${leadingSpace}`, sentence, trailingSpace };
}

function PronounceableText({ text }: { text: string }) {
  const speak = useCallback((spokenText: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => voice.lang.toLowerCase() === "en-us") ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
      null;
    window.speechSynthesis.speak(utterance);
  }, []);

  const sentence = getSingleEnglishSentence(text);
  if (sentence) {
    return (
      <>
        {sentence.prefix}
        <button
          type="button"
          lang="en"
          onClick={() => speak(sentence.sentence)}
          className={PRONUNCIATION_BUTTON_CLASS}
          aria-label={`Nghe phát âm cả câu: ${sentence.sentence}`}
          title="Nghe phát âm cả câu"
        >
          {sentence.sentence}
        </button>
        {sentence.trailingSpace}
      </>
    );
  }

  return text.split(WORD_TOKEN_PATTERN).map((part, index) => {
    if (!ENGLISH_WORD_PATTERN.test(part)) return part;

    return (
      <button
        key={`${part}-${index}`}
        type="button"
        lang="en"
        onClick={() => speak(part)}
        className={`${PRONUNCIATION_BUTTON_CLASS} ${WORD_PRONUNCIATION_CLASS}`}
        aria-label={`Nghe phát âm từ ${part}`}
        title={`Nghe phát âm: ${part}`}
      >
        {part}
      </button>
    );
  });
}

function pronounceIfEnglish(children: ReactNode) {
  const text = plainText(children);
  return text !== null && isLikelyEnglishExample(text) ? (
    <span className="text-muted-foreground">
      <PronounceableText text={text} />
    </span>
  ) : (
    children
  );
}

function MarkdownListItem({
  children,
  dotClass,
}: {
  children: ReactNode;
  dotClass: string;
}) {
  const ordered = useContext(OrderedListContext);
  if (ordered) {
    return <li className="pl-1 leading-relaxed text-foreground/90">{children}</li>;
  }
  return (
    <li className="flex gap-2.5 pl-0.5 leading-relaxed text-foreground/90">
      <span className={cn("mt-2.5 inline-block size-1.5 shrink-0 rounded-full", dotClass)} />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

function flattenText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (typeof node === "object" && "props" in node) {
    return flattenText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

export function MarkdownContent({
  content,
  accent,
}: {
  content: string;
  accent?: string;
}) {
  const style = getCategoryStyle(accent ?? "");
  // Precomputed once per `content` change (pure) instead of mutating a Map
  // while h2/h3 render — that used to desync between the server render and
  // React Strict Mode's dev-only double client render.
  const headingIds = useMemo(() => buildHeadingIdLookup(content), [content]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function headingId(children: ReactNode): string {
    const text = flattenText(children);
    return headingIds.get(text) ?? slugifyHeading(text);
  }

  const components: Components = {
    h2({ children }) {
      return (
        <h2
          id={headingId(children)}
          className="mt-10 mb-4 scroll-mt-24 border-b border-border pb-2 text-xl font-semibold tracking-tight text-foreground first:mt-0"
        >
          <span className={cn("mr-2.5 inline-block size-2 rounded-full align-middle", style.dot)} />
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3
          id={headingId(children)}
          className="mt-6 mb-2 scroll-mt-24 text-base font-semibold text-foreground"
        >
          <span className={cn("mr-2 inline-block h-3 w-1 rounded-full align-middle", style.dot)} />
          {children}
        </h3>
      );
    },
    p({ children }) {
      return (
        <p className="mb-3 leading-relaxed text-foreground/90 last:mb-0">
          {pronounceIfEnglish(children)}
        </p>
      );
    },
    strong({ children }) {
      return (
        <strong className={cn("font-semibold", style.text)}>{pronounceIfEnglish(children)}</strong>
      );
    },
    em({ children }) {
      return <em className="italic text-muted-foreground">{pronounceIfEnglish(children)}</em>;
    },
    a({ href, children }) {
      return (
        <a
          href={href}
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noreferrer" : undefined}
          className={cn("underline underline-offset-4 hover:no-underline", style.text)}
        >
          {children}
        </a>
      );
    },
    code({ children }) {
      return (
        <code
          className={cn(
            "rounded-md border px-1.5 py-0.5 font-mono text-[0.8em] whitespace-nowrap",
            style.badge,
          )}
        >
          {children}
        </code>
      );
    },
    ul({ children }) {
      return (
        <OrderedListContext.Provider value={false}>
          <ul className="mb-4 flex flex-col gap-1.5 last:mb-0">{children}</ul>
        </OrderedListContext.Provider>
      );
    },
    ol({ children }) {
      return (
        <OrderedListContext.Provider value={true}>
          <ol className="mb-4 list-decimal space-y-1.5 pl-5 marker:font-medium marker:text-muted-foreground last:mb-0">
            {children}
          </ol>
        </OrderedListContext.Provider>
      );
    },
    li({ children }) {
      return <MarkdownListItem dotClass={style.dot}>{children}</MarkdownListItem>;
    },
    blockquote({ children }) {
      return (
        <blockquote
          className={cn(
            "mb-4 rounded-r-lg border-l-4 py-2 pr-3 pl-4 text-foreground/90 last:mb-0",
            style.border,
            style.soft,
          )}
        >
          {children}
        </blockquote>
      );
    },
    hr() {
      return <hr className="my-8 border-border/60" />;
    },
    table({ children }) {
      return (
        <div className="mb-4 overflow-x-auto rounded-xl border border-border last:mb-0">
          <table className="w-full border-collapse text-left text-sm">{children}</table>
        </div>
      );
    },
    thead({ children }) {
      return (
        <thead className={cn(style.soft, style.text)}>
          {children}
        </thead>
      );
    },
    th({ children }) {
      return (
        <th className="border-b border-border px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="border-b border-border/60 px-3 py-2 align-top text-foreground/90 last:border-b-0">
          {pronounceIfEnglish(children)}
        </td>
      );
    },
    tr({ children }) {
      return <tr className="even:bg-muted/40">{children}</tr>;
    },
  };

  return (
    <div className="max-w-none text-[0.95rem]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
