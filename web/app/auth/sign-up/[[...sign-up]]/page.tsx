import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-6">
      <SignUp
        fallbackRedirectUrl="/dashboard"
        appearance={{
          layout: {
            socialButtonsPlacement: "bottom",
            logoPlacement: "none",
            showOptionalFields: false,
          },
          variables: {
            colorPrimary: "#3B82F6",
            colorBackground: "#131B2E",
            colorText: "#ffffff",
            colorInputText: "#ffffff",
            colorInputBackground: "#0B1120",
            colorDanger: "#ef4444",
            fontFamily: "inherit",
          },
          elements: {
            rootBox: "w-full mx-auto",
            card: "shadow-2xl border border-slate-800 w-full sm:w-[420px] bg-[#131B2E] p-8 rounded-2xl",
            headerTitle: "text-3xl font-bold tracking-tight text-white mb-2",
            headerSubtitle: "text-slate-400 text-sm",
            formButtonPrimary:
              "bg-[#3B82F6] hover:bg-[#2563EB] text-white h-11 rounded-lg px-4 py-2 font-semibold w-full shadow-lg transition-all",
            formFieldInput:
              "flex h-11 w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-0 focus-visible:border-transparent transition-all",
            formFieldLabel: "text-sm font-semibold text-slate-300 mb-1.5",
            footerActionLink:
              "text-[#3B82F6] hover:text-[#60A5FA] font-medium transition-colors",
            socialButtonsBlockButton:
              "border border-slate-700 bg-[#0B1120] hover:bg-slate-800 h-11 rounded-lg px-4 py-2 text-sm shadow-sm transition-colors",
            socialButtonsBlockButtonText: "text-slate-200 font-medium",
            dividerLine: "bg-slate-700",
            dividerText:
              "text-slate-400 text-xs font-medium uppercase tracking-wider",
            footerActionText: "text-slate-400 font-medium",
            formFieldAction:
              "text-[#3B82F6] hover:text-[#60A5FA] text-sm font-medium transition-colors",
            identityPreviewText: "text-slate-300",
            identityPreviewEditButtonIcon:
              "text-slate-400 hover:text-[#3B82F6]",
          },
        }}
      />

      <div className="w-full sm:w-[420px] text-center mt-4">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center font-medium text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
