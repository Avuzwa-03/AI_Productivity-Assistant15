import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle, Eye, Lock, UserCheck, ClipboardCheck } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AI_DISCLAIMER } from "@/components/ai-disclaimer";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | AI Workplace" },
      {
        name: "description",
        content:
          "Responsible AI practices, limitations and verification guidance for the AI Workplace Productivity Assistant.",
      },
      { property: "og:title", content: "Responsible AI Practices" },
      {
        property: "og:description",
        content: "How this assistant handles AI limitations, verification and confidentiality.",
      },
    ],
  }),
  component: ResponsibleAiPage,
});

const principles = [
  {
    icon: AlertTriangle,
    title: "AI can make mistakes",
    body: "Language models generate plausible text, not verified fact. Output may contain errors, omissions or outdated information.",
  },
  {
    icon: Eye,
    title: "Verify important information",
    body: "Independently confirm names, figures, dates, legal or financial details and any claim that informs a business decision.",
  },
  {
    icon: Lock,
    title: "Protect confidential information",
    body: "Do not enter confidential, sensitive or personal information unless appropriate safeguards and approvals are in place.",
  },
  {
    icon: UserCheck,
    title: "AI supports human decisions",
    body: "The assistant is designed to accelerate drafting and analysis. Accountability for the final decision remains with the user.",
  },
  {
    icon: ClipboardCheck,
    title: "Review before professional use",
    body: "Every output is editable. Review, edit and approve content before sending it to clients, colleagues or stakeholders.",
  },
  {
    icon: ShieldCheck,
    title: "No fabricated sources",
    body: "The research assistant has no access to live web search or citation databases and is instructed never to invent sources, citations, URLs or statistics.",
  },
];

function ResponsibleAiPage() {
  return (
    <AppShell>
      <PageHeader
        icon={ShieldCheck}
        title="Responsible AI"
        description="Limitations, verification guidance and responsible-use practices for this assistant."
      />

      <Card className="mb-8 rounded-2xl border-warning/40 bg-warning/10 shadow-card">
        <CardContent className="flex gap-4 p-6">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning-foreground" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-foreground">Important notice</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{AI_DISCLAIMER}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {principles.map((principle) => (
          <Card key={principle.title} className="rounded-2xl border-border shadow-card">
            <CardContent className="p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <principle.icon className="size-5 text-primary" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{principle.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 rounded-2xl border-border shadow-card">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold text-foreground">How this application applies responsible AI</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Every feature uses a structured prompt that prohibits fabricated facts, sources and statistics.</li>
            <li>All AI output is clearly labelled as AI-Generated Output and remains fully editable.</li>
            <li>The research workspace displays a permanent research integrity notice.</li>
            <li>Errors are surfaced precisely instead of being replaced by unverified AI content.</li>
            <li>API credentials are stored server-side and are never exposed to the browser.</li>
          </ul>
        </CardContent>
      </Card>
    </AppShell>
  );
}
