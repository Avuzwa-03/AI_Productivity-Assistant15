import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GenerateInput = z.object({
  feature: z.enum(["email", "meeting", "task", "research"]),
  input: z.record(z.string()),
});

const RefineInput = z.object({
  content: z.string().min(1),
  refinement: z.string().min(1),
});

async function runPrompt(prompt: string) {
  const { createLovableAiGatewayProvider, DEFAULT_MODEL } = await import("./ai-gateway.server");
  const { streamText } = await import("ai");

  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI service is not configured. Please contact the administrator.");

  const gateway = createLovableAiGatewayProvider(key);
  try {
    const result = streamText({ model: gateway(DEFAULT_MODEL), prompt });
    return { text: await result.text };
  } catch (error) {
    const status = (error as { statusCode?: number })?.statusCode;
    if (status === 429) {
      throw new Error("Request limit reached. Please wait a moment and try again.");
    }
    if (status === 402) {
      throw new Error("AI usage credits are exhausted. Please add credits to continue.");
    }
    if (status === 403) {
      throw new Error("AI access is currently restricted for this workspace.");
    }
    throw new Error("Unable to generate the response. Please try again.");
  }
}

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => GenerateInput.parse(data))
  .handler(async ({ data }) => {
    const prompts = await import("./prompts");
    const input = data.input as Record<string, string>;

    const prompt =
      data.feature === "email"
        ? prompts.emailPrompt(input as never)
        : data.feature === "meeting"
          ? prompts.meetingPrompt(input as never)
          : data.feature === "task"
            ? prompts.taskPrompt(input as never)
            : prompts.researchPrompt(input as never);

    return runPrompt(prompt);
  });

export const refineContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RefineInput.parse(data))
  .handler(async ({ data }) => {
    const { refinePrompt, REFINEMENTS } = await import("./prompts");
    const instruction = REFINEMENTS[data.refinement] ?? data.refinement;
    return runPrompt(refinePrompt(data.content, instruction));
  });
