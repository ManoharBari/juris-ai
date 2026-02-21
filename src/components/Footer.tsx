"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#3B9EF5] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="6" rx="1" fill="white" />
                  <rect x="9" y="2" width="5" height="3" rx="1" fill="white" opacity="0.7" />
                  <rect x="9" y="7" width="5" height="2" rx="1" fill="white" opacity="0.7" />
                  <rect x="2" y="10" width="12" height="2" rx="1" fill="white" opacity="0.5" />
                </svg>
              </div>
              <span className="text-white font-semibold">Juris AI</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              AI-powered contract intelligence platform built for Indian legal professionals.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              {["Features", "How it Works", "Pricing", "Security"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {["About Us", "Blog", "Careers", "Contact"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 Juris AI. All rights reserved.</p>
          <p className="text-gray-600">Made with AI for Indian legal teams</p>
        </div>
      </div>
    </footer>
  );
}
