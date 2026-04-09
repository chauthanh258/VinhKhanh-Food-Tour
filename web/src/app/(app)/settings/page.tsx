"use client";

import React, { useState } from "react";
import { ChevronLeft, Languages, Check, User as UserIcon, LogOut } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const languages = [
  { id: "vi", name: "Tiếng Việt", flag: "🇻🇳", label: "Vietnamese" },
  { id: "en", name: "English", flag: "🇺🇸", label: "English" },
  { id: "kr", name: "한국어", flag: "🇰🇷", label: "Korean" },
  { id: "jp", name: "日本語", flag: "🇯🇵", label: "Japanese" },
];

export default function SettingsPage() {
  const { user, language, setLanguage, updateUser, logout } = useUserStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleLanguageChange = async (langId: string) => {
    setLanguage(langId);
    if (!user) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/profile`, {
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
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <UserIcon className="w-8 h-8 text-orange-400" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">{user?.fullName || "Khách"}</h2>
            <p className="text-zinc-500 text-sm">{user?.email}</p>
          </div>
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
