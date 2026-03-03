import Image from "next/image";
import { Anchor } from "lucide-react"; // Using Lucide icon as PortKey logo

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left Pane - Branding */}
      <div className="hidden flex-col justify-center items-center bg-[#003366] text-white p-12 lg:flex">
        <div className="max-w-md w-full text-center space-y-6 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[#003366] shadow-lg">
              <Anchor size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">PortKey</h1>
          </div>
          <p className="text-xl text-blue-100 font-medium tracking-wide">
            Intelligent Customs Clearance for the Modern Broker
          </p>
        </div>
      </div>

      {/* Right Pane - Auth Forms */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
