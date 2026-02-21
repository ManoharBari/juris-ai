// Agent 4: Translates risk findings into vernacular languages with farmer-friendly language

const OpenAI = require("openai");
import { BhashaOutput, Language, RiskReport } from "./orchestrator";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ta: "Tamil",
  bn: "Bengali",
  te: "Telugu",
};

const TONE_INSTRUCTIONS = `
Use simple, conversational language like you are explaining to a farmer or daily wage worker.
Avoid legal jargon completely. Use analogies from daily life (farming, market, family).
Be direct about danger. Say "आपको नुकसान हो सकता है" not "this may be prejudicial to your interests".
Keep each explanation to 2-3 sentences max.
`;

export async function bhashaTranslationAgent(
  riskReport: RiskReport,
  language: Language,
): Promise<BhashaOutput> {
  if (language === "en") {
    // English already done by risk agent, just reformat
    return {
      language: "en",
      summary: riskReport.executiveSummary,
      clauseExplanations: riskReport.clauses
        .filter((c) => c.riskLevel !== "low")
        .map((c) => ({
          clauseId: c.id,
          explanation: c.explanation,
        })),
    };
  }

  const languageName = LANGUAGE_NAMES[language];

  // Only translate high/medium risk clauses to save tokens
  const importantClauses = riskReport.clauses.filter(
    (c) => c.riskLevel === "high" || c.riskLevel === "medium",
  );

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a legal translator helping common Indian people understand contract risks.
Translate the following legal analysis into ${languageName}.
${TONE_INSTRUCTIONS}

Return JSON with:
- summary: overall risk summary in ${languageName} (3 sentences, simple language)
- clauseExplanations: array of {clauseId, explanation} in ${languageName}

Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Overall summary to translate: "${riskReport.executiveSummary}"

Clauses to translate:
${importantClauses.map((c) => `ID: ${c.id} | Risk: ${c.riskLevel} | Explanation: ${c.explanation}`).join("\n")}`,
      },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content ?? "{}");
    return {
      language,
      summary: parsed.summary ?? riskReport.executiveSummary,
      clauseExplanations: parsed.clauseExplanations ?? [],
    };
  } catch {
    return {
      language,
      summary: riskReport.executiveSummary,
      clauseExplanations: [],
    };
  }
}
