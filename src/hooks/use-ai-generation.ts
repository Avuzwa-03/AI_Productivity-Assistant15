import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateContent, refineContent } from "@/lib/ai.functions";

type Feature = "email" | "meeting" | "task" | "research";
type Status = "idle" | "loading" | "success" | "error";

export function useAiGeneration(feature: Feature) {
  const generate = useServerFn(generateContent);
  const refine = useServerFn(refineContent);

  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<Record<string, string> | null>(null);

  const run = useCallback(
    async (input: Record<string, string>) => {
      setLastInput(input);
      setStatus("loading");
      setError(null);
      try {
        const result = await generate({ data: { feature, input } });
        setOutput(result.text.trim());
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Unable to generate the response. Please try again.",
        );
      }
    },
    [feature, generate],
  );

  const regenerate = useCallback(async () => {
    if (lastInput) await run(lastInput);
  }, [lastInput, run]);

  const applyRefinement = useCallback(
    async (refinement: string) => {
      if (!output) return;
      setStatus("loading");
      setError(null);
      try {
        const result = await refine({ data: { content: output, refinement } });
        setOutput(result.text.trim());
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Unable to refine the response. Please try again.",
        );
      }
    },
    [output, refine],
  );

  const clear = useCallback(() => {
    setOutput("");
    setStatus("idle");
    setError(null);
  }, []);

  return {
    output,
    setOutput,
    status,
    error,
    isLoading: status === "loading",
    canRegenerate: Boolean(lastInput),
    run,
    regenerate,
    applyRefinement,
    clear,
  };
}
