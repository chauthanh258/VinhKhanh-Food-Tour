"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Utensils,
  Image,
  QrCode,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
// import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export function OwnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUserStore();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/owner" },
    { icon: MapPin, label: "POI Management", path: "/owner/poi" },
    { icon: Utensils, label: "Menu Management", path: "/owner/menu" },
    { icon: Image, label: "Media Library", path: "/owner/media" },
    { icon: QrCode, label: "QR Code", path: "/owner/qr" },
    { icon: BarChart3, label: "Analytics", path: "/owner/analytics" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => {
    if (path === "/owner") {
      return pathname === "/owner" || pathname === "/owner/dashboard";
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-orange-900/20">
          <Utensils className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
          FoodTour
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`
              flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive(item.path)
                ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={`
                  w-5 h-5 transition-colors
                  ${isActive(item.path)
                    ? "text-orange-600 dark:text-orange-500"
                    : "group-hover:text-orange-500"}
                `}
              />
              <span className="font-medium">{item.label}</span>
            </div>
            {isActive(item.path) && (
              <ChevronRight className="w-4 h-4 opacity-100 transition-all" />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <Link
          href="/owner/settings"
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
            ${isActive("/owner/settings")
              ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
          `}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
