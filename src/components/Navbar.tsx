"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3B9EF5] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="6" rx="1" fill="white" />
              <rect
                x="9"
                y="2"
                width="5"
                height="3"
                rx="1"
                fill="white"
                opacity="0.7"
              />
              <rect
                x="9"
                y="7"
                width="5"
                height="2"
                rx="1"
                fill="white"
                opacity="0.7"
              />
              <rect
                x="2"
                y="10"
                width="12"
                height="2"
                rx="1"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="2"
                y="13"
                width="8"
                height="1.5"
                rx="0.75"
                fill="white"
                opacity="0.4"
              />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg">Juris AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Demo"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-20 h-8 bg-gray-100 rounded-full animate-pulse" />
          ) : session ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-7 h-7 rounded-full bg-[#3B9EF5]/10 flex items-center justify-center">
                  <User size={14} className="text-[#3B9EF5]" />
                </div>
                <span className="font-medium">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </div>
              <Link href="/analyze">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5 text-sm h-9">
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5 text-sm h-9">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {["Features", "How it Works", "Pricing", "Resources"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="block text-sm text-gray-600 py-2"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
          {session ? (
            <>
              <Link
                href="/analyze"
                className="block"
                onClick={() => setMobileOpen(false)}
              >
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full mt-2">
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 py-2"
              >
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (
            <Link
              href="/signup"
              className="block"
              onClick={() => setMobileOpen(false)}
            >
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full mt-2">
                Get Started Free
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
