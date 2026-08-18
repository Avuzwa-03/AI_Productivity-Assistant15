import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiOutputPanel } from "@/components/ai-output-panel";
import { useAiGeneration } from "@/hooks/use-ai-generation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace" },
      {
        name: "description",
        content: "Convert raw meeting notes into structured summaries, decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn meeting notes into clear summaries and action items.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const ai = useAiGeneration("meeting");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (notes.trim().length < 20) {
      setValidationError("Enter at least 20 characters of meeting notes to summarize.");
      return;
    }
    setValidationError(null);
    void ai.run({ title: title.trim(), date, participants: participants.trim(), notes: notes.trim() });
  };

  return (
    <AppShell>
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Turn meeting notes into clear summaries, decisions, action items and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="h-fit rounded-2xl border-border shadow-card">
          <CardContent className="p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="meeting-title">Meeting Title</Label>
                <Input
                  id="meeting-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Quarterly planning review"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <Input
                  id="participants"
                  value={participants}
                  onChange={(event) => setParticipants(event.target.value)}
                  placeholder="Separate names with commas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Meeting Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Paste the raw meeting notes, transcript or bullet points recorded during the meeting."
                  className="min-h-56"
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? "notes-error" : undefined}
                  required
                />
                {validationError ? (
                  <p id="notes-error" role="alert" className="text-sm font-medium text-destructive">
                    {validationError}
                  </p>
                ) : null}
              </div>

              <Button type="submit" className="w-full" disabled={ai.isLoading}>
                {ai.isLoading ? "Generating response..." : "Summarize Meeting"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <AiOutputPanel
            content={ai.output}
            onChange={ai.setOutput}
            isLoading={ai.isLoading}
            error={ai.error}
            onRegenerate={ai.canRegenerate ? ai.regenerate : undefined}
            onClear={ai.clear}
            onRefine={ai.applyRefinement}
            emptyStateMessage="Add the meeting notes and select Summarize Meeting. The summary, key discussion points, decisions, action items, deadlines and follow-up questions will appear here and remain fully editable."
          />
          <AiDisclaimer />
        </div>
      </div>
    </AppShell>
  );
}
