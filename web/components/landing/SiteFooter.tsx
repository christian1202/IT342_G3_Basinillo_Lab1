import Link from "next/link";
import { Anchor } from "lucide-react";
import { FOOTER_COLUMNS } from "./constants";
import { FooterColumn } from "./FooterColumn";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#080C18] py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand Column */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B6CF6] to-[#6D5BF7]">
              <Anchor className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">PortKey</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-[#9CA3AF]">
            Modernizing logistics for the Philippines, one container at a time.
          </p>
        </div>

        {/* Link Columns */}
        {FOOTER_COLUMNS.map((col) => (
          <FooterColumn key={col.title} title={col.title} links={col.links} />
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/5 px-4 pt-6 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-[#9CA3AF]/50">
          © 2026 PortKey Technologies Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
