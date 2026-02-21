import { NextRequest, NextResponse } from "next/server";
import { runLegalAgentPipeline, Language } from "@/lib/agents/orchestrator";
import { AnalysisResult } from "@/lib/types/analysis";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    const fileName = formData.get("fileName") as string | null;
    const language = (formData.get("language") as Language | null) ?? "en";

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ success: false, error: "No document text provided." }, { status: 400 });
    }

    if (!fileName) {
      return NextResponse.json({ success: false, error: "fileName is required." }, { status: 400 });
    }

    const validLanguages: Language[] = ["en", "hi", "mr", "ta", "bn", "te"];
    const safeLanguage: Language = validLanguages.includes(language) ? language : "en";

    console.log(`[Analyze] Starting pipeline — file: "${fileName}", lang: "${safeLanguage}"`);

    const result = await runLegalAgentPipeline({
      fileText: text.trim(),
      fileName,
      language: safeLanguage,
    });

    // Map orchestrator output to shared AnalysisResult schema
    const mappedAnalysis: AnalysisResult = {
      documentType: result.documentSummary.split("\n")[0].replace(/^#+\s*/, "").replace(/Analysis|Summary|Report/g, "").trim() || "Legal Document",
      overallRiskScore: result.powerImbalanceScore,
      riskLevel: mapRiskLevel(result.powerImbalanceScore),
      executiveSummary: safeLanguage !== "en" && result.bhashaOutput?.summary
        ? `${result.bhashaOutput.summary}\n\n(Original: ${result.riskReport.executiveSummary})`
        : result.riskReport.executiveSummary,
      keyStats: {
        totalClauses: result.clauses.length,
        riskyClauseCount: result.riskReport.clauses.filter(c => c.riskLevel === "high" || c.riskLevel === "medium").length,
        unfairTermCount: result.riskReport.clauses.filter(c => c.riskLevel === "high").length,
        lawViolationCount: result.riskReport.clauses.filter(c => c.legalCitation && c.legalCitation !== "N/A" && c.legalCitation !== "TBD").length,
      },
      clauses: result.riskReport.clauses.map(clause => {
        const bhashaExplanation = result.bhashaOutput?.clauseExplanations?.find(e => e.clauseId === clause.id);

        return {
          id: clause.id,
          title: clause.title,
          text: clause.originalText,
          riskScore: clause.riskScore * 10,
          riskLevel: mapRiskLevel(clause.riskScore * 10),
          category: clause.category,
          isUnfair: clause.riskLevel === "high",
          unfairReason: bhashaExplanation && safeLanguage !== "en"
            ? `${bhashaExplanation.explanation} (Risk: ${clause.explanation})`
            : clause.explanation,
          indianLawReference: {
            act: extractAct(clause.legalCitation),
            section: extractSection(clause.legalCitation),
            compliance: (clause.riskLevel === "high" ? "NON_COMPLIANT" : clause.riskLevel === "medium" ? "REVIEW_NEEDED" : "COMPLIANT") as any,
            note: clause.explanation,
          },
          redlineSuggestion: clause.redlinedEdit,
          legalCitation: clause.legalCitation,
        };
      }),
      unfairTerms: result.riskReport.clauses
        .filter(c => c.riskLevel === "high")
        .map(c => ({
          type: c.category,
          severity: "HIGH" as const,
          description: c.explanation,
          clauseRef: c.title,
          indianLawViolation: c.legalCitation,
        })),
      indianLawCompliance: Array.from(new Set(result.riskReport.clauses
        .filter(c => c.legalCitation && c.legalCitation !== "N/A" && c.legalCitation !== "TBD")
        .map(c => extractAct(c.legalCitation))))
        .map(actName => ({
          act: actName || "Indian Legal Framework",
          relevantSections: result.riskReport.clauses
            .filter(c => extractAct(c.legalCitation) === actName)
            .map(c => extractSection(c.legalCitation))
            .filter((s): s is string => s !== null),
          status: "REVIEW_NEEDED" as const,
          notes: "Derived from automated risk analysis and Indian law context.",
        })),
      recommendations: [
        ...result.riskReport.clauses
          .filter(c => c.riskLevel === "high")
          .map(c => `Urgent Fix: ${c.title}`),
        ...result.riskReport.missingClauses.map(m => `Missing: Consider adding ${m} protections.`)
      ],
    };

    return NextResponse.json({ success: true, analysis: mappedAnalysis });
  } catch (error: any) {
    console.error("[Analyze] Pipeline error:", error);
    return NextResponse.json({ success: false, error: error?.message ?? "Analysis failed." }, { status: 500 });
  }
}

function extractAct(citation: string): string | null {
  if (!citation || citation === "N/A" || citation === "TBD") return null;
  const actMatch = citation.match(/^(.*? Act \d{4})/);
  if (actMatch) return actMatch[1];
  return citation.split(":")[0].trim();
}

function extractSection(citation: string): string | null {
  if (!citation || citation === "N/A" || citation === "TBD") return null;
  const sectionMatch = citation.match(/Section \d+[A-Z]?/i);
  return sectionMatch ? sectionMatch[0] : null;
}

function mapRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}
