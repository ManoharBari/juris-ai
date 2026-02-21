"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Michael Rodriguez",
    role: "MR. Partners at @eFounders",
    avatar: "MR",
    color: "bg-orange-400",
    quote:
      "The accuracy and speed of document analysis is incredible. Our compliance team can't imagine working without it \"Juris AI has revolutionized our contract review process. What used to take days now takes",
    highlight: true,
  },
  {
    name: "Priya Sharma",
    role: "Senior Legal Counsel, TechCorp India",
    avatar: "PS",
    color: "bg-purple-400",
    quote:
      "The Indian law cross-referencing feature is a game-changer. We catch IPC violations we'd have missed before. Essential for any legal team in India.",
  },
  {
    name: "Rahul Mehta",
    role: "Head of Compliance, FinServe Ltd.",
    avatar: "RM",
    color: "bg-green-400",
    quote:
      "Risk scoring and unfair term detection saves us hours per contract. The redline suggestions with legal citations are incredibly precise.",
  },
  {
    name: "Anita Desai",
    role: "Property Lawyer, Mumbai",
    avatar: "AD",
    color: "bg-blue-400",
    quote:
      "Rent Control Act analysis and tenant rights assessment in seconds. Juris AI understands the nuances of Indian real estate law perfectly.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Trusted by legal professionals</h2>
          <p className="text-gray-500">See what teams across India are saying about Juris AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-2xl p-6 border transition-all hover:-translate-y-0.5 ${
                t.highlight
                  ? "bg-gray-900 border-gray-800 text-white"
                  : "bg-white border-gray-100 hover:shadow-lg hover:shadow-gray-100"
              }`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    size={13}
                    className={t.highlight ? "text-yellow-400 fill-yellow-400" : "text-yellow-400 fill-yellow-400"}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className={`text-sm leading-relaxed mb-5 line-clamp-5 ${t.highlight ? "text-gray-300" : "text-gray-600"}`}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${t.highlight ? "text-white" : "text-gray-900"}`}>
                    {t.name}
                  </div>
                  <div className={`text-xs ${t.highlight ? "text-gray-400" : "text-gray-400"}`}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
