"use client";

import { useState, useEffect } from "react";
import AnalyzeNavbar from "@/components/AnalyzeNavbar";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import { AnalysisResult } from "@/lib/types/analysis";
import {
    History as HistoryIcon,
    Calendar,
    FileText,
    ChevronRight,
    Loader2,
    ArrowLeft,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { DBReport } from "@/lib/supabase";

export default function HistoryPage() {
    const [reports, setReports] = useState<DBReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
    const [selectedFileName, setSelectedFileName] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/history");
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch history");
            setReports(data.reports);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectReport = (report: DBReport) => {
        setSelectedAnalysis(report.analysis_result);
        setSelectedFileName(report.file_name);
    };

    const handleReset = () => {
        setSelectedAnalysis(null);
        setSelectedFileName("");
    };

    if (selectedAnalysis) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <AnalyzeNavbar />
                <div className="pt-20">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to History
                    </button>
                    <AnalysisDashboard
                        analysis={selectedAnalysis}
                        fileName={selectedFileName}
                        onReset={handleReset}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <AnalyzeNavbar />

            <main className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <HistoryIcon className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
                        <p className="text-gray-500">Access your past document reports and legal insights.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="text-indigo-500 animate-spin" size={40} />
                        <p className="text-gray-500 animate-pulse">Retrieving your analysis history...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                        <AlertCircle className="text-red-500 shrink-0" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-900">Failed to load history</h3>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                            <button
                                onClick={fetchHistory}
                                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            Analyze your first document to see it appear here in your history.
                        </p>
                        <a
                            href="/analyze"
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-95 inline-block"
                        >
                            Start New Analysis
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reports.map((report, idx) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleSelectReport(report)}
                                className="group cursor-pointer bg-white border border-gray-100 hover:border-indigo-200 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/5 flex items-center gap-5"
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${report.analysis_result.overallRiskScore >= 60 ? 'bg-red-50' :
                                        report.analysis_result.overallRiskScore >= 30 ? 'bg-orange-50' : 'bg-green-50'
                                    }`}>
                                    <FileText className={
                                        report.analysis_result.overallRiskScore >= 60 ? 'text-red-500' :
                                            report.analysis_result.overallRiskScore >= 30 ? 'text-orange-500' : 'text-green-500'
                                    } size={24} />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                        {report.file_name}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {format(new Date(report.created_at), "MMM d, yyyy • h:mm a")}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                            <span className="font-medium">
                                                Risk: {report.analysis_result.overallRiskScore}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${report.analysis_result.overallRiskScore >= 60 ? 'bg-red-100 text-red-700' :
                                            report.analysis_result.overallRiskScore >= 30 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {report.analysis_result.riskLevel}
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
