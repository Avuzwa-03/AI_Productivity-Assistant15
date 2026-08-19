import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ShieldAlert } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiOutputPanel } from "@/components/ai-output-panel";
import { useAiGeneration } from "@/hooks/use-ai-generation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace" },
      {
        name: "description",
        content:
          "Generate structured research assistance with clearly labelled AI-generated findings for independent verification.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Structured research assistance for professional decisions." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard");
  const [audience, setAudience] = useState("Professional");
  const [format, setFormat] = useState("Summary");
  const [validationError, setValidationError] = useState<string | null>(null);

  const ai = useAiGeneration("research");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (topic.trim().length < 5) {
      setValidationError("Enter a research topic of at least 5 characters.");
      return;
    }
    setValidationError(null);
    void ai.run({ topic: topic.trim(), depth, audience, format });
  };

  return (
    <AppShell>
      <PageHeader
        icon={BookOpen}
        title="AI Research Assistant"
        description="Generate structured research assistance for professional decision-making."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="h-fit rounded-2xl border-border shadow-card">
          <CardContent className="p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="topic">Research Topic</Label>
                <Textarea
                  id="topic"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="State the topic and the specific questions the research should address."
                  className="min-h-40"
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? "topic-error" : undefined}
                  required
                />
                {validationError ? (
                  <p id="topic-error" role="alert" className="text-sm font-medium text-destructive">
                    {validationError}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="depth">Research Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger id="depth" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Quick", "Standard", "Detailed"].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger id="audience" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Personal", "Academic", "Professional"].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Summary", "Report", "Bullet points"].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={ai.isLoading}>
                {ai.isLoading ? "Generating response..." : "Generate Research"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div
            role="note"
            className="flex gap-3 rounded-xl border border-warning/40 bg-warning/12 p-4 text-sm leading-relaxed text-foreground"
          >
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground" aria-hidden="true" />
            <p>
              Research integrity notice: this assistant has no access to live web search or citation
              databases. Output is AI-generated research assistance based on general knowledge. Sources,
              citations, URLs and statistics are not provided and must be verified independently.
            </p>
          </div>

          <AiOutputPanel
            content={ai.output}
            onChange={ai.setOutput}
            isLoading={ai.isLoading}
            error={ai.error}
            onRegenerate={ai.canRegenerate ? ai.regenerate : undefined}
            onClear={ai.clear}
            onRefine={ai.applyRefinement}
            emptyStateMessage="Enter a research topic, choose the depth, audience and output format, then select Generate Research. Structured findings will appear here and remain fully editable."
          />
          <AiDisclaimer />
        </div>
      </div>
    </AppShell>
  );
}
