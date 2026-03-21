"use client";

import React, { useState } from "react";
import { Globe2, MapPin, Check, ChevronRight, Languages } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

const languages = [
  { id: "vi", name: "Tiếng Việt", flag: "🇻🇳", label: "Vietnamese" },
  { id: "en", name: "English", flag: "🇺🇸", label: "English" },
  { id: "kr", name: "한국어", flag: "🇰🇷", label: "Korean" },
  { id: "jp", name: "日本語", flag: "🇯🇵", label: "Japanese" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1); // 1: Language, 2: Location
  const { language, setLanguage, setLocation, setOnboarded } = useUserStore();
  const [isLocating, setIsLocating] = useState(false);
  const router = useRouter();

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setOnboarded(true);
      router.push("/");
    }
  };

  const requestLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
          setIsLocating(false);
          handleNextStep();
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          // Still proceed even if denied, but maybe show a warning
          handleNextStep();
        }
      );
    } else {
      setIsLocating(false);
      handleNextStep();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white w-full max-w-lg mx-auto relative overflow-hidden px-6 py-12">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-12">
        <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-orange-500" : "bg-zinc-800"}`} />
        <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-orange-500" : "bg-zinc-800"}`} />
      </div>

      <div className="flex-1 flex flex-col items-center text-center gap-8">
        {step === 1 ? (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-orange-500/10 p-4 rounded-3xl inline-block border border-orange-500/20">
              <Languages className="w-12 h-12 text-orange-400" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Chọn ngôn ngữ</h1>
              <p className="text-zinc-400">
                Hãy chọn ngôn ngữ bạn muốn sử dụng để trải nghiệm tour tốt nhất
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
              onClick={handleNextStep}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl transition-all font-semibold flex items-center justify-center gap-2 text-lg shadow-[0_4px_20px_rgba(249,115,22,0.3)] mt-4"
            >
              Tiếp tục <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-blue-500/10 p-4 rounded-3xl inline-block border border-blue-500/20">
              <MapPin className="w-12 h-12 text-blue-400" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Quyền truy cập vị trí</h1>
              <p className="text-zinc-400">
                Chúng tôi cần biết vị trí của bạn để hiển thị các quán ăn gần nhất và hướng dẫn đường đi chính xác
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-left space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <span className="text-orange-400 font-bold">1</span>
                </div>
                <p className="text-sm text-zinc-300">Tính năng này giúp bạn tìm thấy các địa điểm ăn uống ngay xung quanh mình.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <span className="text-orange-400 font-bold">2</span>
                </div>
                <p className="text-sm text-zinc-300">Vị trí của bạn được sử dụng để vẽ bản đồ tour tự động.</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={requestLocation}
                disabled={isLocating}
                className="w-full h-14 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 rounded-2xl transition-all font-semibold flex items-center justify-center gap-2 text-lg shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
              >
                {isLocating ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  "Cho phép truy cập vị trí"
                )}
              </button>
              
              <button
                onClick={handleNextStep}
                className="w-full h-14 bg-transparent hover:bg-zinc-900 text-zinc-500 rounded-2xl transition-all font-medium flex items-center justify-center gap-2"
              >
                Bỏ qua và thiết lập sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
