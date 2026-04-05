'use client';

import type { Metadata } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Layers, Settings as SettingsIcon, Menu, X, MapPin, Users, History, LogOut } from "lucide-react";
import { useState } from "react";
import NotificationBell from "./components/NotificationBell";
import { useUserStore } from "@/store/userStore";

// export const metadata: Metadata = {
//   title: "VinhKhanh System Admin",
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/categories', icon: Layers, label: 'Danh mục' },
    { href: '/admin/pois', icon: MapPin, label: 'Quản lý POI' },
    { href: '/admin/users', icon: Users, label: 'Người dùng' },
    { href: '/admin/audit-logs', icon: History, label: 'Audit Logs' },
    { href: '/admin/settings', icon: SettingsIcon, label: 'Cài đặt' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r border-border bg-secondary transition-all duration-300 hidden md:flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">V</div>
            {sidebarOpen && <span className="font-bold text-lg text-foreground">Admin</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted/30'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Toggle and Logout */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors gap-3`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Đăng xuất</span>}
          </button>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted/30 transition-colors text-muted-foreground"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="border-b border-border bg-secondary sticky top-0 z-40">
          <div className="h-16 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-muted/30 rounded-lg"
              >
                <Menu size={20} />
              </button>
              <h2 className="font-bold text-foreground">
                Hệ thống <span className="text-primary">Quản trị</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                ● Hệ thống hoạt động
              </div>
              <NotificationBell />
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary relative group cursor-pointer">
                {(user?.fullName || user?.email || "AD").substring(0, 2).toUpperCase()}
                
                {/* Tooltip to show full name */}
                <div className="absolute right-0 top-10 w-auto min-w-max bg-secondary px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-border shadow-lg">
                  {user?.fullName || user?.email || "Admin"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0f172a]">
          {children}
        </div>
      </main>
    </div>
  );
}