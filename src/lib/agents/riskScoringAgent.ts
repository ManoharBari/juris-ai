// Agent 3: Scores each clause for risk, adds redlines and legal citations

import OpenAI from "openai";
import { ExtractedClause, RiskReport, RiskedClause } from "./orchestrator";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const INDIAN_LAW_CONTEXT = `
Relevant Indian Laws for reference:
- Indian Contract Act 1872: Section 23 (unlawful agreements), Section 27 (restraint of trade)
- Rent Control Acts: State-specific, protects tenants from arbitrary eviction
- Transfer of Property Act 1882: Governs lease agreements, notice periods
- IT Act 2000: Section 43A (data protection), Section 72A (privacy breach)
- IPC Section 415: Cheating and dishonest inducement
- Payment of Wages Act 1936: Protects against arbitrary wage deductions
- Industrial Disputes Act 1947: Protects against unfair termination
- Consumer Protection Act 2019: Unfair trade practices
- DPDP Act 2023: Digital Personal Data Protection
`;

const MISSING_CLAUSE_CHECKLIST = {
  rental: [
    "notice_period",
    "maintenance_responsibility",
    "security_deposit_return",
    "tds_on_rent",
    "subletting_rights",
  ],
  employment: [
    "notice_period",
    "severance_pay",
    "non_compete_scope",
    "ip_ownership_limits",
    "performance_review_process",
  ],
  loan: [
    "prepayment_penalty_cap",
    "interest_rate_change_notice",
    "collateral_release_conditions",
  ],
};

export async function riskScoringAgent(
  clauses: ExtractedClause[],
  fullText: string,
): Promise<RiskReport> {
  // Score all clauses in one batch call for efficiency
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a legal risk analyst specializing in Indian contracts, protecting the interests of common people (tenants, employees, borrowers).

${INDIAN_LAW_CONTEXT}

For each clause provided, return a risk assessment JSON with:
- clauseId: matching input id
- riskLevel: "high" | "medium" | "low"  
- riskScore: 1-10 (10 = most dangerous for the weaker party)
- explanation: why this is risky in simple terms
- legalCitation: specific Indian law/section this violates or relates to
- redlinedEdit: suggested replacement text that protects the user
- missingProtection: if this clause is missing a key protection, what should be added

Also return:
- overallScore: 0-100 risk score
- missingClauses: array of important clauses that are ABSENT from the contract (Silent Risk Engine)
- executiveSummary: 3-4 sentence plain English summary of the contract's risk level

Return ONLY valid JSON, no markdown.`,
      },
      {
        role: "user",
        content: `Analyze these clauses:\n${JSON.stringify(clauses, null, 2)}\n\nFull contract snippet for context:\n${fullText.slice(0, 4000)}`,
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content ?? "{}");

    // Merge risk data back into clauses
    const riskedClauses: RiskedClause[] = clauses.map((clause) => {
      const risk = (parsed.clauses ?? parsed.assessments ?? []).find(
        (r: any) => r.clauseId === clause.id,
      );
      return {
        ...clause,
        riskLevel: risk?.riskLevel ?? "low",
        riskScore: risk?.riskScore ?? 1,
        explanation: risk?.explanation ?? "No issues found",
        legalCitation: risk?.legalCitation ?? "N/A",
        redlinedEdit: risk?.redlinedEdit ?? clause.originalText,
        missingProtection: risk?.missingProtection,
      };
    });

    return {
      overallScore: parsed.overallScore ?? 50,
      clauses: riskedClauses,
      missingClauses: parsed.missingClauses ?? [],
      executiveSummary: parsed.executiveSummary ?? "Risk analysis complete.",
    };
  } catch {
    return {
      overallScore: 0,
      clauses: [],
      missingClauses: [],
      executiveSummary: "Failed to analyze risk.",
    };
  }
}
