import Link from "next/link";
import type { Metadata } from "next";
import { answerQuestion } from "@/lib/ask";
import AskAnswer from "@/components/AskAnswer";

export const metadata: Metadata = {
  title: "Ask - Wood Coatings Catalogue",
  description: "Ask a direct question about any product's specs, like drying time or VOC content.",
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

const EXAMPLES = [
  "Renner YL-M602 drying time",
  "VOC content of Cetol HLS Plus",
  "How many coats for SuperDeck stain",
  "Sheen of Ankocryl Interior PU Topcoat",
];

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = firstValue(sp.q);
  const result = q.trim() ? answerQuestion(q) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Ask about a product
        </h1>
        <p className="text-sm text-muted-foreground">
          Type a product and what you want to know, e.g. &ldquo;Renner YL-M602 drying
          time&rdquo;. This looks the answer up directly in the catalogue &mdash; no AI model
          involved, so it works best with the product&apos;s name or code plus a spec keyword.
        </p>
      </div>

      <form method="GET" action="/ask" className="mb-8">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <label htmlFor="q" className="sr-only">
            Ask a question
          </label>
          <input
            id="q"
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Ask a question about any product..."
            autoFocus
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <button
          type="submit"
          className="mt-3 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
        >
          Ask
        </button>
      </form>

      {!result && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Try asking:</p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <Link
                key={ex}
                href={`/ask?q=${encodeURIComponent(ex)}`}
                className="text-sm text-accent hover:text-accent-hover"
              >
                &ldquo;{ex}&rdquo;
              </Link>
            ))}
          </div>
        </div>
      )}

      {result && <AskAnswer result={result} />}
    </div>
  );
}
