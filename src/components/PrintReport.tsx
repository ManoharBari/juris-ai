import { AnalysisResult } from "@/app/analyze/page";

type Props = {
  analysis: AnalysisResult;
  fileName: string;
};

const RISK_HEX = {
  LOW: "#16a34a",
  MEDIUM: "#ca8a04",
  HIGH: "#ea580c",
  CRITICAL: "#dc2626",
};

const RISK_BG = {
  LOW: "#f0fdf4",
  MEDIUM: "#fefce8",
  HIGH: "#fff7ed",
  CRITICAL: "#fef2f2",
};

const COMPLIANCE_COLOR = {
  COMPLIANT: "#16a34a",
  NON_COMPLIANT: "#dc2626",
  REVIEW_NEEDED: "#ca8a04",
  "N/A": "#6b7280",
};

const COMPLIANCE_LABEL = {
  COMPLIANT: "✓ Compliant",
  NON_COMPLIANT: "✗ Non-Compliant",
  REVIEW_NEEDED: "⚠ Review Needed",
  "N/A": "N/A",
};

export default function PrintReport({ analysis, fileName }: Props) {
  const generated = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div id="print-report" className="print-only">
      {/* ── Cover / Header ──────────────────────────────────────────── */}
      <div className="report-header">
        <div className="report-brand">
          <span className="report-brand-dot" />
          <span className="report-brand-name">Juris AI</span>
        </div>
        <div className="report-meta">
          <h1 className="report-title">Contract Analysis Report</h1>
          <p className="report-subtitle">{analysis.documentType}</p>
          <div className="report-meta-row">
            <span>File: {fileName || "—"}</span>
            <span className="report-meta-sep">·</span>
            <span>Generated: {generated}</span>
            <span className="report-meta-sep">·</span>
            <span
              className="report-risk-pill"
              style={{
                background: RISK_BG[analysis.riskLevel],
                color: RISK_HEX[analysis.riskLevel],
              }}
            >
              {analysis.riskLevel} RISK · {analysis.overallRiskScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* ── Key Stats ───────────────────────────────────────────────── */}
      <div className="report-stats">
        {[
          { label: "Total Clauses", value: analysis.keyStats.totalClauses },
          { label: "Risky Clauses", value: analysis.keyStats.riskyClauseCount },
          { label: "Unfair Terms", value: analysis.keyStats.unfairTermCount },
        ].map((s) => (
          <div className="report-stat-card" key={s.label}>
            <div className="report-stat-value">{s.value}</div>
            <div className="report-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Executive Summary ────────────────────────────────────────── */}
      <div className="report-section">
        <h2 className="report-section-title">Executive Summary</h2>
        <p className="report-body">{analysis.executiveSummary}</p>
      </div>

      {/* ── Clause Analysis ──────────────────────────────────────────── */}
      <div className="report-section report-page-break">
        <h2 className="report-section-title">Clause-by-Clause Analysis</h2>
        {analysis.clauses.map((clause, i) => (
          <div className="report-clause" key={clause.id}>
            {/* Clause header */}
            <div className="report-clause-header">
              <span className="report-clause-num">{i + 1}</span>
              <div className="report-clause-heading">
                <span className="report-clause-title">{clause.title}</span>
                <span className="report-clause-cat">{clause.category}</span>
              </div>
              <div className="report-clause-badges">
                <span
                  className="report-badge"
                  style={{
                    background: RISK_BG[clause.riskLevel],
                    color: RISK_HEX[clause.riskLevel],
                  }}
                >
                  {clause.riskLevel}
                </span>
                {clause.isUnfair && (
                  <span
                    className="report-badge"
                    style={{ background: "#fef2f2", color: "#dc2626" }}
                  >
                    Unfair
                  </span>
                )}
                <span className="report-risk-score">
                  Risk: {clause.riskScore}/100
                </span>
              </div>
            </div>

            {/* Risk bar */}
            <div className="report-risk-bar-track">
              <div
                className="report-risk-bar-fill"
                style={{
                  width: `${clause.riskScore}%`,
                  background: RISK_HEX[clause.riskLevel],
                }}
              />
            </div>

            {/* Clause text */}
            <p className="report-clause-text">&ldquo;{clause.text}&rdquo;</p>

            {/* Unfair reason */}
            {clause.isUnfair && clause.unfairReason && (
              <div
                className="report-callout"
                style={{ borderColor: "#fca5a5", background: "#fef2f2" }}
              >
                <p
                  className="report-callout-label"
                  style={{ color: "#dc2626" }}
                >
                  ⚠ Why this clause is unfair
                </p>
                <p className="report-callout-body" style={{ color: "#7f1d1d" }}>
                  {clause.unfairReason}
                </p>
              </div>
            )}

            {/* Indian law reference */}
            {clause.indianLawReference.act && (
              <div
                className="report-callout"
                style={{
                  borderColor:
                    clause.indianLawReference.compliance === "NON_COMPLIANT"
                      ? "#fca5a5"
                      : clause.indianLawReference.compliance === "COMPLIANT"
                        ? "#86efac"
                        : "#fde68a",
                  background:
                    clause.indianLawReference.compliance === "NON_COMPLIANT"
                      ? "#fef2f2"
                      : clause.indianLawReference.compliance === "COMPLIANT"
                        ? "#f0fdf4"
                        : "#fefce8",
                }}
              >
                <p
                  className="report-callout-label"
                  style={{
                    color:
                      COMPLIANCE_COLOR[clause.indianLawReference.compliance],
                  }}
                >
                  ⚖ Indian Law Reference ·{" "}
                  {COMPLIANCE_LABEL[clause.indianLawReference.compliance]}
                </p>
                <p className="report-callout-body" style={{ fontWeight: 600 }}>
                  {clause.indianLawReference.act}
                </p>
                {clause.indianLawReference.section && (
                  <p
                    className="report-callout-body"
                    style={{ color: "#374151" }}
                  >
                    {clause.indianLawReference.section}
                  </p>
                )}
                {clause.indianLawReference.note && (
                  <p
                    className="report-callout-body"
                    style={{ color: "#6b7280", marginTop: 4 }}
                  >
                    {clause.indianLawReference.note}
                  </p>
                )}
              </div>
            )}

            {/* Redline suggestion */}
            {clause.redlineSuggestion && (
              <div
                className="report-callout"
                style={{ borderColor: "#93c5fd", background: "#eff6ff" }}
              >
                <p
                  className="report-callout-label"
                  style={{ color: "#1d4ed8" }}
                >
                  ✎ Suggested Redline
                </p>
                <p className="report-callout-body" style={{ color: "#1e3a8a" }}>
                  {clause.redlineSuggestion}
                </p>
                {clause.legalCitation && (
                  <p
                    className="report-callout-body"
                    style={{
                      color: "#3b82f6",
                      fontStyle: "italic",
                      marginTop: 4,
                    }}
                  >
                    Citation: {clause.legalCitation}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Unfair Terms ─────────────────────────────────────────────── */}
      {analysis.unfairTerms.length > 0 && (
        <div className="report-section report-page-break">
          <h2 className="report-section-title">Unfair Terms Detected</h2>
          {analysis.unfairTerms.map((term, i) => (
            <div className="report-unfair" key={i}>
              <div className="report-unfair-header">
                <span className="report-unfair-title">{term.type}</span>
                <span
                  className="report-badge"
                  style={{
                    background:
                      term.severity === "HIGH"
                        ? "#fef2f2"
                        : term.severity === "MEDIUM"
                          ? "#fff7ed"
                          : "#fefce8",
                    color:
                      term.severity === "HIGH"
                        ? "#dc2626"
                        : term.severity === "MEDIUM"
                          ? "#ea580c"
                          : "#ca8a04",
                  }}
                >
                  {term.severity} SEVERITY
                </span>
              </div>
              <p className="report-body">{term.description}</p>
              <p className="report-small">Found in: {term.clauseRef}</p>
              {term.indianLawViolation && (
                <p className="report-small" style={{ color: "#dc2626" }}>
                  Violates: {term.indianLawViolation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Indian Law Compliance ─────────────────────────────────────── */}
      <div className="report-section report-page-break">
        <h2 className="report-section-title">Indian Law Compliance</h2>
        {analysis.indianLawCompliance.map((law, i) => (
          <div className="report-law" key={i}>
            <div className="report-law-header">
              <span className="report-law-name">{law.act}</span>
              <span
                className="report-badge"
                style={{
                  background:
                    RISK_BG[
                      law.status === "COMPLIANT"
                        ? "LOW"
                        : law.status === "NON_COMPLIANT"
                          ? "CRITICAL"
                          : "MEDIUM"
                    ],
                  color: COMPLIANCE_COLOR[law.status],
                }}
              >
                {COMPLIANCE_LABEL[law.status]}
              </span>
            </div>
            <p className="report-body">{law.notes}</p>
            {law.relevantSections.length > 0 && (
              <p className="report-small">
                Sections: {law.relevantSections.join(" · ")}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Recommendations ──────────────────────────────────────────── */}
      <div className="report-section">
        <h2 className="report-section-title">Recommendations</h2>
        <ol className="report-recommendations">
          {analysis.recommendations.map((rec, i) => (
            <li key={i} className="report-rec-item">
              <span className="report-rec-num">{i + 1}</span>
              <p className="report-rec-text">{rec}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="report-footer">
        <span>Juris AI · AI-Powered Contract Analysis Platform</span>
        <span>
          This report is for informational purposes only and does not constitute
          legal advice.
        </span>
      </div>
    </div>
  );
}
