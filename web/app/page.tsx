"use client";

import { useState } from "react";
import {
  Navbar,
  HeroSection,
  PainPointsSection,
  DemurrageClockSection,
  SmartScanSection,
  ComplianceCopilotSection,
  PricingSection,
  FinalCtaSection,
  SiteFooter,
} from "@/components/landing";

/* ================================================================== */
/*  PortKey — Landing Page                                             */
/*  Composes all landing sections into a single dark-themed page.      */
/* ================================================================== */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0F1E] font-[family-name:var(--font-geist-sans)]">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobile={() => setMobileMenuOpen((prev) => !prev)}
      />

      <main>
        <HeroSection />
        <PainPointsSection />
        <DemurrageClockSection />
        <SmartScanSection />
        <ComplianceCopilotSection />
        <PricingSection />
        <FinalCtaSection />
      </main>

      <SiteFooter />
    </div>
  );
}
