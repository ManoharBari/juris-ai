import { documentReaderAgent } from "./documentReaderAgent";
import { clauseExtractionAgent } from "./clauseExtractionAgent";
import { riskScoringAgent } from "./riskScoringAgent";
import { bhashaTranslationAgent } from "./bhashaTranslationAgent";

export type Language = "en" | "hi" | "mr" | "ta" | "bn" | "te";

export interface OrchestratorInput {
  fileText: string; // raw text extracted from PDF/docx
  fileName: string;
  language: Language; // target language for Bhasha agent
  onProgress?: (step: string, percent: number) => void;
}

export interface OrchestratorOutput {
  documentSummary: string;
  clauses: ExtractedClause[];
  riskReport: RiskReport;
  bhashaOutput: BhashaOutput;
  powerImbalanceScore: number; // 0-100, higher = more against user
}

export interface ExtractedClause {
  id: string;
  title: string;
  originalText: string;
  category:
    | "termination"
    | "penalty"
    | "ip_assignment"
    | "liability"
    | "payment"
    | "notice"
    | "other";
}

export interface RiskedClause extends ExtractedClause {
  riskLevel: "high" | "medium" | "low";
  riskScore: number; // 0-10
  explanation: string;
  legalCitation: string;
  redlinedEdit: string;
  missingProtection?: string; // Silent Risk Engine
}

export interface RiskReport {
  overallScore: number;
  clauses: RiskedClause[];
  missingClauses: string[];
  executiveSummary: string;
}

export interface BhashaOutput {
  language: Language;
  summary: string; // plain language summary in chosen language
  clauseExplanations: {
    clauseId: string;
    explanation: string; // vernacular, simple language
  }[];
}

export async function runLegalAgentPipeline(
  input: OrchestratorInput,
): Promise<OrchestratorOutput> {
  const { fileText, fileName, language, onProgress } = input;

  // Step 1: Document Reader
  onProgress?.("Reading document...", 10);
  const documentSummary = await documentReaderAgent(fileText, fileName);

  // Step 2: Clause Extraction
  onProgress?.("Extracting clauses...", 30);
  const clauses = await clauseExtractionAgent(fileText);

  // Step 3: Risk Scoring
  onProgress?.("Scoring risk...", 55);
  const riskReport = await riskScoringAgent(clauses, fileText);

  // Step 4: Bhasha Translation
  onProgress?.("Translating to your language...", 80);
  const bhashaOutput = await bhashaTranslationAgent(riskReport, language);

  // Power imbalance score = average of top risky clauses
  const topRisks = riskReport.clauses.filter((c) => c.riskLevel === "high");
  const powerImbalanceScore =
    topRisks.length > 0
      ? Math.round(
          topRisks.reduce((a, b) => a + b.riskScore, 0) / topRisks.length,
        ) * 10
      : riskReport.overallScore;

  onProgress?.("Done!", 100);

  return {
    documentSummary,
    clauses,
    riskReport,
    bhashaOutput,
    powerImbalanceScore,
  };
}
