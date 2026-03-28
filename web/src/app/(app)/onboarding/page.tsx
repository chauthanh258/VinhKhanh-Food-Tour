"use client";

import React, { useState } from "react";
import { Globe2, MapPin, Check, ChevronRight, Languages } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const languages = [
  { id: "vi", name: "Tiếng Việt", flag: "🇻🇳", label: "Vietnamese" },
  { id: "en", name: "English", flag: "🇺🇸", label: "English" },
  { id: "kr", name: "한국어", flag: "🇰🇷", label: "Korean" },
  { id: "jp", name: "日本語", flag: "🇯🇵", label: "Japanese" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1); 
  const { user, language, setLanguage, setOnboarded, updateUser } = useUserStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Redirect if already onboarded
  React.useEffect(() => {
    if (user?.isOnboarded) {
      router.push("/");
    }
  }, [user, router]);

  const handleFinish = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth-token')}`
        },
        body: JSON.stringify({ language, isOnboarded: true }),
      });
      const result = await response.json();
      
      if (result.success) {
        updateUser({ isOnboarded: true, language });
        router.push("/");
      } else {
        alert(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Đã có lỗi xảy ra");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white w-full max-w-lg mx-auto relative overflow-hidden px-6 py-12">
      <div className="flex-1 flex flex-col items-center text-center gap-8 py-8">
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-orange-500/10 p-4 rounded-3xl inline-block border border-orange-500/20">
            <Languages className="w-12 h-12 text-orange-400" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Chào mừng bạn!</h1>
            <p className="text-zinc-400">
              Hãy chọn ngôn ngữ bạn muốn sử dụng để bắt đầu chuyến hành trình khám phá ẩm thực
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`flex items-center justify-between h-16 px-6 rounded-2xl border transition-all ${
                  language === lang.id
                    ? "bg-orange-500/10 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-semibold">{lang.name}</div>
                    <div className="text-xs opacity-60">{lang.label}</div>
                  </div>
                </div>
                {language === lang.id && <Check className="w-5 h-5 text-orange-500" />}
              </button>
            ))}
          </div>

          <button
            onClick={handleFinish}
            disabled={isUpdating}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 rounded-2xl transition-all font-semibold flex items-center justify-center gap-2 text-lg shadow-[0_4px_20px_rgba(249,115,22,0.3)] mt-4"
          >
            {isUpdating ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Bắt đầu ngay <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
