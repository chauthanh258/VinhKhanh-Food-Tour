"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col justify-center bg-zinc-950 text-white w-full max-w-lg mx-auto relative overflow-hidden px-6 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-100px] left-[-50px] w-80 h-80 bg-orange-600/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-50px] w-80 h-80 bg-yellow-600/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => router.push("/tour")}
          className="p-2 bg-zinc-900/50 backdrop-blur-md rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
