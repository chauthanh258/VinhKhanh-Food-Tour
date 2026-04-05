"use client";

import React from "react";
import {
  Users,
  QrCode,
  Star,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Utensils,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

const stats = [
  { label: "Total Views", value: "12,450", change: 12.5, icon: Eye, color: "blue" },
  { label: "QR Scans", value: "3,240", change: 8.2, icon: QrCode, color: "orange" },
  { label: "Avg Rating", value: "4.8", change: 0.3, icon: Star, color: "yellow" },
  { label: "Total Reviews", value: "842", change: -2.4, icon: Users, color: "green" },
];

const chartData = [
  { name: "Mon", views: 4000, scans: 2400 },
  { name: "Tue", views: 3000, scans: 1398 },
  { name: "Wed", views: 2000, scans: 9800 },
  { name: "Thu", views: 2780, scans: 3908 },
  { name: "Fri", views: 1890, scans: 4800 },
  { name: "Sat", views: 2390, scans: 3800 },
  { name: "Sun", views: 3490, scans: 4300 },
];

const mockActivities = [
  {
    id: 1,
    type: "review",
    message: "New review from Sarah M.",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    type: "qr",
    message: "QR code scanned 15 times",
    timestamp: "5 minutes ago",
  },
  {
    id: 3,
    type: "menu",
    message: "Menu updated successfully",
    timestamp: "1 hour ago",
  },
  {
    id: 4,
    type: "qr",
    message: "QR code scanned 8 times",
    timestamp: "2 hours ago",
  },
];

export default function OwnerDashboard() {
  const { user } = useUserStore();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.fullName?.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your restaurants today.
          </p>
        </div>
        <Link
          href="/owner/poi"
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          Add New POI
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`
                  p-3 rounded-xl transition-colors
                  ${stat.color === "blue" &&
                    "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20"}
                  ${stat.color === "orange" &&
                    "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20"}
                  ${stat.color === "yellow" &&
                    "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-500/20"}
                  ${stat.color === "green" &&
                    "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-500/20"
                  }
                `}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`
                  "flex items-center gap-1 text-sm font-medium
                  ${stat.change >= 0 ? "text-green-600" : "text-red-600"}
                `}
              >
                {stat.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Performance Overview
            </h2>
            <select className="bg-gray-50 dark:bg-gray-800 border-none text-sm font-medium rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-white">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <button className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-6">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 group cursor-pointer">
                <div
                  className={
                    `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${activity.type === "review" &&
                      "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-500/20"}
                    ${activity.type === "qr" &&
                      "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20"}
                    ${activity.type === "menu" &&
                      "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20"}
                  `}
                >
                  {activity.type === "review" && <Star className="w-5 h-5" />}
                  {activity.type === "qr" && <QrCode className="w-5 h-5" />}
                  {activity.type === "menu" && <Utensils className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {activity.timestamp}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-700 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-all self-center" />
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-100 dark:border-orange-500/20">
            <h3 className="text-sm font-bold text-orange-900 dark:text-orange-400">
              Pro Tip
            </h3>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-2 leading-relaxed">
              Updating your menu specialties can increase QR scans by up to 25%.
              Try adding high-quality photos!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
