"use client";

import { motion } from "framer-motion";
import {
  ScanText,
  Shield,
  FileSearch,
  BarChart3,
  GitCompare,
  Zap,
  ArrowUpRight
} from "lucide-react";

const features = [
  {
    icon: ScanText,
    title: "Document Parsing",
    description: "Extract text and structure from any document format with 99.9% accuracy.",
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
    borderColor: "hover:border-blue-200/50",
    stats: ["Advanced text recognition", "Structure preservation", "Fast processing"],
  },
  {
    icon: Shield,
    title: "Clause Detection",
    description: "AI-powered identification of key contract clauses and legal terms instantly.",
    color: "from-purple-500/10 to-purple-600/5",
    iconColor: "text-purple-600",
    borderColor: "hover:border-purple-200/50",
    stats: ["Smart analysis", "Instant results", "Legal precision"],
  },
  {
    icon: FileSearch,
    title: "Risk Scoring",
    description: "Intelligent document summaries with automated risk assessment scores.",
    color: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600",
    borderColor: "hover:border-emerald-200/50",
    stats: ["Risk Heatmaps", "Executive Summaries", "Priority Flags"],
  },
  {
    icon: BarChart3,
    title: "Law Compliance",
    description: "Automatically match clauses with IPC, IT Act, and Rent Control Acts.",
    color: "from-orange-500/10 to-orange-600/5",
    iconColor: "text-orange-600",
    borderColor: "hover:border-orange-200/50",
    stats: ["IPC Section mapping", "Compliance checks", "Legal Citations"],
  },
  {
    icon: GitCompare,
    title: "Redline Suggestions",
    description: "AI-generated edit suggestions for unfair terms with legal citations.",
    color: "from-red-500/10 to-red-600/5",
    iconColor: "text-red-600",
    borderColor: "hover:border-red-200/50",
    stats: ["Track changes view", "Alternative wording", "Legal backing"],
  },
  {
    icon: Zap,
    title: "Unfair Term detection",
    description: "Flag unilateral termination clauses, hidden penalties, and IP traps.",
    color: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-600",
    borderColor: "hover:border-amber-200/50",
    stats: ["Termination flags", "Penalty detection", "IP protection"],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 md:flex items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 uppercase tracking-wider"
            >
              Enterprise Capabilities
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
            >
              Powerful AI features for <br className="hidden md:block" />
              every legal team
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:max-w-sm mt-4 md:mt-0"
          >
            From document to advanced clause detection, our platform handles the complexity
            so you can focus on winning cases.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative bg-white border border-gray-100 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 ${f.borderColor} hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1`}
            >
              {/* Card Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out shadow-inner`}>
                  <f.icon size={26} className={`${f.iconColor} group-hover:rotate-6 transition-transform`} />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-xl tracking-tight">{f.title}</h3>
                  <ArrowUpRight size={18} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>

                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {f.description}
                </p>

                {/* Mini Stats/Features */}
                <div className="flex flex-wrap gap-2">
                  {f.stats.map((s) => (
                    <span
                      key={s}
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-gray-50 text-gray-400 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all duration-300`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
