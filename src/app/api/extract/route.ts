import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import pdf from "@cedrugs/pdf-parse";

// ─── Next.js App Router config ────────────────────────────────────────────
export const maxDuration = 60; // seconds (enough for large PDFs)

// ─── Custom page renderer ────────────────────────────────────────────────
// Preserves newlines between lines (default renderer collapses them).
// pageData is the pdfjs page object exposed by @cedrugs/pdf-parse.
async function renderPage(pageData: any): Promise<string> {
  const renderOptions = {
    normalizeWhitespace: false,
    disableCombineTextItems: false,
  };

  const textContent = await pageData.getTextContent(renderOptions);
  let lastY: number | undefined;
  let text = "";

  for (const item of textContent.items) {
    // item.transform[5] is the Y coordinate
    if (lastY !== undefined && lastY !== item.transform[5]) {
      text += "\n";
    }
    text += item.str;
    lastY = item.transform[5];
  }

  return text;
}

// ─── PDF extraction ───────────────────────────────────────────────────────
async function extractPdfText(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer, {
    pagerender: renderPage, // use our line-preserving renderer
    max: 0, // parse all pages (0 = no limit)
  });

  return data.text ?? "";
}

// ─── Route handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  console.log("[Extract] Request received");

  // 1. Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    console.error("[Extract] formData parse error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid form data." },
      { status: 400 },
    );
  }

  // 2. Validate file presence
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided." },
      { status: 400 },
    );
  }

  console.log(`[Extract] "${file.name}" | ${file.type} | ${file.size} bytes`);

  // 3. Size cap — 20 MB
  const MAX_BYTES = 20 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: "File too large. Maximum allowed size is 20 MB.",
      },
      { status: 413 },
    );
  }

  // 4. Read into Buffer
  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch (err) {
    console.error("[Extract] Buffer read error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to read the uploaded file." },
      { status: 500 },
    );
  }

  const name = file.name.toLowerCase();
  const mime = file.type;
  let text = "";

  // ── PDF ────────────────────────────────────────────────────────────────
  if (mime === "application/pdf" || name.endsWith(".pdf")) {
    console.log("[Extract] Parsing PDF...");
    try {
      text = await extractPdfText(buffer);
      console.log(`[Extract] PDF done — ${text.length} chars`);
    } catch (err: any) {
      console.error("[Extract] PDF error:", err);
      const msg = (err?.message ?? "").toLowerCase();

      if (msg.includes("password") || msg.includes("encrypt")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This PDF is password-protected. Please remove the password and re-upload.",
          },
          { status: 422 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to parse the PDF. It may be corrupted or an image-only scan.",
        },
        { status: 422 },
      );
    }

    // ── DOCX ──────────────────────────────────────────────────────────────
  } else if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    console.log("[Extract] Parsing DOCX...");
    try {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value ?? "";
      if (result.messages.length > 0) {
        console.warn("[Extract] Mammoth warnings:", result.messages);
      }
      console.log(`[Extract] DOCX done — ${text.length} chars`);
    } catch (err) {
      console.error("[Extract] DOCX error:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse the DOCX file. It may be corrupted.",
        },
        { status: 422 },
      );
    }

    // ── TXT ───────────────────────────────────────────────────────────────
  } else if (mime === "text/plain" || name.endsWith(".txt")) {
    text = buffer.toString("utf-8");
    console.log(`[Extract] TXT done — ${text.length} chars`);

    // ── Unsupported ───────────────────────────────────────────────────────
  } else {
    console.warn(`[Extract] Unsupported: "${mime}" / "${name}"`);
    return NextResponse.json(
      {
        success: false,
        error: "Unsupported file type. Please upload a PDF, DOCX, or TXT.",
      },
      { status: 415 },
    );
  }

  // 5. Minimum content guard
  const trimmed = text.trim();
  if (trimmed.length < 50) {
    console.warn("[Extract] Text too short:", trimmed.length);
    return NextResponse.json(
      {
        success: false,
        error:
          "Not enough text could be extracted. The file may be an image scan or blank.",
      },
      { status: 422 },
    );
  }

  return NextResponse.json({ success: true, text: trimmed });
}
