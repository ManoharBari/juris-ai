"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, Languages, Database, ArrowRight } from "lucide-react";

const steps = [
    {
        icon: Upload,
        title: "1. Upload",
        description: "Securely upload your legal documents in PDF, DOCX, or TXT format.",
        color: "bg-blue-50",
        iconColor: "text-blue-500",
    },
    {
        icon: Cpu,
        title: "2. Analyze",
        description: "Multi-agent AI parses every clause and scores risks against Indian Law.",
        color: "bg-indigo-50",
        iconColor: "text-indigo-500",
    },
    {
        icon: Languages,
        title: "3. Refine",
        description: "Review automated redline suggestions and translations in your language.",
        color: "bg-purple-50",
        iconColor: "text-purple-500",
    },
    {
        icon: Database,
        title: "4. Secure Save",
        description: "Your reports are encrypted and stored in your private, secure history.",
        color: "bg-emerald-50",
        iconColor: "text-emerald-500",
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-gray-900 mb-4"
                    >
                        How Juris AI Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 max-w-xl mx-auto"
                    >
                        A seamless, secure, and intelligent pipeline designed for the modern legal ecosystem.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-8 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative`}>
                                    <step.icon size={28} className={step.iconColor} />

                                    {/* Step number badge for mobile */}
                                    <div className="lg:hidden absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                        {i + 1}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed px-4">
                                    {step.description}
                                </p>

                                {i < steps.length - 1 && (
                                    <div className="lg:hidden mt-6 text-gray-200">
                                        <ArrowRight className="rotate-90" size={20} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                        Ready to secure your documents?
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
