import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VinhKhanh Food Tour",
  description: "Explore the best street food in District 4",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-black w-lg mx-auto relative">
      {children}
    </div>
  );
}
