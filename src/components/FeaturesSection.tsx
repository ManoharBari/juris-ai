"use client";

import { motion } from "framer-motion";
import { ScanText, Shield, FileSearch, BarChart3, GitCompare, Zap } from "lucide-react";

const features = [
  {
    icon: ScanText,
    title: "OCR + Parsing",
    description: "Extract text and structure from any document format with 99.9% accuracy",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    stats: [
      { label: "Advanced text recognition" },
      { label: "Structure preservation" },
      { label: "Lightning-fast processing" },
    ],
  },
  {
    icon: Shield,
    title: "Clause Detection",
    description: "AI-powered identification of key contract clauses and legal terms",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    stats: [
      { label: "Smart analysis – Intelligent parsing of complex legal documents" },
      { label: "Instant results – Get clause identification in seconds" },
      { label: "Legal precision – Trained on extensive legal databases" },
      { label: "AI-Powered" },
    ],
  },
  {
    icon: FileSearch,
    title: "Summary & Risk Score",
    description: "Intelligent document summaries with automated risk assessment",
    color: "bg-green-50",
    iconColor: "text-green-500",
    stats: [
      { label: "Upload Document for Analysis" },
      { label: "Choose File → Analyze Document" },
    ],
  },
  {
    icon: BarChart3,
    title: "Indian Law Cross-Reference",
    description: "Automatically match clauses with IPC, IT Act, Rent Control Act, and more",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    stats: [
      { label: "IPC Section mapping" },
      { label: "Rent Control Act compliance" },
      { label: "IT Act 2000 checks" },
    ],
  },
  {
    icon: GitCompare,
    title: "Redline Suggestions",
    description: "AI-generated edit suggestions with legal citations for unfair terms",
    color: "bg-red-50",
    iconColor: "text-red-500",
    stats: [
      { label: "Track changes view" },
      { label: "Legal citations included" },
      { label: "One-click accept/reject" },
    ],
  },
  {
    icon: Zap,
    title: "Unfair Term Detection",
    description: "Flag unilateral termination clauses, hidden penalties, and IP traps",
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
    stats: [
      { label: "Unilateral termination flags" },
      { label: "Hidden penalty detection" },
      { label: "IP assignment alerts" },
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Powerful AI features for every team
          </h2>
          <p className="text-gray-500 max-w-lg">
            From OCR to advanced clause detection, our platform handles the complexity
            so you can focus on what matters.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-100 transition-all hover:-translate-y-0.5 bg-white"
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={22} className={f.iconColor} />
              </div>

              {/* Title & description */}
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{f.description}</p>

              {/* Mini stats / bullet list */}
              <ul className="space-y-2">
                {f.stats.map((s) => (
                  <li key={s.label} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {s.label}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
