"use client";

import React, { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
// import { cn } from "@/lib/utils";

export function RoleSwitcher() {
  const { user } = useUserStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const roles = [
    { value: "USER", label: "User Portal", icon: "👤", path: "/tour" },
    { value: "OWNER", label: "Owner Dashboard", icon: "🏪", path: "/owner" },
    { value: "ADMIN", label: "Admin Panel", icon: "⚙️", path: "/admin" },
  ];

  const userRoles = user.role === "ADMIN" ? ["ADMIN", "OWNER", "USER"] : [user.role];
  const availableRoles = roles.filter((r) => userRoles.includes(r.value));

  if (availableRoles.length <= 1) return null;

  const currentRole = availableRoles.find((r) => r.value === user.role);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        <span>{currentRole?.icon}</span>
        <span>{currentRole?.label}</span>
        <ChevronDown
          className="w-4 h-4 transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
          <div className="p-2 space-y-1">
            {availableRoles.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  router.push(role.path);
                  setIsOpen(false);
                }}
                className={`
                w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center gap-3
                ${user.role === role.value
                    ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}
                `}
              >
                <span className="text-xl">{role.icon}</span>
                <div>
                  <p className="font-medium">{role.label}</p>
                  {user.role === role.value && (
                    <p className="text-xs opacity-70">Current</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
