"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Save,
  Eye,
  EyeOff,
  Lock,
  Globe,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

type SaveStatus = "idle" | "saving" | "success" | "error";

const languageOptions = [
  { value: "vi", label: "Vietnamese" },
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

export default function SettingsPage() {
  const { user, language, setLanguage, updateUser } = useUserStore();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    language: "vi",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setProfile({
      fullName: user?.fullName || "",
      email: user?.email || "",
      language: user?.language || language || "vi",
    });
  }, [user, language]);

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearStatus = () => {
    setTimeout(() => {
      setSaveStatus("idle");
      setStatusMessage("");
    }, 3000);
  };

  const handleSaveProfile = async () => {
    if (!profile.fullName.trim()) {
      setSaveStatus("error");
      setStatusMessage("Full name is required.");
      clearStatus();
      return;
    }

    setSaveStatus("saving");
    setStatusMessage("");

    try {
      const response = await api.patch("/auth/profile", {
        fullName: profile.fullName.trim(),
        language: profile.language,
      });

      const updatedUser = response?.data;
      if (updatedUser) {
        updateUser({
          fullName: updatedUser.fullName,
          language: updatedUser.language,
        });
        setLanguage(updatedUser.language);
      }

      setSaveStatus("success");
      setStatusMessage("Profile updated successfully.");
    } catch (error: any) {
      setSaveStatus("error");
      setStatusMessage(error?.message || "Failed to update profile.");
    }

    clearStatus();
  };

  const handleChangePassword = async () => {
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      setSaveStatus("error");
      setStatusMessage("Please fill all password fields.");
      clearStatus();
      return;
    }

    if (security.newPassword !== security.confirmPassword) {
      setSaveStatus("error");
      setStatusMessage("Passwords do not match.");
      clearStatus();
      return;
    }

    setSaveStatus("saving");
    setStatusMessage("");

    try {
      await api.patch("/auth/profile", {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });

      setSaveStatus("success");
      setStatusMessage("Password updated successfully.");
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
    } catch (error: any) {
      setSaveStatus("error");
      setStatusMessage(error?.message || "Failed to update password.");
    }

    clearStatus();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your profile, language, and password.
        </p>
      </div>

      {saveStatus === "success" && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            {statusMessage}
          </p>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {statusMessage}
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
            <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile details</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => handleProfileChange("fullName", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800/70 border-none rounded-xl outline-none text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Preferred Language
              </div>
            </label>
            <select
              value={profile.language}
              onChange={(e) => handleProfileChange("language", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saveStatus === "saving"}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saveStatus === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">
            <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Change your account password</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Current Password</label>
            <div className="relative">
              <input
                type={security.showCurrentPassword ? "text" : "password"}
                value={security.currentPassword}
                onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
              />
              <button
                type="button"
                onClick={() => handleSecurityChange("showCurrentPassword", !security.showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {security.showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">New Password</label>
              <div className="relative">
                <input
                  type={security.showNewPassword ? "text" : "password"}
                  value={security.newPassword}
                  onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleSecurityChange("showNewPassword", !security.showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {security.showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={security.showConfirmPassword ? "text" : "password"}
                  value={security.confirmPassword}
                  onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleSecurityChange("showConfirmPassword", !security.showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {security.showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={saveStatus === "saving"}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:bg-red-600 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="w-5 h-5" />
            {saveStatus === "saving" ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

    </div>
  );
}
