"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types/analysis";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Scale,
  Shield,
  GitCompare,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PrintReport from "@/components/PrintReport";

type Props = {
  analysis: AnalysisResult;
  fileName: string;
  onReset: () => void;
};

const RISK_COLORS = {
  LOW: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-400",
    bar: "bg-green-500",
  },
  MEDIUM: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-400",
    bar: "bg-yellow-500",
  },
  HIGH: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-400",
    bar: "bg-orange-500",
  },
  CRITICAL: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
};

const COMPLIANCE_COLORS = {
  COMPLIANT: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle },
  NON_COMPLIANT: { bg: "bg-red-50", text: "text-red-700", icon: XCircle },
  REVIEW_NEEDED: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: AlertCircle,
  },
  "N/A": { bg: "bg-gray-50", text: "text-gray-500", icon: AlertCircle },
};

function RiskBadge({
  level,
}: {
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}) {
  const c = RISK_COLORS[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {level}
    </span>
  );
}

function ScoreCircle({
  score,
  level,
}: {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}) {
  const c = RISK_COLORS[level];
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={
            level === "LOW"
              ? "#22c55e"
              : level === "MEDIUM"
                ? "#eab308"
                : level === "HIGH"
                  ? "#f97316"
                  : "#ef4444"
          }
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-gray-900">{score}</div>
        <div className={`text-[10px] font-semibold ${c.text}`}>{level}</div>
      </div>
    </div>
  );
}

function ClauseCard({ clause }: { clause: AnalysisResult["clauses"][0] }) {
  const [expanded, setExpanded] = useState(false);
  const c = RISK_COLORS[clause.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl overflow-hidden ${c.border} ${clause.isUnfair ? "ring-1 ring-red-300" : ""}`}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Risk bar */}
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <div className={`w-1 h-16 rounded-full ${c.bar} opacity-60`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-gray-900 text-sm">
              {clause.title}
            </span>
            <RiskBadge level={clause.riskLevel} />
            {clause.isUnfair && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                <AlertTriangle size={10} />
                Unfair
              </span>
            )}
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {clause.category}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{clause.text}</p>

          {/* Score bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${c.bar}`}
                style={{ width: `${clause.riskScore}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">
              Risk: {clause.riskScore}/100
            </span>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-gray-100 space-y-4">
              {/* Full text */}
              {clause.text && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Clause Text
                  </p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {clause.text}
                  </p>
                </div>
              )}

              {/* Unfair reason */}
              {clause.isUnfair && clause.unfairReason && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1.5">
                    <AlertTriangle size={12} />
                    Why this clause is unfair
                  </p>
                  <p className="text-sm text-red-700">{clause.unfairReason}</p>
                </div>
              )}

              {/* Indian law reference */}
              {clause.indianLawReference.act && (
                <div
                  className={`border rounded-lg p-3 ${clause.indianLawReference.compliance === "NON_COMPLIANT"
                      ? "bg-red-50 border-red-100"
                      : clause.indianLawReference.compliance === "COMPLIANT"
                        ? "bg-green-50 border-green-100"
                        : "bg-yellow-50 border-yellow-100"
                    }`}
                >
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Scale size={12} />
                    Indian Law Reference
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {clause.indianLawReference.act}
                  </p>
                  {clause.indianLawReference.section && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {clause.indianLawReference.section}
                    </p>
                  )}
                  {clause.indianLawReference.note && (
                    <p className="text-sm text-gray-600 mt-1.5">
                      {clause.indianLawReference.note}
                    </p>
                  )}
                  <div className="mt-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COMPLIANCE_COLORS[clause.indianLawReference.compliance]
                          .bg
                        } ${COMPLIANCE_COLORS[clause.indianLawReference.compliance].text}`}
                    >
                      {clause.indianLawReference.compliance.replace("_", " ")}
                    </span>
                  </div>
                </div>
              )}

              {/* Redline suggestion */}
              {clause.redlineSuggestion && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1.5 flex items-center gap-1.5">
                    <GitCompare size={12} />
                    Suggested Edit (Redline)
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {clause.redlineSuggestion}
                  </p>
                  {clause.legalCitation && (
                    <p className="text-xs text-blue-600 mt-2 italic">
                      Citation: {clause.legalCitation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type Tab = "overview" | "clauses" | "unfair" | "laws" | "recommendations";

export default function AnalysisDashboard({
  analysis,
  fileName,
  onReset,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ElementType;
    count?: number;
  }[] = [
      { id: "overview", label: "Overview", icon: Sparkles },
      {
        id: "clauses",
        label: "Clauses",
        icon: FileText,
        count: analysis.clauses.length,
      },
      {
        id: "unfair",
        label: "Unfair Terms",
        icon: AlertTriangle,
        count: analysis.unfairTerms.length,
      },
      {
        id: "laws",
        label: "Indian Laws",
        icon: Scale,
        count: analysis.indianLawCompliance.length,
      },
      {
        id: "recommendations",
        label: "Recommendations",
        icon: Shield,
        count: analysis.recommendations.length,
      },
    ];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between py-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <FileText size={14} />
              <span className="truncate max-w-xs">{fileName}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {analysis.documentType}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full text-sm h-9 gap-2"
              onClick={() => window.print()}
            >
              <Download size={14} />
              Export
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="rounded-full text-sm h-9 gap-2"
            >
              <RotateCcw size={14} />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 z-40 bg-gray-50 py-2 -mx-6 px-6">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id
                        ? "bg-gray-100 text-gray-600"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Risk Score + Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {/* Score circle */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center">
                      <ScoreCircle
                        score={analysis.overallRiskScore}
                        level={analysis.riskLevel}
                      />
                      <p className="text-sm text-gray-500 mt-3">
                        Overall Risk Score
                      </p>
                    </div>

                    {/* Stats */}
                    {[
                      {
                        label: "Total Clauses",
                        value: analysis.keyStats.totalClauses,
                        icon: FileText,
                        color: "text-blue-500",
                        bg: "bg-blue-50",
                      },
                      {
                        label: "Risky Clauses",
                        value: analysis.keyStats.riskyClauseCount,
                        icon: AlertTriangle,
                        color: "text-orange-500",
                        bg: "bg-orange-50",
                      },
                      {
                        label: "Unfair Terms",
                        value: analysis.keyStats.unfairTermCount,
                        icon: XCircle,
                        color: "text-red-500",
                        bg: "bg-red-50",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white rounded-2xl border border-gray-100 p-5"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
                        >
                          <stat.icon size={20} className={stat.color} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-0.5">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Executive Summary */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Sparkles size={16} className="text-blue-500" />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Executive Summary
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Plain English
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {analysis.executiveSummary}
                    </p>
                  </div>

                  {/* Quick unfair terms preview */}
                  {analysis.unfairTerms.length > 0 && (
                    <div className="bg-white rounded-2xl border border-red-100 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <AlertTriangle size={16} className="text-red-500" />
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          Unfair Terms Detected
                        </h3>
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          {analysis.unfairTerms.length} found
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.unfairTerms.slice(0, 4).map((term, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${term.severity === "HIGH"
                                  ? "bg-red-500"
                                  : term.severity === "MEDIUM"
                                    ? "bg-orange-400"
                                    : "bg-yellow-400"
                                }`}
                            />
                            <div>
                              <p className="text-sm font-semibold text-red-800">
                                {term.type}
                              </p>
                              <p className="text-xs text-red-600 mt-0.5">
                                {term.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "clauses" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="font-semibold text-gray-900">
                      {analysis.clauses.length} Clauses Identified
                    </h3>
                    <span className="text-sm text-gray-400">
                      Click any clause to expand details, redline suggestions &
                      law references
                    </span>
                  </div>
                  {analysis.clauses.map((clause) => (
                    <ClauseCard key={clause.id} clause={clause} />
                  ))}
                </div>
              )}

              {activeTab === "unfair" && (
                <div className="space-y-5">
                  <h3 className="font-semibold text-gray-900 mb-5">
                    {analysis.unfairTerms.length === 0
                      ? "No unfair terms detected"
                      : `${analysis.unfairTerms.length} Unfair Terms Detected`}
                  </h3>
                  {analysis.unfairTerms.map((term, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border border-red-100 rounded-2xl p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${term.severity === "HIGH"
                              ? "bg-red-50"
                              : term.severity === "MEDIUM"
                                ? "bg-orange-50"
                                : "bg-yellow-50"
                            }`}
                        >
                          <AlertTriangle
                            size={20}
                            className={
                              term.severity === "HIGH"
                                ? "text-red-500"
                                : term.severity === "MEDIUM"
                                  ? "text-orange-500"
                                  : "text-yellow-500"
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-gray-900">
                              {term.type}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${term.severity === "HIGH"
                                  ? "bg-red-50 text-red-700"
                                  : term.severity === "MEDIUM"
                                    ? "bg-orange-50 text-orange-700"
                                    : "bg-yellow-50 text-yellow-700"
                                }`}
                            >
                              {term.severity} SEVERITY
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {term.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              Found in: {term.clauseRef}
                            </span>
                            {term.indianLawViolation && (
                              <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                                Violates: {term.indianLawViolation}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "laws" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-5">
                    Indian Law Compliance Analysis
                  </h3>
                  {analysis.indianLawCompliance.map((law, i) => {
                    const statusConfig = COMPLIANCE_COLORS[law.status];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white border border-gray-100 rounded-2xl p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}
                          >
                            <statusConfig.icon
                              size={20}
                              className={statusConfig.text}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-semibold text-gray-900">
                                {law.act}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                              >
                                {law.status.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {law.notes}
                            </p>
                            {law.relevantSections.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {law.relevantSections.map((s) => (
                                  <span
                                    key={s}
                                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-mono"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {activeTab === "recommendations" && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-5">
                    {analysis.recommendations.length} Recommendations
                  </h3>
                  {analysis.recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {rec}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Print-only report — hidden on screen, shown on window.print() */}
      <PrintReport analysis={analysis} fileName={fileName} />
    </div>
  );
}
