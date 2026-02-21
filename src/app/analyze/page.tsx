"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "./useDropzone";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import AnalyzeNavbar from "@/components/AnalyzeNavbar";
import {
  Upload,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Shield,
  FileSearch,
  FlaskConical,
  Languages,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Language, OrchestratorOutput } from "@/lib/agents/orchestrator";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi (हिंदी)" },
  { value: "mr", label: "Marathi (मराठी)" },
  { value: "ta", label: "Tamil (தமிழ்)" },
  { value: "bn", label: "Bengali (বাংলা)" },
  { value: "te", label: "Telugu (తెలుగు)" },
];

// Matches the real pipeline steps — shown to user while requests run
const PROGRESS_STEPS = [
  { label: "Extracting document text...", pct: 12 },
  { label: "Reading document structure...", pct: 26 },
  { label: "Extracting clauses...", pct: 42 },
  { label: "Scoring risk against Indian laws...", pct: 62 },
  { label: "Translating to your language...", pct: 80 },
  { label: "Building report...", pct: 93 },
];

type Step = "upload" | "analyzing" | "results";

export default function AnalyzePage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<OrchestratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

  const handleFile = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile);
      setError(null);
      setStep("analyzing");
      setProgress(5);
      setProgressLabel("Starting...");

      // Animate through progress steps while waiting for API
      let stepIdx = 0;
      const timer = setInterval(() => {
        if (stepIdx < PROGRESS_STEPS.length) {
          const s = PROGRESS_STEPS[stepIdx++];
          setProgress(s.pct);
          setProgressLabel(s.label);
        }
      }, 2600);

      const done = () => clearInterval(timer);

      try {
        // ── Step 1: Extract text from file ──────────────────────────────
        setProgressLabel("Extracting document text...");
        setProgress(10);

        const extractForm = new FormData();
        extractForm.append("file", selectedFile);

        const extractRes = await fetch("/api/extract", {
          method: "POST",
          body: extractForm,
        });
        const extractData = await extractRes.json();

        if (!extractRes.ok || !extractData.success) {
          throw new Error(
            extractData.error ?? "Failed to extract text from document.",
          );
        }

        // ── Step 2: Run multi-agent analysis ─────────────────────────────
        setProgress(38);
        setProgressLabel("Analyzing clauses with AI...");

        const analyzeForm = new FormData();
        analyzeForm.append("text", extractData.text);
        analyzeForm.append("fileName", selectedFile.name);
        analyzeForm.append("language", selectedLanguage);

        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          body: analyzeForm,
        });
        const analyzeData = await analyzeRes.json();

        if (!analyzeRes.ok || !analyzeData.success) {
          throw new Error(analyzeData.error ?? "AI analysis failed.");
        }

        // ── Done ─────────────────────────────────────────────────────────
        done();
        setProgress(100);
        setProgressLabel("Done!");

        await new Promise((r) => setTimeout(r, 500));

        // analyzeData.analysis is OrchestratorOutput
        setAnalysis(analyzeData.analysis as OrchestratorOutput);
        setStep("results");
        toast.success("Analysis complete!");
      } catch (err) {
        done();
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
        setStep("upload");
        toast.error(msg);
      }
    },
    [selectedLanguage],
  );

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
    setProgressLabel("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AnalyzeNavbar />

      <AnimatePresence mode="wait">
        {/* ── UPLOAD ──────────────────────────────────────────────────── */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pt-24 pb-16"
          >
            <div className="max-w-3xl mx-auto px-6">
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
                <p className="text-gray-500 max-w-lg mx-auto">
                  Get instant clause-by-clause insights, risk scores, and Indian
                  law compliance — in your language.
                </p>
              </div>

              {/* Language selector */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Languages size={18} className="text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Analysis Language
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Risk summaries and clause explanations will be in this
                  language.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setSelectedLanguage(lang.value)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        selectedLanguage === lang.value
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                          : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <div
                {...getRootProps()}
                className={`group relative bg-white border-2 border-dashed rounded-[2rem] p-12 transition-all cursor-pointer ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50/30"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-gray-50 group-hover:bg-blue-50 group-hover:scale-110 flex items-center justify-center transition-all duration-500">
                    <Upload
                      size={32}
                      className="text-gray-400 group-hover:text-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {isDragActive
                        ? "Drop your contract here"
                        : "Select your document"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Drag &amp; drop a PDF, DOCX, or TXT file — or click to
                      browse
                    </p>
                    <p className="text-xs text-gray-400">Maximum 20 MB</p>
                  </div>
                </div>
              </div>

              {/* Feature pills */}
              <div className="mt-10 grid grid-cols-3 gap-6">
                {[
                  {
                    icon: FileSearch,
                    label: "Clause Extraction",
                    color: "text-blue-500",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: Shield,
                    label: "Risk Scoring",
                    color: "text-orange-500",
                    bg: "bg-orange-50",
                  },
                  {
                    icon: FlaskConical,
                    label: "Law Compliance",
                    color: "text-green-500",
                    bg: "bg-green-50",
                  },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className="text-center">
                    <div
                      className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon size={20} className={color} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Error banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4"
                >
                  <AlertCircle
                    size={20}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm text-red-700 font-semibold">
                      Something went wrong
                    </p>
                    <p className="text-sm text-red-600 mt-0.5">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── ANALYZING ───────────────────────────────────────────────── */}
        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 min-h-screen flex items-center justify-center"
          >
            <div className="text-center max-w-sm px-6 w-full">
              <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Analyzing Document
              </h2>
              <p className="text-gray-400 text-sm mb-8 truncate max-w-xs mx-auto">
                {file?.name ?? "document"}
              </p>

              {/* Progress bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-blue-600 text-sm font-semibold text-left">
                    {progressLabel}
                  </p>
                  <p className="text-gray-400 text-xs tabular-nums">
                    {progress}%
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>

              <p className="mt-8 text-xs text-gray-400 leading-relaxed">
                Extracting clauses &bull; Scoring risks &bull; Checking Indian
                legal framework &bull; Translating
              </p>
            </div>
          </motion.div>
        )}

        {/* ── RESULTS ─────────────────────────────────────────────────── */}
        {step === "results" && analysis && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnalysisDashboard
              analysis={analysis}
              fileName={file?.name ?? "document.pdf"}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
