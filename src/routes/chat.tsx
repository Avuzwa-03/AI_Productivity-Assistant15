import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Plus, BrainCircuit, TriangleAlert } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat | AI Workplace" },
      {
        name: "description",
        content: "Conversational workplace assistance for writing, planning, summarization and research.",
      },
      { property: "og:title", content: "AI Workplace Chat" },
      { property: "og:description", content: "Get workplace assistance through conversational AI." },
    ],
  }),
  component: ChatPage,
});

const suggestions = [
  "Draft a project status update for my manager.",
  "Summarize the priorities for a product launch week.",
  "Outline an agenda for a 30-minute client review.",
];

function ChatPage() {
  const [conversationId, setConversationId] = useState(() => `conversation-${Date.now()}`);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: conversationId,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    if (!text.trim() || isLoading) return;
    void sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <AppShell>
      <PageHeader
        icon={MessageSquare}
        title="AI Chat"
        description="Ask workplace questions and get precise, professional assistance."
      />

      <div className="flex h-[calc(100vh-16rem)] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-border gradient-surface px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Conversation</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setConversationId(`conversation-${Date.now()}`);
              setInput("");
            }}
          >
            <Plus className="size-4" aria-hidden="true" />
            New conversation
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6" aria-live="polite">
          <div className="flex gap-3">
            <span className="gradient-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
              <BrainCircuit className="size-4 text-primary-foreground" aria-hidden="true" />
            </span>
            <div className="max-w-[80ch] text-sm leading-relaxed text-foreground">
              Hello. I&apos;m your AI Workplace Assistant. How can I assist you?
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-2 pl-11">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submit(suggestion)}
                  className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          {messages.map((message) => {
            const text = message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join("");
            if (message.role === "user") {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                    {text}
                  </div>
                </div>
              );
            }
            return (
              <div key={message.id} className="flex gap-3">
                <span className="gradient-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <BrainCircuit className="size-4 text-primary-foreground" aria-hidden="true" />
                </span>
                <div className="markdown-body max-w-[80ch]">
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
              </div>
            );
          })}

          {status === "submitted" ? (
            <p className="pl-11 text-sm font-medium text-primary">Generating response...</p>
          ) : null}

          {error ? (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/8 p-4">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground">
                Unable to generate the response. Please try again.
              </p>
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(input);
          }}
          className="border-t border-border p-3 md:p-4"
        >
          <div className="flex items-end gap-2">
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <Textarea
              id="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Describe the workplace task you need assistance with."
              className="max-h-40 min-h-11 flex-1 resize-none"
            />
            <Button type="submit" size="icon" className="size-11" disabled={isLoading || !input.trim()} aria-label="Send message">
              <Send className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </form>
      </div>

      <AiDisclaimer className="mt-4" />
    </AppShell>
  );
}
