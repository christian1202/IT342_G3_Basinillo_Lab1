import { LayoutSidebar } from "@/components/layout/LayoutSidebar";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebar>
      <div className="flex justify-end gap-4 items-center w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="w-full absolute top-16 left-0 px-8 py-8 h-[calc(100vh-4rem)] max-w-7xl mx-auto">
        {children}
      </div>
    </LayoutSidebar>
  );
}
