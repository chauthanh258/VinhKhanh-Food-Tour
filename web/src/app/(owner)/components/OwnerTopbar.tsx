"use client";

import React, { useState } from "react";
import { Search, Bell, User, ChevronDown, Mail, Phone, Calendar, Shield, X, LogOut } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export function OwnerTopbar() {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <>
      <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search for POI, menu item..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <RoleSwitcher />
          
          <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </button>

          <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2"></div>

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pl-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all group relative"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Restaurant Owner
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold border-2 border-white dark:border-gray-800 shadow-sm group-hover:shadow-md transition-all">
              {initials}
            </div>
            <ChevronDown className={
              `w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-all
              ${isProfileOpen ? "rotate-180" : ""}`
            } />
          </button>
        </div>
      </header>

      {/* Profile Card */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}>
          <div
            className="absolute right-8 top-24 w-96 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                User Profile
              </h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-orange-100 dark:bg-orange-500/20 rounded-3xl flex items-center justify-center text-orange-600 dark:text-orange-500 text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-xl mb-4">
                {initials}
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.fullName}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Restaurant Owner & Food Enthusiast
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Account Role
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Verified Owner
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => { logout(); router.push('/login'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
