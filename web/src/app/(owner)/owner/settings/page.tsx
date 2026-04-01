"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff,
  Bell,
  Lock,
  Globe,
  AlertCircle,
  CheckCircle2,
  Sun,
} from "lucide-react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    firstName: "Nguyễn",
    lastName: "Văn A",
    email: "owner@example.com",
    phone: "+84 123 456 789",
    address: "District 1, Ho Chi Minh City",
    businessName: "Pho Vietnam Restaurant",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderAlerts: true,
    weeklyReport: true,
    darkMode: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({
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

  const handleSaveProfile = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 800);
  };

  const handleChangePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      setSaveStatus("error");
      return;
    }
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings, preferences, and security options.
        </p>
      </div>

      {/* Status Messages */}
      {saveStatus === "success" && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            Changes saved successfully!
          </p>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            Passwords do not match. Please try again.
          </p>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
            <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your personal details
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleFormChange("firstName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleFormChange("lastName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
              />
            </div>
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
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </div>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleFormChange("phone", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </div>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleFormChange("address", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Business Name
                </div>
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  handleFormChange("businessName", e.target.value)
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
              />
            </div>
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

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Notification Preferences
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Control how you receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              description: "Receive important updates via email",
            },
            {
              key: "pushNotifications",
              label: "Push Notifications",
              description: "Receive push notifications on your devices",
            },
            {
              key: "orderAlerts",
              label: "Order Alerts",
              description: "Get notified when customers place orders",
            },
            {
              key: "weeklyReport",
              label: "Weekly Report",
              description: "Receive a summary of your restaurant's performance",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() =>
                  handlePreferenceChange(
                    item.key,
                    !preferences[item.key as keyof typeof preferences]
                  )
                }
                className={`relative inline-flex h-8 w-14 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  preferences[item.key as keyof typeof preferences]
                    ? "bg-orange-500 shadow-lg shadow-orange-200/50"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition ${
                    preferences[item.key as keyof typeof preferences]
                      ? "translate-x-7"
                      : "translate-x-0"
                  }`}
                ></span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">
            <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Security Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Change your password and manage security
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={security.showCurrentPassword ? "text" : "password"}
                value={security.currentPassword}
                onChange={(e) =>
                  handleSecurityChange("currentPassword", e.target.value)
                }
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
              />
              <button
                onClick={() =>
                  handleSecurityChange(
                    "showCurrentPassword",
                    !security.showCurrentPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {security.showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={security.showNewPassword ? "text" : "password"}
                  value={security.newPassword}
                  onChange={(e) =>
                    handleSecurityChange("newPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
                />
                <button
                  onClick={() =>
                    handleSecurityChange(
                      "showNewPassword",
                      !security.showNewPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {security.showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={security.showConfirmPassword ? "text" : "password"}
                  value={security.confirmPassword}
                  onChange={(e) =>
                    handleSecurityChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200 font-medium"
                />
                <button
                  onClick={() =>
                    handleSecurityChange(
                      "showConfirmPassword",
                      !security.showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {security.showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={
              saveStatus === "saving" ||
              !security.currentPassword ||
              !security.newPassword ||
              !security.confirmPassword
            }
            className="flex items-center justify-center gap-2 px-8 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:bg-red-600 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="w-5 h-5" />
            {saveStatus === "saving" ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
            <Sun className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Appearance
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customize how the interface looks
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              Dark Mode
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enable dark theme for comfortable viewing
            </p>
          </div>
          <button className="relative inline-flex h-8 w-14 flex-shrink-0 rounded-full border-2 border-transparent transition-colors bg-orange-500 shadow-lg shadow-orange-200/50">
            <span className="inline-block h-7 w-7 transform rounded-full bg-white shadow-lg translate-x-7"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
