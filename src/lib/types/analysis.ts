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
        indianLawViolation?: string;
    }[];
    indianLawCompliance: {
        act: string;
        relevantSections: string[];
        status: "COMPLIANT" | "NON_COMPLIANT" | "REVIEW_NEEDED";
        notes: string;
    }[];
    recommendations: string[];
};
