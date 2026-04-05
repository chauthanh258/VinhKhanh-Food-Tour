"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Image as ImageIcon,
  Trash2,
  Eye,
  Upload,
  FileText,
  Music,
  MoreVertical,
  Download,
  CheckCircle2,
  FolderPlus,
  X,
  File,
  Info,
  ChevronRight,
} from "lucide-react";
import { Modal } from "../../components/Modal";

const mediaItems = [
  {
    id: "1",
    type: "image",
    name: "Restaurant Front.jpg",
    size: "2.4 MB",
    date: "Oct 12, 2024",
    url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400",
    dimensions: "1920x1080",
    format: "JPG",
  },
  {
    id: "2",
    type: "image",
    name: "Special Pho.jpg",
    size: "1.8 MB",
    date: "Oct 14, 2024",
    url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400",
    dimensions: "1200x800",
    format: "JPG",
  },
  {
    id: "3",
    type: "audio",
    name: "Restaurant Intro.mp3",
    size: "4.2 MB",
    date: "Oct 15, 2024",
    url: null,
    duration: "03:45",
    format: "MP3",
  },
  {
    id: "4",
    type: "image",
    name: "Interior View.jpg",
    size: "3.1 MB",
    date: "Oct 18, 2024",
    url: "https://images.unsplash.com/photo-1600454021970-351eff4a6554?auto=format&fit=crop&q=80&w=400",
    dimensions: "2048x1365",
    format: "JPG",
  },
];

export default function MediaLibrary() {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"folder" | "upload" | "view" | "delete">(
    "upload"
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleOpenModal = (
    mode: "folder" | "upload" | "view" | "delete",
    item?: any
  ) => {
    setModalMode(mode);
    setSelectedItem(item || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Media Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your images, videos, and audio descriptions.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleOpenModal("folder")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-xl font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <FolderPlus className="w-5 h-5" />
            New Folder
          </button>
          <button
            onClick={() => handleOpenModal("upload")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 dark:shadow-orange-900/20 hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Upload className="w-5 h-5" />
            Upload Media
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => handleOpenModal("upload")}
        className="bg-white dark:bg-gray-900 p-10 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-4 hover:border-orange-300 dark:hover:border-orange-500/50 hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-all group cursor-pointer"
      >
        <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-all shadow-sm">
          <Upload className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900 dark:text-white text-lg">
            Drag & drop your files here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Support JPG, PNG, MP3 (Max 10MB)
          </p>
        </div>
        <button className="mt-2 px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
          Browse Files
        </button>
      </div>

      {/* Media Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-xl w-full md:w-fit overflow-x-auto">
          {["all", "images", "audio", "videos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap capitalize ${
                activeTab === tab
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search media..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-300"
            />
          </div>
          <button className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="relative h-44 bg-gray-50 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
              {item.type === "image" ? (
                <img
                  src={item.url || ""}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Music className="w-8 h-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleOpenModal("view", item)}
                  className="p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl hover:bg-orange-500 hover:text-white transition-all hover:scale-110"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl hover:bg-orange-500 hover:text-white transition-all hover:scale-110">
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleOpenModal("delete", item)}
                  className="p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl hover:bg-red-500 hover:text-white transition-all hover:scale-110"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-orange-600 transition-colors">
                  {item.name}
                </p>
                <button className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium">{item.size}</p>
                <p className="text-xs text-gray-400 font-medium">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === "folder"
            ? "Create New Folder"
            : modalMode === "upload"
              ? "Upload Media"
              : modalMode === "view"
                ? "Media Details"
                : "Delete Media"
        }
        size={modalMode === "view" ? "lg" : "sm"}
        footer={
          modalMode === "delete" ? (
            <>
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all">
                Delete
              </button>
            </>
          ) : modalMode === "folder" ? (
            <>
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
                Create Folder
              </button>
            </>
          ) : modalMode === "upload" ? (
            <>
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
                Upload
              </button>
            </>
          ) : (
            <button
              onClick={handleCloseModal}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Close
            </button>
          )
        }
      >
        {modalMode === "delete" ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                "{selectedItem?.name}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        ) : modalMode === "folder" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Folder Name
              </label>
              <input
                type="text"
                placeholder="Enter folder name"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none mt-2"
              />
            </div>
          </div>
        ) : modalMode === "upload" ? (
          <div className="space-y-6">
            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-all group cursor-pointer"
            >
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-all">
                <Upload className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, MP3 up to 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedItem?.type === "image" && (
              <div className="aspect-video rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  File Name
                </p>
                <p className="text-gray-900 dark:text-white font-semibold mt-1">
                  {selectedItem?.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  File Size
                </p>
                <p className="text-gray-900 dark:text-white font-semibold mt-1">
                  {selectedItem?.size}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  Type
                </p>
                <p className="text-gray-900 dark:text-white font-semibold mt-1">
                  {selectedItem?.format}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  Uploaded
                </p>
                <p className="text-gray-900 dark:text-white font-semibold mt-1">
                  {selectedItem?.date}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
