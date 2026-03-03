import {
  AlertTriangle,
  FileWarning,
  MapPinOff,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface PainPoint {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  audience: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface FooterColumnData {
  title: string;
  links: readonly string[];
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                          */
/* ------------------------------------------------------------------ */

export const NAV_LINKS = [
  "Features",
  "Solutions",
  "Pricing",
  "Resources",
] as const;

/* ------------------------------------------------------------------ */
/*  Pain Points                                                         */
/* ------------------------------------------------------------------ */

export const PAIN_POINTS: PainPoint[] = [
  {
    icon: AlertTriangle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    title: "Unexpected Penalties",
    description:
      "Demurrage and detention fees add up fast when you can't see deadlines coming. Most teams only discover charges after it's too late.",
  },
  {
    icon: FileWarning,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    title: "Compliance Nightmares",
    description:
      "Missing a single document can delay an entire shipment. Manual checklist processes leave too much room for costly human error.",
  },
  {
    icon: MapPinOff,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Tracking Blind Spots",
    description:
      "Without real-time port visibility, you're relying on phone calls and spreadsheets to track container status across multiple terminals.",
  },
];

/* ------------------------------------------------------------------ */
/*  Feature Bullets                                                     */
/* ------------------------------------------------------------------ */

export const DEMURRAGE_BULLETS = [
  "Automated countdown timers for every container",
  "WhatsApp and Email alerts for critical deadlines",
  "Cost calculator for potential fees",
] as const;

export const COMPLIANCE_BULLETS = [
  "Auto-generated Import Entry Declarations",
  "E2E visibility from port to warehouse",
] as const;

/* ------------------------------------------------------------------ */
/*  Pricing                                                             */
/* ------------------------------------------------------------------ */

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    audience: "For small businesses",
    price: "₱5k",
    period: "/mo",
    features: [
      "Up to 25 containers/mo",
      "Basic Demurrage Alerts",
      "Email Support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    audience: "For scaling logistics",
    price: "₱15k",
    period: "/mo",
    badge: "MOST POPULAR",
    features: [
      "Up to 100 containers/mo",
      "Advanced AI OCR Scanning",
      "Priority WhatsApp Alerts",
      "Multiuser Access",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    audience: "For large freight forwarders",
    price: "Custom",
    period: "",
    features: [
      "Unlimited containers",
      "Custom API Integration",
      "Dedicated Account Manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

export const FOOTER_COLUMNS: FooterColumnData[] = [
  { title: "Product", links: ["Features", "Pricing", "API"] },
  { title: "Company", links: ["About Us", "Careers", "Contact"] },
  { title: "Resources", links: ["Blog", "Case Studies", "Help Center"] },
];
