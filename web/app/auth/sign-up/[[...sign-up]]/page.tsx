import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      fallbackRedirectUrl="/dashboard"
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "shadow-none border border-border w-full sm:w-[400px] bg-card p-4",
          headerTitle: "text-2xl font-bold tracking-tight text-foreground",
          headerSubtitle: "text-muted-foreground",
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-4 py-2 font-medium w-full shadow",
          formFieldInput:
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          formFieldLabel:
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground",
          footerActionLink: "text-primary hover:text-primary/90 font-medium",
          socialButtonsBlockButton:
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 rounded-md px-4 py-2 text-sm shadow-sm",
          socialButtonsBlockButtonText: "text-foreground font-medium",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground text-xs",
        },
      }}
      // Note: Custom fields like "Organization Name" are configured in the Clerk Dashboard
      // under User & Authentication -> Custom Fields.
    />
  );
}
