// Main API endpoint - runs the full agent pipeline

import { NextRequest, NextResponse } from "next/server";
import { runLegalAgentPipeline, Language } from "@/lib/agents/orchestrator";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const maxDuration = 120; // 2 min timeout for Vercel

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const language = (formData.get("language") as Language) ?? "en";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Extract text based on file type
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let fileText = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const pdfData = await pdfParse(fileBuffer);
      fileText = pdfData.text;
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      fileText = result.value;
    } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      fileText = fileBuffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, DOCX, or TXT." },
        { status: 400 },
      );
    }

    if (!fileText || fileText.trim().length < 100) {
      return NextResponse.json(
        { error: "Could not extract text from file. Is it a scanned image?" },
        { status: 400 },
      );
    }

    const result = await runLegalAgentPipeline({
      fileText,
      fileName: file.name,
      language,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Agent pipeline error:", error);
    return NextResponse.json(
      { error: error.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
