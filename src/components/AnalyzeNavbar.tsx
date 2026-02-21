"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AnalyzeNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3B9EF5] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="6" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="3" rx="1" fill="white" opacity="0.7" />
              <rect x="9" y="7" width="5" height="2" rx="1" fill="white" opacity="0.7" />
              <rect x="2" y="10" width="12" height="2" rx="1" fill="white" opacity="0.5" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg">Juris AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/history">
            <Button variant="ghost" className="rounded-full text-sm h-9 px-5 text-gray-600 hover:text-indigo-600">
              History
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full text-sm h-9 px-5">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
