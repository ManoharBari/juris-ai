"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Upload, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-700">
            <Sparkles size={14} />
            AI-Powered Contract Intelligence for Indian Law
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Legal Clarity in Seconds,
            <br />
            Not Hours
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Extract key clauses, surface hidden risks, and collaborate with
            confidence, powered by AI that understands legal
            context.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <Link href="/signin">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 h-11 text-sm font-medium">
              Get Start Now <ArrowRight size={15} className="ml-1.5" />
            </Button>
          </Link>
        </motion.div>

        {/* Upload Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            {/* Envelope/folder illustration */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[95%] h-12 bg-[#5BB8F8] rounded-b-3xl opacity-60 blur-sm" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[97%] h-8 bg-[#4AAEF5] rounded-b-3xl opacity-70" />

            {/* Main card */}
            <div className="relative bg-gradient-to-b from-[#3B9EF5] to-[#5BBFFA] rounded-3xl p-1.5 shadow-2xl shadow-blue-200">
              {/* Header bar */}
              <div className="bg-[#3B9EF5] rounded-t-2xl px-6 py-3 text-center">
                <span className="text-white font-semibold text-sm tracking-wider uppercase">
                  Upload &amp; Organise Document
                </span>
              </div>

              {/* Drop zone */}
              <div className="bg-white rounded-b-2xl m-px mt-0">
                <Link href="/analyze">
                  <div className="border-2 border-dashed border-blue-200 rounded-2xl m-4 p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Upload size={24} className="text-[#3B9EF5]" />
                      </div>
                    </div>
                    <p className="text-gray-800 font-semibold text-lg mb-1">
                      Drop your documents here
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      PDF, DOCX, TXT up to 50MB
                    </p>
                    <button className="bg-[#3B9EF5] hover:bg-[#2B8EE5] text-white rounded-full px-8 py-2.5 text-sm font-medium transition-colors">
                      Browse Files
                    </button>
                  </div>
                </Link>

                {/* Stats row */}
                <div className="px-6 pb-5 flex items-center justify-center gap-8">
                  {[
                    {
                      icon: FileText,
                      label: "AI Analysis",
                      color: "text-blue-500",
                    },
                    {
                      icon: Sparkles,
                      label: "Instant Results",
                      color: "text-purple-500",
                    },
                  ].map(({ icon: Icon, label, color }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <Icon size={15} className={color} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-center gap-10 mt-16 text-center"
        >
          {[
            { value: "99.8%", label: "Success Rate" },
            { value: "180+", label: "Documents Processed" },
            { value: "<2s", label: "Average Time" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
