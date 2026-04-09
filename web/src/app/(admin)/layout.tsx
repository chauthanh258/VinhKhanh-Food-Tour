'use client';

import type { Metadata } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Layers, Settings as SettingsIcon, Menu, X, MapPin, Users, History, LogOut, CheckCircle } from "lucide-react";
import { useState } from "react";
import NotificationBell from "./components/NotificationBell";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { user, logout } = useUserStore();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      addToast('Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('Mật khẩu mới không trùng khớp', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      addToast('Mật khẩu mới cần tối thiểu 8 ký tự', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.patch('/auth/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      addToast('Đổi mật khẩu thành công', 'success');
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      addToast(error.message || 'Lỗi khi đổi mật khẩu', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/approvals', icon: CheckCircle, label: 'Duyệt yêu cầu' },
    { href: '/admin/categories', icon: Layers, label: 'Danh mục' },
    { href: '/admin/pois', icon: MapPin, label: 'Quản lý POI' },
    { href: '/admin/users', icon: Users, label: 'Người dùng' },
    { href: '/admin/audit-logs', icon: History, label: 'Audit Logs' },
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
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary focus:outline-none"
                >
                  {(user?.fullName || user?.email || "AD").substring(0, 2).toUpperCase()}
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setProfileOpen(false);
                        setShowPasswordForm(false);
                      }}
                    />
                    <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-border bg-secondary p-4 shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                          {(user?.fullName || user?.email || 'AD').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user?.fullName || 'Admin'}</p>
                          <p className="text-xs text-muted-foreground">{user?.email || 'Chưa có email'}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm((prev) => !prev)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted/80"
                        >
                          Đổi mật khẩu
                        </button>

                        {showPasswordForm && (
                          <div className="space-y-3 rounded-2xl border border-border bg-background p-3">
                            <div>
                              <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Mật khẩu hiện tại
                              </label>
                              <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                                autoComplete="current-password"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Mật khẩu mới
                              </label>
                              <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                                autoComplete="new-password"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Nhập lại mật khẩu mới
                              </label>
                              <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                                autoComplete="new-password"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleUpdatePassword}
                                disabled={isUpdatingPassword}
                                className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isUpdatingPassword ? 'Đang cập nhật...' : 'Lưu mật khẩu'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowPasswordForm(false);
                                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
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