// "use client";

// import React, { useState } from "react";
// import { ChevronLeft, Languages, Check, User as UserIcon, LogOut } from "lucide-react";
// import { useUserStore } from "@/store/userStore";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";

// const languages = [
//   { id: "vi", name: "Tiếng Việt", flag: "🇻🇳", label: "Vietnamese" },
//   { id: "en", name: "English", flag: "🇺🇸", label: "English" },
//   { id: "kr", name: "한국어", flag: "🇰🇷", label: "Korean" },
//   { id: "jp", name: "日本語", flag: "🇯🇵", label: "Japanese" },
// ];

// export default function SettingsPage() {
//   const { user, language, setLanguage, updateUser, logout } = useUserStore();
//   const [isUpdating, setIsUpdating] = useState(false);
//   const router = useRouter();

//   const handleLanguageChange = async (langId: string) => {
//     setLanguage(langId);
//     if (!user) return;

//     setIsUpdating(true);
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
//         method: 'PATCH',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Cookies.get('auth-token')}`
//         },
//         body: JSON.stringify({ language: langId }),
//       });
//       const result = await response.json();
      
//       if (result.success) {
//         updateUser({ language: langId });
//       } else {
//         console.error("Failed to update language on backend");
//       }
//     } catch (error) {
//       console.error("Error updating language:", error);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
//       {/* Header */}
//       <div className="p-6 flex items-center gap-4 border-b border-zinc-900 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
//         <button 
//           onClick={() => router.back()}
//           className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
//         >
//           <ChevronLeft className="w-6 h-6" />
//         </button>
//         <h1 className="text-xl font-bold">Cài đặt</h1>
//       </div>

//       <div className="flex-1 overflow-y-auto p-6 space-y-8">
//         {/* Profile Card */}
//         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
//           <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
//             <UserIcon className="w-8 h-8 text-orange-400" />
//           </div>
//           <div className="flex-1">
//             <h2 className="font-bold text-lg">{user?.fullName || "Khách"}</h2>
//             <p className="text-zinc-500 text-sm">{user?.email}</p>
//           </div>
//         </div>

//         {/* Language Selection */}
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 text-zinc-400 px-2">
//             <Languages className="w-5 h-5" />
//             <h3 className="text-sm font-semibold uppercase tracking-wider">Ngôn ngữ</h3>
//           </div>
          
//           <div className="grid grid-cols-1 gap-2">
//             {languages.map((lang) => (
//               <button
//                 key={lang.id}
//                 onClick={() => handleLanguageChange(lang.id)}
//                 disabled={isUpdating}
//                 className={`flex items-center justify-between h-14 px-6 rounded-2xl border transition-all ${
//                   language === lang.id
//                     ? "bg-orange-500/10 border-orange-500 text-white"
//                     : "bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-700"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="text-xl">{lang.flag}</span>
//                   <span className="font-medium">{lang.name}</span>
//                 </div>
//                 {language === lang.id && <Check className="w-5 h-5 text-orange-500" />}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Danger Zone */}
//         <div className="pt-4">
//           <button 
//             onClick={handleLogout}
//             className="w-full h-14 bg-zinc-900/50 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400 rounded-2xl transition-all font-medium flex items-center justify-center gap-2"
//           >
//             <LogOut className="w-5 h-5" />
//             Đăng xuất
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import { ChevronLeft, Globe, Volume2, Moon, MapPin, HelpCircle, Info, Shield, Check, X, UserIcon, LogOut, Store } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const languages = [
  { id: "en", name: "English", flag: "🇬🇧", label: "English" },
  { id: "vi", name: "Tiếng Việt", flag: "🇻🇳", label: "Vietnamese" },
  { id: "zh", name: "中文", flag: "🇨🇳", label: "Chinese (Mandarin)" },
  { id: "hi", name: "हिन्दी", flag: "🇮🇳", label: "Hindi" },
  { id: "es", name: "Español", flag: "🇪🇸", label: "Spanish" },
  { id: "fr", name: "Français", flag: "🇫🇷", label: "French" },
  { id: "ar", name: "العربية", flag: "🇸🇦", label: "Arabic" },
  { id: "pt", name: "Português", flag: "🇵🇹", label: "Portuguese" },
  { id: "ru", name: "Русский", flag: "🇷🇺", label: "Russian" },
  { id: "id", name: "Bahasa Indonesia", flag: "🇮🇩", label: "Indonesian" },
  { id: "ja", name: "日本語", flag: "🇯🇵", label: "Japanese" },
  { id: "ko", name: "한국어", flag: "🇰🇷", label: "Korean" },
  { id: "de", name: "Deutsch", flag: "🇩🇪", label: "German" },
  { id: "it", name: "Italiano", flag: "🇮🇹", label: "Italian" },
  { id: "th", name: "ภาษาไทย", flag: "🇹🇭", label: "Thai" },
];

export default function SettingsPage() {
  const { user, language, setLanguage, updateUser, logout } = useUserStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState("100m");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const router = useRouter();

  const handleLanguageChange = async (langId: string) => {
    setLanguage(langId);
    if (!user) {
      setShowLanguageModal(false);
      return;
    }

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
      setShowLanguageModal(false); // Đóng modal sau khi chọn
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-zinc-900 sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10">
        {/* <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button> */}
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="p-6 space-y-8 pb-24 h-[calc(100vh-100px)] overflow-y-auto">
        {/* Profile Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10 text-orange-400" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{user?.fullName || "Khách"}</h2>
            </div>
            <p className="text-zinc-500 text-sm mt-0.5">{user?.email}</p>
          </div>

          <button 
            onClick={() => router.push("/profile/edit")}
            className="bg-emerald-600 hover:bg-emerald-500 transition-colors px-6 py-2.5 rounded-2xl font-medium text-sm whitespace-nowrap"
          >
            Edit Profile
          </button>
        </div>

        {/* GENERAL Section */}
        <div>
          <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest px-2 mb-4">GENERAL</h3>
          
          <div className="space-y-3">
            {/* Language - Click to open modal */}
            <button 
              onClick={() => setShowLanguageModal(true)}
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 flex items-center justify-between transition-all active:scale-[0.985]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-zinc-400">
                    {languages.find(l => l.id === language)?.name || "Tiếng Việt"}
                  </p>
                </div>
              </div>
              <div className="text-emerald-400 text-xl">›</div>
            </button>

            {/* Audio Quality */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Audio Quality</p>
                  <p className="text-sm text-zinc-400">High Definition (Lossless)</p>
                </div>
              </div>
              <div className="text-emerald-400">›</div>
            </div>

            {/* Theme */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-zinc-400">Dark</p>
                </div>
              </div>
              <div className="relative w-11 h-6 bg-zinc-700 rounded-full">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* GUIDE FEATURES Section */}
        <div>
          <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest px-2 mb-4">GUIDE FEATURES</h3>
          
          <div className="space-y-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Auto-trigger Landmarks</p>
                  <p className="text-sm text-zinc-400">Plays audio as you approach</p>
                </div>
              </div>
              <div className="relative w-11 h-6 bg-emerald-600 rounded-full cursor-pointer">
                <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="font-medium">Discovery Radius</p>
              </div>
              
              <div className="flex gap-2">
                {["50m", "100m", "200m"].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => setSelectedRadius(radius)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                      selectedRadius === radius 
                        ? "bg-emerald-600 text-white" 
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {radius}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORT Section */}
        <div>
          <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest px-2 mb-4">SUPPORT</h3>
          
          <div className="space-y-3">
            <button className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-zinc-700 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <p className="font-medium">Help Center</p>
              </div>
              <span className="text-zinc-500">›</span>
            </button>

            <button className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-zinc-700 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <p className="font-medium">About AudioGuide</p>
              </div>
              <span className="text-zinc-500">›</span>
            </button>

            <button className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-zinc-700 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="font-medium">Terms of Service</p>
              </div>
              <span className="text-zinc-500">›</span>
            </button>
          </div>
        </div>

        {/* PARTNERSHIP Section */}
        <div>
          <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest px-2 mb-4">PARTNERSHIP</h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => router.push("/shop/register")}
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-3xl p-5 flex items-center justify-between transition-all group active:scale-[0.985]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Store className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Trở thành chủ quán</p>
                  <p className="text-sm text-zinc-400">Gia nhập cộng đồng bán hàng</p>
                </div>
              </div>
              <div className="text-orange-400 text-xl group-hover:translate-x-1 transition-transform">›</div>
            </button>
          </div>
        </div>

        {/* Log Out */}
        <button 
          onClick={handleLogout}
          className="w-full h-14 bg-zinc-900/70 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400 rounded-3xl transition-all font-medium flex items-center justify-center gap-3 text-lg mt-6"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      {/* ==================== LANGUAGE MODAL ==================== */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowLanguageModal(false)}>
          <div className="bg-zinc-900 w-full max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold">Chọn ngôn ngữ</h2>
              <button 
                onClick={() => setShowLanguageModal(false)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            {/* Language List */}
            <div className="p-3 max-h-[60vh] overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  disabled={isUpdating}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl mb-2 transition-all ${
                    language === lang.id 
                      ? "bg-orange-500/10 border border-orange-500" 
                      : "hover:bg-zinc-800 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="text-left">
                      <p className="font-medium text-lg">{lang.name}</p>
                      <p className="text-sm text-zinc-500">{lang.label}</p>
                    </div>
                  </div>
                  
                  {language === lang.id && (
                    <Check className="w-6 h-6 text-orange-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-zinc-800">
              <button 
                onClick={() => setShowLanguageModal(false)}
                className="w-full py-4 text-zinc-400 hover:text-white font-medium transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}