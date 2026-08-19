import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help | AI Workplace" },
      {
        name: "description",
        content: "Guidance on using each AI workspace effectively and getting higher quality output.",
      },
      { property: "og:title", content: "Help and Guidance" },
      { property: "og:description", content: "How to get precise results from each AI workspace." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    question: "How do I get higher quality output?",
    answer:
      "Provide specific context: the objective, the audience, relevant constraints and any facts that must appear. The assistant will not invent missing information, so the more precise your input, the more usable the output.",
  },
  {
    question: "Can I edit AI-generated content?",
    answer:
      "Yes. Every output panel includes Edit, Copy, Regenerate, Clear and Refine controls. Edited content is preserved when you apply a refinement.",
  },
  {
    question: "Does the research assistant provide sources?",
    answer:
      "No. The assistant has no access to live web search or citation databases and is explicitly instructed never to fabricate sources, citations, URLs or statistics. Verify all findings independently.",
  },
  {
    question: "Is my input stored?",
    answer:
      "Input is processed for the current session to generate a response and is not stored in a database by this application. Avoid entering confidential or personal information.",
  },
  {
    question: "What should I do if generation fails?",
    answer:
      "The output panel displays a precise error message and a Retry control. If the issue persists, shorten your input and try again.",
  },
];

const guides = [
  { title: "Smart Email", body: "Select purpose, recipient and tone, then describe the message content.", to: "/email" },
  { title: "Meeting Notes", body: "Paste raw notes; the assistant structures decisions, actions and deadlines.", to: "/meetings" },
  { title: "Task Planner", body: "State objectives, deadline and available time to receive a prioritised plan.", to: "/tasks" },
  { title: "Research Assistant", body: "Define the topic, depth, audience and output format.", to: "/research" },
  { title: "AI Chat", body: "Ask follow-up questions or request quick professional drafting support.", to: "/chat" },
] as const;

function HelpPage() {
  return (
    <AppShell>
      <PageHeader
        icon={LifeBuoy}
        title="Help"
        description="Guidance on using each workspace and improving output quality."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.to}
            to={guide.to}
            className="rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h2 className="text-base font-semibold text-foreground">{guide.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{guide.body}</p>
          </Link>
        ))}
      </div>

      <Card className="mt-8 rounded-2xl border-border shadow-card">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold text-foreground">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-2">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-left text-sm font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <AiDisclaimer className="mt-8" />
    </AppShell>
  );
}
