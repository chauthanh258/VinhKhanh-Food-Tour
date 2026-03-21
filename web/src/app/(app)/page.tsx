"use client";

import Link from "next/link";
import { Utensils, Map, Globe2, LogOut, User as UserIcon } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, language, logout } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const currentLanguage = {
    vi: "Tiếng Việt",
    en: "English",
    kr: "한국어",
    jp: "日本語"
  }[language as 'vi' | 'en' | 'kr' | 'jp'] || "Tiếng Việt";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 font-sans p-6 overflow-hidden relative">
      <div className="absolute inset-0 z-0 bg-linear-to-b from-transparent to-black/90 pointer-events-none" />
      
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1920&auto=format&fit=crop")' }}
      ></div>

      <main className="relative z-10 flex flex-col items-center gap-8 text-center max-w-xl w-full">
        <div className="flex justify-between w-full absolute top-[-40px]">
          {user && (
            <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-500">
              <UserIcon className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium">{user.fullName}</span>
            </div>
          )}
          {user && (
            <button 
              onClick={handleLogout}
              className="p-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="bg-orange-500/20 p-4 rounded-full backdrop-blur-sm border border-orange-500/30">
          <Utensils className="w-12 h-12 text-orange-400" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-linear-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-sm">
            VinhKhanh Food Tour
          </h1>
          <p className="text-lg text-zinc-300">
            Khám phá thiên đường hải sản Quận 4 với hướng dẫn viên tự động đa ngôn ngữ
          </p>
        </div>

        <div className="flex w-full mt-4 flex-col sm:flex-row gap-4">
          <Link
            href="/tour"
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white transition-colors font-medium text-lg shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
          >
            <Map className="w-5 h-5" />
            Bắt đầu Tour ngay
          </Link>
          
          <Link 
            href="/onboarding"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/50 backdrop-blur-md px-6 hover:bg-zinc-800 transition-colors"
          >
            <Globe2 className="w-5 h-5 text-zinc-400" />
            <span className="font-medium">{currentLanguage}</span>
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-zinc-500">
          Cần cấp quyền GPS (Vị trí) để trải nghiệm tốt nhất
        </div>
      </main>
    </div>
  );
}
