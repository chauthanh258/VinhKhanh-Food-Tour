"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  QrCode,
  Download,
  Printer,
  Share2,
  ExternalLink,
  Copy,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const mockPOIs = [
  {
    id: "1",
    name: "PHO Vietnam Restaurant",
    imageUrl:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    name: "Banh Mi Stand",
    imageUrl:
      "https://images.unsplash.com/photo-1599599810694-5ac3c6f66ff7?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "3",
    name: "Coffee Corner",
    imageUrl:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=400",
  },
];

export default function QRCodePage() {
  const [selectedPoi, setSelectedPoi] = useState(mockPOIs[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            QR Code Generation
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Generate and manage QR codes for your restaurant pages.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0">
          <RefreshCw className="w-5 h-5" />
          Regenerate All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* POI List */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Select Restaurant
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {mockPOIs.length} Total
            </span>
          </div>
          <div className="space-y-3">
            {mockPOIs.map((poi) => (
              <button
                key={poi.id}
                onClick={() => setSelectedPoi(poi)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                  selectedPoi.id === poi.id
                    ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 shadow-sm"
                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 hover:border-orange-100 dark:hover:border-orange-500/20 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
                  <img
                    src={poi.imageUrl || ""}
                    alt={poi.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left min-w-0">
                  <p
                    className={`font-bold text-sm truncate transition-colors ${
                      selectedPoi.id === poi.id
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {poi.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    District 1, HCMC
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* QR Preview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-500/5 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="relative w-64 h-64 bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-xl border border-gray-50 dark:border-gray-800 flex items-center justify-center">
                <div className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://foodtour.app/poi/${selectedPoi.id}`}
                    alt="QR Code"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedPoi.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                This QR code links directly to your restaurant's public profile
                page where customers can view your menu and specialties.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10 w-full max-w-lg">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <Download className="w-5 h-5" />
                Download PNG
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <Printer className="w-5 h-5" />
                Print PDF
              </button>
            </div>
          </div>

          {/* Share & Link */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Direct Link & Sharing
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  readOnly
                  value={`https://foodtour.app/poi/${selectedPoi.id}`}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
