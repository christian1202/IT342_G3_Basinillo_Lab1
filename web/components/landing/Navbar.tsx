"use client";

import Link from "next/link";
import { Anchor, Menu, X } from "lucide-react";
import { NAV_LINKS } from "./constants";

interface NavbarProps {
  mobileMenuOpen: boolean;
  onToggleMobile: () => void;
}

export function Navbar({ mobileMenuOpen, onToggleMobile }: NavbarProps) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0A0F1E]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B6CF6] to-[#6D5BF7] shadow-lg shadow-blue-500/20">
            <Anchor className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">PortKey</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-sm font-medium text-[#9CA3AF] transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/auth/sign-in"
            className="text-sm font-semibold text-[#9CA3AF] transition-colors hover:text-white"
          >
            Log In
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-full bg-[#3B6CF6] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#2b5ad4] hover:shadow-lg hover:shadow-blue-500/25"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={onToggleMobile}
          className="rounded-lg p-2 text-[#9CA3AF] hover:bg-white/5 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <nav className="border-t border-white/5 bg-[#0A0F1E] px-4 py-4 md:hidden">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="block rounded-lg px-4 py-2 text-sm font-medium text-[#9CA3AF] hover:bg-white/5 hover:text-white"
            >
              {label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
            <Link
              href="/auth/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#9CA3AF] hover:bg-white/5 hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-[#3B6CF6] px-5 py-2 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
