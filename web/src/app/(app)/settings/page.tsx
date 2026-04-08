"use client";

import React, { useState } from "react";
import { ChevronLeft, Languages, Check, User as UserIcon, LogOut, Edit2, Save, X, Crown } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api";
import { toast } from "react-hot-toast";

const languages = [
  { id: "vi", name: "Tiếng Việt", flag: "🇻🇳", label: "Vietnamese" },
  { id: "en", name: "English", flag: "🇺🇸", label: "English" },
  { id: "kr", name: "한국어", flag: "🇰🇷", label: "Korean" },
  { id: "jp", name: "日本語", flag: "🇯🇵", label: "Japanese" },
];

export default function SettingsPage() {
  const { user, language, setLanguage, updateUser, logout } = useUserStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isRequestingUpgrade, setIsRequestingUpgrade] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const router = useRouter();

  const handleLanguageChange = async (langId: string) => {
    setLanguage(langId);
    if (!user) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth-token')}`
        },
        body: JSON.stringify({ language: langId }),
      });
      const result = await response.json();
      
      if (result.success) {
        updateUser({ language: langId });
      } else {
        console.error("Failed to update language on backend");
      }
    } catch (error) {
      console.error("Error updating language:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth-token')}`
        },
        body: JSON.stringify(profileForm),
      });
      const result = await response.json();
      
      if (result.success) {
        updateUser(profileForm);
        setIsEditingProfile(false);
      } else {
        console.error("Failed to update profile on backend");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequestOwnerUpgrade = async () => {
    if (!user || user.role !== 'USER') return;

    setIsRequestingUpgrade(true);
    try {
      await authApi.requestOwnerUpgrade();
      toast.success('Yêu cầu nâng cấp lên Owner đã được gửi. Admin sẽ xem xét trong thời gian sớm nhất.');
    } catch (error: any) {
      console.error('Failed to request owner upgrade:', error);
      toast.error(error?.response?.data?.message || 'Không thể gửi yêu cầu nâng cấp');
    } finally {
      setIsRequestingUpgrade(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-zinc-900 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Cài đặt</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Profile Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Chỉnh sửa thông tin</h2>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full h-12 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full h-12 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  placeholder="Nhập email"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </button>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 h-12 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <UserIcon className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{user?.fullName || "Khách"}</h2>
                <p className="text-zinc-500 text-sm">{user?.email}</p>
              </div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-400 px-2">
            <Languages className="w-5 h-5" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Ngôn ngữ</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                disabled={isUpdating}
                className={`flex items-center justify-between h-14 px-6 rounded-2xl border transition-all ${
                  language === lang.id
                    ? "bg-orange-500/10 border-orange-500 text-white"
                    : "bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
                {language === lang.id && <Check className="w-5 h-5 text-orange-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Owner Upgrade Request - Only show for USER role */}
        {user?.role === 'USER' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <Crown className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">Nâng cấp lên Owner</h2>
                <p className="text-zinc-500 text-sm">Đăng ký làm chủ sở hữu để quản lý POI của riêng bạn</p>
              </div>
              <button 
                onClick={handleRequestOwnerUpgrade}
                disabled={isRequestingUpgrade}
                className="px-6 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Crown className="w-4 h-4" />
                {isRequestingUpgrade ? 'Đang gửi...' : 'Yêu cầu nâng cấp'}
              </button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="pt-4">
          <button 
            onClick={handleLogout}
            className="w-full h-14 bg-zinc-900/50 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400 rounded-2xl transition-all font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
