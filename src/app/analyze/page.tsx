"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "./useDropzone";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import AnalyzeNavbar from "@/components/AnalyzeNavbar";
import {
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Shield,
  FileSearch,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// MOCK DATA — replace with real API response when ready
// ---------------------------------------------------------------------------
const MOCK_ANALYSIS: AnalysisResult = {
  documentType: "Employment Agreement",
  overallRiskScore: 72,
  riskLevel: "HIGH",
  executiveSummary:
    "This employment agreement contains several high-risk clauses that heavily favour the employer. Key concerns include an overbroad non-compete clause (24 months, nationwide), an IP assignment clause that captures work done outside office hours, and a unilateral termination clause with no notice period. The agreement also lacks statutory leave entitlements mandated by the Shops & Establishments Act. Immediate legal review is recommended before signing.",
  keyStats: {
    totalClauses: 8,
    riskyClauseCount: 5,
    unfairTermCount: 3,
    lawViolationCount: 2,
  },
  clauses: [
    {
      id: "c1",
      title: "Non-Compete Restriction",
      text: "The Employee shall not, for a period of 24 months following termination, directly or indirectly engage in any business activity that competes with the Employer anywhere within the territory of India.",
      riskScore: 88,
      riskLevel: "CRITICAL",
      category: "Post-Employment",
      isUnfair: true,
      unfairReason:
        "A 24-month nationwide non-compete is disproportionate and likely unenforceable under the Indian Contract Act. Courts routinely strike down restrictions that prevent employees from earning a livelihood.",
      indianLawReference: {
        act: "Indian Contract Act, 1872",
        section: "Section 27 — Agreement in Restraint of Trade",
        compliance: "NON_COMPLIANT",
        note: "Section 27 renders agreements in restraint of trade void unless they fall within statutory exceptions. Broad post-employment non-competes do not qualify.",
      },
      redlineSuggestion:
        "Replace with: 'The Employee shall not solicit the Employer's clients or employees for 6 months following termination within the specific city of employment.'",
      legalCitation:
        "Percept D'Mark (India) Pvt. Ltd. v. Zaheer Khan, 2006 AIR (SC)",
    },
    {
      id: "c2",
      title: "Intellectual Property Assignment",
      text: "All inventions, discoveries, and works of authorship conceived or reduced to practice by the Employee, whether during or outside business hours and whether or not using Employer's resources, shall be the exclusive property of the Employer.",
      riskScore: 79,
      riskLevel: "HIGH",
      category: "Intellectual Property",
      isUnfair: true,
      unfairReason:
        "Capturing IP created outside business hours and without employer resources is overly broad and may conflict with the Copyright Act's author's moral rights.",
      indianLawReference: {
        act: "Copyright Act, 1957",
        section: "Section 17 — First Owner of Copyright",
        compliance: "REVIEW_NEEDED",
        note: "The Act grants copyright to employers only for works made during the course of employment. Works created independently may not automatically vest in the employer.",
      },
      redlineSuggestion:
        "Limit assignment to inventions created during working hours or using Employer's equipment, facilities, or confidential information.",
      legalCitation: "Section 17, Copyright Act, 1957",
    },
    {
      id: "c3",
      title: "Immediate Termination Without Notice",
      text: "The Employer reserves the right to terminate this agreement immediately and without prior notice or payment in lieu thereof, at its sole discretion.",
      riskScore: 85,
      riskLevel: "CRITICAL",
      category: "Termination",
      isUnfair: true,
      unfairReason:
        "Unilateral termination without notice or compensation is contrary to the Industrial Disputes Act and may expose the employer to wrongful termination claims.",
      indianLawReference: {
        act: "Industrial Disputes Act, 1947",
        section: "Section 25F — Conditions Precedent to Retrenchment",
        compliance: "NON_COMPLIANT",
        note: "Retrenchment requires one month's notice or pay in lieu, and retrenchment compensation where applicable.",
      },
      redlineSuggestion:
        "Add: 'Either party may terminate this Agreement by providing 30 days' written notice or payment of 30 days' salary in lieu thereof.'",
      legalCitation: "Section 25F, Industrial Disputes Act, 1947",
    },
    {
      id: "c4",
      title: "Confidentiality Obligation",
      text: "The Employee shall maintain strict confidentiality regarding all trade secrets, client data, and proprietary business information of the Employer during and after employment.",
      riskScore: 35,
      riskLevel: "LOW",
      category: "Confidentiality",
      isUnfair: false,
      unfairReason: null,
      indianLawReference: {
        act: "Information Technology Act, 2000",
        section: "Section 43A — Compensation for Failure to Protect Data",
        compliance: "COMPLIANT",
        note: "Standard confidentiality obligations are permissible and enforceable in India.",
      },
      redlineSuggestion: null,
      legalCitation: null,
    },
    {
      id: "c5",
      title: "Annual Leave Entitlement",
      text: "The Employee shall be entitled to 10 days of paid annual leave per calendar year.",
      riskScore: 62,
      riskLevel: "MEDIUM",
      category: "Leave & Benefits",
      isUnfair: false,
      unfairReason: null,
      indianLawReference: {
        act: "Shops & Commercial Establishments Act (State-specific)",
        section: "Varies by State — Minimum Earned Leave",
        compliance: "REVIEW_NEEDED",
        note: "Many state acts mandate a minimum of 1 day's leave for every 20 days worked (≈15 days for a full year). 10 days may fall below the statutory minimum in several states.",
      },
      redlineSuggestion:
        "Increase to at least 15 days' earned leave to comply with most state-level establishments acts.",
      legalCitation:
        "Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017 — Section 18",
    },
    {
      id: "c6",
      title: "Governing Law & Jurisdiction",
      text: "This Agreement shall be governed by the laws of India and disputes shall be subject to the exclusive jurisdiction of courts in Mumbai.",
      riskScore: 20,
      riskLevel: "LOW",
      category: "Dispute Resolution",
      isUnfair: false,
      unfairReason: null,
      indianLawReference: {
        act: "Code of Civil Procedure, 1908",
        section: "Section 20 — Place of Suing",
        compliance: "COMPLIANT",
        note: "Exclusive jurisdiction clauses are generally upheld where both parties have some connection to the chosen forum.",
      },
      redlineSuggestion: null,
      legalCitation: null,
    },
    {
      id: "c7",
      title: "Salary & Deductions",
      text: "The Employer may deduct amounts from the Employee's salary for any losses, damages, or shortfalls attributable to the Employee, as determined solely by the Employer.",
      riskScore: 74,
      riskLevel: "HIGH",
      category: "Compensation",
      isUnfair: false,
      unfairReason: null,
      indianLawReference: {
        act: "Payment of Wages Act, 1936",
        section: "Section 7 — Deductions from Wages",
        compliance: "NON_COMPLIANT",
        note: "The Act restricts permissible deductions to specific categories (fines, absence, damage/loss) and requires prior written notice and opportunity to be heard.",
      },
      redlineSuggestion:
        "Replace with: 'Deductions shall only be made as permitted under the Payment of Wages Act, 1936, following a written notice and opportunity to respond.'",
      legalCitation: "Section 7, Payment of Wages Act, 1936",
    },
    {
      id: "c8",
      title: "Probation Period",
      text: "The Employee shall serve a probation period of 6 months, during which either party may terminate the employment by giving 7 days' written notice.",
      riskScore: 30,
      riskLevel: "LOW",
      category: "Employment Terms",
      isUnfair: false,
      unfairReason: null,
      indianLawReference: {
        act: "Industrial Disputes Act, 1947",
        section: "Section 2(oo) — Retrenchment Exclusions",
        compliance: "COMPLIANT",
        note: "Probationary termination with notice is generally permissible and commonly recognised by Indian courts.",
      },
      redlineSuggestion: null,
      legalCitation: null,
    },
  ],
  unfairTerms: [
    {
      type: "Overbroad Non-Compete",
      severity: "HIGH",
      description:
        "24-month nationwide non-compete is disproportionate and almost certainly void under Section 27 of the Indian Contract Act.",
      clauseRef: "Non-Compete Restriction",
      indianLawViolation: "Indian Contract Act, 1872 — Section 27",
    },
    {
      type: "Unbounded IP Assignment",
      severity: "MEDIUM",
      description:
        "Capturing IP created outside working hours without employer resources goes beyond the statutory employer–employee IP rule.",
      clauseRef: "Intellectual Property Assignment",
      indianLawViolation: "Copyright Act, 1957 — Section 17",
    },
    {
      type: "No-Notice Termination",
      severity: "HIGH",
      description:
        "Employer can terminate immediately without notice or compensation, violating mandatory protections under the Industrial Disputes Act.",
      clauseRef: "Immediate Termination Without Notice",
      indianLawViolation: "Industrial Disputes Act, 1947 — Section 25F",
    },
  ],
  indianLawCompliance: [
    {
      act: "Indian Contract Act, 1872",
      relevantSections: ["Section 27"],
      status: "NON_COMPLIANT",
      notes:
        "The non-compete clause is void under Section 27. Courts have consistently refused to enforce post-employment restraints that prevent employees from finding alternative employment.",
    },
    {
      act: "Industrial Disputes Act, 1947",
      relevantSections: ["Section 25F", "Section 25G"],
      status: "NON_COMPLIANT",
      notes:
        "The termination-without-notice clause violates mandatory retrenchment conditions, including notice period and retrenchment compensation requirements.",
    },
    {
      act: "Payment of Wages Act, 1936",
      relevantSections: ["Section 7", "Section 8"],
      status: "REVIEW_NEEDED",
      notes:
        "The unilateral salary deduction clause may exceed permissible deductions. Employer must follow prescribed procedure before making deductions for alleged losses.",
    },
    {
      act: "Copyright Act, 1957",
      relevantSections: ["Section 17"],
      status: "REVIEW_NEEDED",
      notes:
        "IP assignment clause captures work created outside scope of employment. Parties should clarify the boundaries of the assignment to avoid future disputes.",
    },
    {
      act: "Shops & Commercial Establishments Act",
      relevantSections: ["State-specific leave provisions"],
      status: "REVIEW_NEEDED",
      notes:
        "Annual leave of 10 days may be below the statutory minimum in several states. Verify against the applicable state act.",
    },
  ],
  recommendations: [
    "Narrow the non-compete clause to a maximum of 6 months, limited to the employee's specific city of work, and restrict it to non-solicitation of clients rather than a blanket employment ban.",
    "Amend the IP assignment clause to cover only inventions created during working hours or using company resources, consistent with Section 17 of the Copyright Act.",
    "Include a mandatory 30-day notice period (or equivalent pay in lieu) for employer-initiated terminations to comply with the Industrial Disputes Act.",
    "Add a schedule of permissible salary deductions linked to the Payment of Wages Act, 1936, and include a dispute process before any deduction is made.",
    "Verify the applicable state Shops & Establishments Act and update annual leave entitlement to at least 15 earned-leave days per year.",
    "Include a formal grievance redressal mechanism as recommended under the Industrial Employment (Standing Orders) Act, 1946.",
    "Have the finalised agreement reviewed by a qualified Indian employment lawyer before execution.",
  ],
};

export type AnalysisResult = {
  documentType: string;
  overallRiskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  executiveSummary: string;
  keyStats: {
    totalClauses: number;
    riskyClauseCount: number;
    unfairTermCount: number;
    lawViolationCount: number;
  };
  clauses: {
    id: string;
    title: string;
    text: string;
    riskScore: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    category: string;
    isUnfair: boolean;
    unfairReason: string | null;
    indianLawReference: {
      act: string | null;
      section: string | null;
      compliance: "COMPLIANT" | "NON_COMPLIANT" | "REVIEW_NEEDED" | "N/A";
      note: string | null;
    };
    redlineSuggestion: string | null;
    legalCitation: string | null;
  }[];
  unfairTerms: {
    type: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    description: string;
    clauseRef: string;
    indianLawViolation: string | null;
  }[];
  indianLawCompliance: {
    act: string;
    relevantSections: string[];
    status: "COMPLIANT" | "NON_COMPLIANT" | "REVIEW_NEEDED";
    notes: string;
  }[];
  recommendations: string[];
};

type Step = "upload" | "analyzing" | "results";

export default function AnalyzePage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const handleFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStep("analyzing");
    setProgress(0);

    try {
      // Step 1: Extract text
      setProgressLabel("Extracting document text...");
      setProgress(15);

      const extractFormData = new FormData();
      extractFormData.append("file", selectedFile);

      const extractRes = await fetch("/api/extract", {
        method: "POST",
        body: extractFormData,
      });

      const extractData = await extractRes.json();

      if (!extractRes.ok || !extractData.success) {
        throw new Error(
          extractData.error || "Failed to extract text from document",
        );
      }

      setProgress(40);
      setProgressLabel("Analyzing clauses with AI...");

      // Step 2: Analyze with AI
      const analyzeFormData = new FormData();
      analyzeFormData.append("text", extractData.text);
      analyzeFormData.append("fileName", selectedFile.name);

      setProgress(55);

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        body: analyzeFormData,
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok || !analyzeData.success) {
        throw new Error(analyzeData.error || "AI analysis failed");
      }

      setProgress(85);
      setProgressLabel("Building report...");

      await new Promise((r) => setTimeout(r, 600));
      setProgress(100);

      setAnalysis(analyzeData.analysis);
      setStep("results");
      toast.success("Analysis complete!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setStep("upload");
      toast.error(message);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) => {
      if (files[0]) handleFile(files[0]);
    },
    accept: [".pdf", ".docx", ".txt"],
  });

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setAnalysis(null);
    setError(null);
    setProgress(0);
  };

  // ── Mock / demo flow ──────────────────────────────────────────────────────
  const handleMock = useCallback(async () => {
    setError(null);
    setStep("analyzing");
    setProgress(0);
    setProgressLabel("Loading demo document...");

    // Simulate progress
    await new Promise((r) => setTimeout(r, 400));
    setProgress(30);
    setProgressLabel("Extracting clauses...");
    await new Promise((r) => setTimeout(r, 400));
    setProgress(60);
    setProgressLabel("Analysing with AI...");
    await new Promise((r) => setTimeout(r, 400));
    setProgress(90);
    setProgressLabel("Building report...");
    await new Promise((r) => setTimeout(r, 300));
    setProgress(100);

    setAnalysis(MOCK_ANALYSIS);
    setStep("results");
    toast.success("Demo analysis loaded!");
  }, []);

  return (
    <div className="bg-gray-50">
      <AnalyzeNavbar />

      {step === "upload" && (
        <div className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-6">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Home
            </Link>

            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-4">
                <Sparkles size={14} />
                AI-Powered Analysis
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Upload &amp; Analyze Contract
              </h1>
              <p className="text-gray-500">
                Upload any contract or agreement for instant AI analysis with
                Indian law cross-referencing
              </p>
            </div>

            {/* Upload Card */}
            <div className="bg-gradient-to-b from-[#3B9EF5] to-[#5BBFFA] rounded-3xl p-1.5 shadow-2xl shadow-blue-200">
              {/* Header bar */}
              <div className="bg-[#3B9EF5] rounded-t-2xl px-6 py-3 text-center">
                <span className="text-white font-semibold text-sm tracking-wider uppercase">
                  Upload &amp; Organise Document
                </span>
              </div>

              {/* Drop zone */}
              <div className="bg-white rounded-b-2xl m-px mt-0">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl m-4 p-16 text-center cursor-pointer transition-all ${isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-blue-200 hover:border-blue-400 hover:bg-blue-50/30"
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragActive ? "bg-blue-100" : "bg-blue-50"
                        }`}
                    >
                      <Upload size={28} className="text-[#3B9EF5]" />
                    </div>
                  </div>
                  {isDragActive ? (
                    <p className="text-blue-600 font-semibold text-lg">
                      Drop your document here
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-800 font-semibold text-lg mb-1">
                        Drop your documents here
                      </p>
                      <p className="text-gray-400 text-sm mb-6">
                        PDF, DOCX, TXT up to 50MB
                      </p>
                      <button className="bg-[#3B9EF5] hover:bg-[#2B8EE5] text-white rounded-full px-8 py-2.5 text-sm font-medium transition-colors">
                        Browse Files
                      </button>
                    </>
                  )}
                </div>

                {/* Features row */}
                <div className="px-6 pb-5 grid grid-cols-3 gap-4">
                  {[
                    {
                      icon: FileText,
                      label: "Clause Extraction",
                      color: "text-blue-500",
                    },
                    {
                      icon: Shield,
                      label: "Risk Scoring",
                      color: "text-orange-500",
                    },
                    {
                      icon: FileSearch,
                      label: "Indian Law Check",
                      color: "text-green-500",
                    },
                  ].map(({ icon: Icon, label, color }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1.5 text-sm text-gray-500"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                        <Icon size={16} className={color} />
                      </div>
                      <span className="text-xs text-center">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                <AlertCircle
                  size={18}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Try demo */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 mb-3">
                No document handy? Try the interactive demo
              </p>
              <button
                onClick={handleMock}
                className="inline-flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-5 py-2.5 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
              >
                <FlaskConical size={15} />
                Try Demo Analysis
              </button>
            </div>

            {/* Info */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Your documents are processed securely and never stored permanently
            </p>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-sm px-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <Loader2 size={36} className="text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analyzing Document
            </h2>
            <p className="text-gray-500 text-sm mb-6">{file?.name}</p>
            <p className="text-blue-600 text-sm font-medium mb-4">
              {progressLabel}
            </p>

            {/* Progress bar */}
            <div className="bg-gray-100 rounded-full h-2 mb-3">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">{progress}% complete</p>

            <div className="mt-8 text-xs text-gray-400 space-y-1">
              <p>
                Extracting clauses &bull; Scoring risks &bull; Checking Indian
                laws
              </p>
            </div>
          </div>
        </div>
      )}

      {step === "results" && analysis && (
        <AnalysisDashboard
          analysis={analysis}
          fileName={file?.name || ""}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
