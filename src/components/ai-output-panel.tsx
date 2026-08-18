import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Check, Copy, Eraser, Pencil, RefreshCw, Sparkle, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type RefinementOption = { key: string; label: string };

export const STANDARD_REFINEMENTS: RefinementOption[] = [
  { key: "concise", label: "Make more concise" },
  { key: "professional", label: "Make more professional" },
  { key: "simplify", label: "Simplify" },
  { key: "expand", label: "Expand" },
  { key: "bullets", label: "Convert to bullet points" },
];

type Props = {
  content: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  error?: string | null;
  onRegenerate?: () => void;
  onClear: () => void;
  onRefine?: (key: string) => void;
  refinements?: RefinementOption[];
  emptyStateMessage: string;
  loadingMessage?: string;
};

export function AiOutputPanel({
  content,
  onChange,
  isLoading,
  error,
  onRegenerate,
  onClear,
  onRefine,
  refinements = STANDARD_REFINEMENTS,
  emptyStateMessage,
  loadingMessage = "Generating response...",
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Content copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy the content. Please copy it manually.");
    }
  };

  return (
    <section
      aria-label="AI-Generated Output"
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border gradient-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkle className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">AI-Generated Output</h2>
        </div>

        {content && !isLoading ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing((v) => !v)}>
              <Pencil className="size-4" aria-hidden="true" />
              {isEditing ? "Preview" : "Edit"}
            </Button>
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              Copy
            </Button>
            {onRegenerate ? (
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Regenerate
              </Button>
            ) : null}
            {onRefine ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Refine
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {refinements.map((option) => (
                    <DropdownMenuItem key={option.key} onSelect={() => onRefine(option.key)}>
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Eraser className="size-4" aria-hidden="true" />
              Clear
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6" aria-live="polite" aria-busy={isLoading}>
        {isLoading ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary">{loadingMessage}</p>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-4">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-foreground">{error}</p>
                {onRegenerate ? (
                  <Button className="mt-3" size="sm" variant="outline" onClick={onRegenerate}>
                    <RefreshCw className="size-4" aria-hidden="true" />
                    Retry
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : content ? (
          isEditing ? (
            <>
              <label htmlFor="ai-output-editor" className="sr-only">
                Edit AI-generated output
              </label>
              <Textarea
                id="ai-output-editor"
                value={content}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-[420px] font-mono text-sm"
              />
            </>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )
        ) : (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{emptyStateMessage}</p>
        )}
      </div>
    </section>
  );
}
