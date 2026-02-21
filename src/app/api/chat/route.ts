import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a helpful customer support assistant for Juris AI — an AI-powered legal document analysis platform built for Indian law.

You help users understand:
- What Juris AI does (analyzes contracts, NDAs, employment agreements, lease deeds, and other legal documents)
- Supported file types: PDF and DOCX
- Key features: AI clause extraction, risk scoring (Low/Medium/High), plain-language summaries, Indian law compliance checks
- Pricing: Starter (free, 5 docs/month), Professional (paid, unlimited), Enterprise (custom)
- Security: TLS 1.3 encryption in transit, AES-256 at rest, documents never used for training
- Indian laws covered: Indian Contract Act 1872, DPDP Act, Companies Act 2013, sector-specific regulations
- Accuracy: 94%+ clause identification accuracy
- API access available on Enterprise plan
- Free trial: 14 days on paid plans, no credit card needed for Starter

Keep answers concise, friendly, and accurate. If you don't know something specific, suggest the user contact support@juris.ai.
Do not make up features or pricing that aren't listed above.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
    max_tokens: 400,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
