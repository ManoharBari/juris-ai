// Agent 1: Reads the raw document and returns a structured summary

const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function documentReaderAgent(
  fileText: string,
  fileName: string,
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a legal document reader specializing in Indian contracts and agreements.
        Your job is to read a contract and return a brief structural summary.
        Include: document type, parties involved, key dates, duration, and overall purpose.
        Be concise - 3-5 sentences max. Do NOT analyze risk yet.`,
      },
      {
        role: "user",
        content: `File name: ${fileName}\n\nDocument text:\n${fileText.slice(0, 8000)}`,
      },
    ],
    temperature: 0.2,
  });

  return response.choices[0].message.content ?? "Could not read document.";
}
