"use client";

import type { Metadata } from "next";
import { OwnerSidebar } from "./components/OwnerSidebar";
import { OwnerTopbar } from "./components/OwnerTopbar";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "VinhKhanh Owner Dashboard",
// };

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and has OWNER role
    if (!token || !user || (user.role !== "OWNER" && user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [token, user, router]);

  if (!token || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <OwnerTopbar />
        <main className="flex-1 p-8 overflow-y-auto bg-blue-50">
          {children}
        </main>
      </div>
    </div>
  );
}
