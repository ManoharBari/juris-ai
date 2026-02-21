// Agent 2: Extracts individual clauses from the document

import OpenAI from "openai";
import { ExtractedClause } from "./orchestrator";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function clauseExtractionAgent(
  fileText: string,
): Promise<ExtractedClause[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a legal clause extraction agent for Indian contracts.
Extract ALL individual clauses from the document.
Return a JSON array. Each clause must have:
- id: unique string like "clause_1"
- title: short name of the clause
- originalText: the exact clause text
- category: one of termination | penalty | ip_assignment | liability | payment | notice | other

Return ONLY valid JSON array, no markdown, no explanation.`,
      },
      {
        role: "user",
        content: `Extract all clauses from this contract:\n\n${fileText.slice(0, 12000)}`,
      },
    ],
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content ?? "{}");
    // GPT sometimes wraps in a key
    const clauses = parsed.clauses ?? parsed.data ?? parsed ?? [];
    return Array.isArray(clauses) ? clauses : [];
  } catch {
    return [];
  }
}
