// Custom hook to call the pipeline from any component

import { useState } from "react";
import { OrchestratorOutput, Language } from "@/lib/agents/orchestrator";
import {
  NegotiationResult,
  PartyArchetype,
} from "@/lib/agents/negotiationAgent";
import { RiskedClause } from "@/lib/agents/orchestrator";

export interface AgentState {
  loading: boolean;
  progress: number;
  progressMessage: string;
  result: OrchestratorOutput | null;
  error: string | null;
}

export function useLegalAgent() {
  const [state, setState] = useState<AgentState>({
    loading: false,
    progress: 0,
    progressMessage: "",
    result: null,
    error: null,
  });

  const [negotiationResult, setNegotiationResult] =
    useState<NegotiationResult | null>(null);
  const [negotiating, setNegotiating] = useState(false);

  async function analyzeDocument(file: File, language: Language = "en") {
    setState({
      loading: true,
      progress: 5,
      progressMessage: "Uploading...",
      result: null,
      error: null,
    });

    try {
      // Simulate progress steps since we can't stream from API route easily
      const progressSteps = [
        { msg: "Reading document...", pct: 15 },
        { msg: "Extracting clauses...", pct: 35 },
        { msg: "Scoring risk against Indian laws...", pct: 60 },
        { msg: "Translating to your language...", pct: 80 },
        { msg: "Finalizing report...", pct: 95 },
      ];

      let stepIndex = 0;
      const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          const step = progressSteps[stepIndex];
          setState((prev) => ({
            ...prev,
            progress: step.pct,
            progressMessage: step.msg,
          }));
          stepIndex++;
        }
      }, 3000); // advance every 3 seconds

      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Analysis failed");
      }

      const data: OrchestratorOutput = await response.json();
      setState({
        loading: false,
        progress: 100,
        progressMessage: "Done!",
        result: data,
        error: null,
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message ?? "Something went wrong",
      }));
    }
  }

  async function simulateNegotiation(
    clause: RiskedClause,
    archetype: PartyArchetype,
  ) {
    setNegotiating(true);
    setNegotiationResult(null);
    try {
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clause, archetype }),
      });
      const data: NegotiationResult = await response.json();
      setNegotiationResult(data);
    } catch (err: any) {
      console.error("Negotiation error:", err);
    } finally {
      setNegotiating(false);
    }
  }

  function reset() {
    setState({
      loading: false,
      progress: 0,
      progressMessage: "",
      result: null,
      error: null,
    });
    setNegotiationResult(null);
  }

  return {
    state,
    analyzeDocument,
    simulateNegotiation,
    negotiating,
    negotiationResult,
    reset,
  };
}
