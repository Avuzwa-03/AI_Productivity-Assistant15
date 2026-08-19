# AI Workplace Productivity Assistant

An AI-assisted productivity platform that helps professionals complete routine workplace tasks
faster: drafting emails, summarizing meetings, planning work, conducting structured research and
asking workplace questions through a conversational assistant.

## Project Overview

**What it is.** A single web workspace that brings five AI tools together under one professional
interface and one shared prompt framework.

**The problem it solves.** Professionals lose significant time to repetitive written work: composing
routine emails, writing meeting minutes, restructuring task lists and gathering background on
unfamiliar topics. These tasks are necessary but low leverage.

**Who it is for.** Managers, consultants, analysts, coordinators, recruiters, students entering the
workplace and any professional who writes, plans and reports as part of daily work.

## Features

- **Smart Email Generator** — Generates a subject line and email body from a defined purpose,
  recipient type, tone and context. Supports refinement (more professional, shorter, friendlier,
  more persuasive).
- **Meeting Notes Summarizer** — Converts raw meeting notes into a structured record: summary, key
  discussion points, decisions, action items, deadlines and follow-up questions.
- **AI Task Planner** — Turns objectives into a prioritised task list with priority level, estimated
  time, suggested deadline and reason for prioritisation. Tasks can be added, edited, completed and
  deleted.
- **AI Research Assistant** — Produces structured research assistance (overview, key findings,
  concepts, advantages, challenges, applications, further questions) with an explicit research
  integrity notice.
- **AI Chatbot** — A conversational workplace assistant for writing, brainstorming, organisation,
  summarization and research planning, with streaming responses.

All major outputs are labelled **AI-Generated Output** and support Edit, Copy, Regenerate, Clear and
Refine.

## Tools Used

- Lovable (development platform)
- React 19 and TypeScript
- TanStack Start and TanStack Router
- Tailwind CSS v4 with a semantic design token system
- shadcn/ui and Radix UI primitives
- Lucide icons
- Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`)
- Lovable AI Gateway (Google Gemini model)
- react-markdown, Sonner
- Vite
- GitHub

## Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/<your-account>/AI-Productivity-Assistant.git
cd AI-Productivity-Assistant

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Create a .env file in the project root:
#      LOVABLE_API_KEY=your_server_side_api_key
#    Never commit .env or any API key to the repository.

# 4. Start the development server
npm run dev

# 5. Open the application
#    http://localhost:8080
```

Production build:

```bash
npm run build
npm run preview
```

The API key is read only on the server (inside server functions and the `/api/chat` route) and is
never exposed to the browser.

## Prompt Engineering

Every AI feature uses a structured prompt defined in `src/lib/prompts.ts` with five explicit parts:

1. **Role** — what the assistant is acting as.
2. **Task** — precisely what must be produced.
3. **Context** — the user-supplied inputs.
4. **Requirements** — tone, length, audience, accuracy limits and anti-fabrication rules.
5. **Output Format** — the exact structure the response must follow.

Shared constraints prohibit invented facts, sources, statistics and URLs, require concise
professional language and require uncertainty to be stated explicitly.

## Responsible AI

- A persistent disclaimer appears across the application and on a dedicated Responsible AI page:
  AI-generated content may contain errors, omissions or outdated information. Review and verify
  important information before relying on or sharing AI-generated content. Do not enter confidential,
  sensitive or personal information unless appropriate safeguards are in place.
- The research workspace displays a permanent research integrity notice stating that the assistant
  has no access to live web search or citation databases.
- Prompts explicitly forbid fabricating sources, citations, URLs, statistics and publications.
- All output is editable so a human reviews and approves content before professional use.
- Failures surface precise error messages instead of unverified AI content.
- Credentials are stored server-side only.

## Accessibility and Responsiveness

Semantic HTML, labelled form controls, ARIA attributes on live regions and icon-only controls,
visible focus states, keyboard navigation, and priority communicated by text as well as colour. The
layout adapts from desktop (fixed sidebar) to mobile (collapsible navigation, single-column forms).

## Team Members

Team Members:

- [Add name(s)]
