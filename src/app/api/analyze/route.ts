import { NextRequest, NextResponse } from "next/server";
import { runLegalAgentPipeline, Language } from "@/lib/agents/orchestrator";

export const maxDuration = 120; // 2 min — enough for full pipeline

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const text = formData.get("text") as string | null;
    const fileName = formData.get("fileName") as string | null;
    const language = (formData.get("language") as Language | null) ?? "en";

    // ── Validation ──────────────────────────────────────────────────────
    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: "No document text provided." },
        { status: 400 },
      );
    }

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "fileName is required." },
        { status: 400 },
      );
    }

    const validLanguages: Language[] = ["en", "hi", "mr", "ta", "bn", "te"];
    const safeLanguage: Language = validLanguages.includes(language)
      ? language
      : "en";

    // ── Run pipeline ────────────────────────────────────────────────────
    console.log(
      `[Analyze] Starting pipeline — file: "${fileName}", lang: "${safeLanguage}", chars: ${text.length}`,
    );

    const result = await runLegalAgentPipeline({
      fileText: text.trim(),
      fileName,
      language: safeLanguage,
    });

    console.log(
      `[Analyze] Pipeline complete — clauses: ${result.riskReport.clauses.length}, score: ${result.riskReport.overallScore}`,
    );

    return NextResponse.json({ success: true, analysis: result });
  } catch (error: any) {
    console.error("[Analyze] Pipeline error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message ?? "Analysis failed. Please try again.",
      },
      { status: 500 },
    );
  }
}
