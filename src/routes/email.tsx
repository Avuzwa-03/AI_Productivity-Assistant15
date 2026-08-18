import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace" },
      {
        name: "description",
        content: "Generate professional workplace emails with a defined purpose, recipient and tone.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft precise, professional emails in seconds with structured AI prompts.",
      },
    ],
  }),
  component: EmailPage,
});

const purposes = [
  "Client communication",
  "Follow-up",
  "Meeting request",
  "Job application",
  "Complaint",
  "Thank you",
  "Internal communication",
  "Other",
];

const recipients = ["Client", "Manager", "Colleague", "Recruiter", "Business partner", "Other"];
const tones = ["Professional", "Friendly", "Formal", "Concise", "Persuasive"];

function EmailPage() {
  const [purpose, setPurpose] = useState("Client communication");
  const [recipient, setRecipient] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [context, setContext] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const ai = useAiGeneration("email");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (context.trim().length < 10) {
      setValidationError("Enter at least 10 characters describing what the email should communicate.");
      return;
    }
    setValidationError(null);
    void ai.run({ purpose, recipient, tone, context: context.trim() });
  };

  return (
    <AppShell>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Create professional emails with a defined purpose, recipient and tone."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="h-fit rounded-2xl border-border shadow-card">
          <CardContent className="p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="purpose">Email Purpose</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger id="purpose" className="w-full">
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {purposes.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Type</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                  <SelectTrigger id="recipient" className="w-full">
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone" className="w-full">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Additional Context</Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(event) => setContext(event.target.value)}
                  placeholder="Describe what you want the email to communicate."
                  className="min-h-40"
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? "context-error" : undefined}
                  required
                />
                {validationError ? (
                  <p id="context-error" role="alert" className="text-sm font-medium text-destructive">
                    {validationError}
                  </p>
                ) : null}
              </div>

              <Button type="submit" className="w-full" disabled={ai.isLoading}>
                {ai.isLoading ? "Generating response..." : "Generate Email"}
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
            refinements={[
              { key: "professional", label: "Make more professional" },
              { key: "shorter", label: "Make shorter" },
              { key: "friendlier", label: "Make friendlier" },
              { key: "persuasive", label: "Make more persuasive" },
            ]}
            emptyStateMessage="Select a purpose, recipient and tone, describe what the email should communicate, then select Generate Email. The subject line and email body will appear here and remain fully editable."
          />
          <AiDisclaimer />
        </div>
      </div>
    </AppShell>
  );
}
