import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VinhKhanh Food Tour",
  description: "Explore the best street food in District 4",
};

import BottomNav from "@/components/shared/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-black w-full max-w-lg mx-auto relative pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
