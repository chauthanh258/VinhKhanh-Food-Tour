"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Eye,
  Trash2,
  MapPin,
  Star,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Upload,
  X,
} from "lucide-react";
import { Modal } from "../../components/Modal";

interface POIItem {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  isActive: boolean;
  specialties: string;
  description: string;
  imageUrl?: string;
}

const mockPOIs: POIItem[] = [
  {
    id: "1",
    name: "PHO Vietnam Restaurant",
    address: "123 Nguyen Hue, District 1",
    rating: 4.8,
    reviews: 245,
    isActive: true,
    specialties: "Beef Pho, Spring Rolls",
    description: "Traditional Vietnamese pho restaurant",
    imageUrl:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    name: "Banh Mi Stand",
    address: "456 Tran Hung Dao, District 1",
    rating: 4.6,
    reviews: 189,
    isActive: true,
    specialties: "Banh Mi, Vietnamese Sandwiches",
    description: "Street food banh mi specialties",
    imageUrl:
      "https://images.unsplash.com/photo-1599599810694-5ac3c6f66ff7?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "3",
    name: "Coffee Corner",
    address: "789 Hai Ba Trung, District 1",
    rating: 4.5,
    reviews: 156,
    isActive: false,
    specialties: "Vietnamese Coffee, Desserts",
    description: "Cozy coffee shop with desserts",
    imageUrl:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=400",
  },
];

export default function POIManagement() {
  const [pois, setPois] = useState(mockPOIs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">(
    "add"
  );
  const [selectedPoi, setSelectedPoi] = useState<POIItem | null>(null);

  const toggleStatus = (id: string) => {
    setPois((prev) =>
      prev.map((poi) =>
        poi.id === id ? { ...poi, isActive: !poi.isActive } : poi
      )
    );
  };

  const handleOpenModal = (
    mode: "add" | "edit" | "view" | "delete",
    poi?: POIItem
  ) => {
    setModalMode(mode);
    setSelectedPoi(poi || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPoi(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            POI Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your restaurant locations and their visibility.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal("add")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 dark:shadow-orange-900/20 hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          Add New POI
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or address..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <select className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium rounded-xl border-none focus:ring-2 focus:ring-orange-500/20 outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Hidden</option>
          </select>
        </div>
      </div>

      {/* POI Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pois.map((poi) => (
                <tr
                  key={poi.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                        <img
                          src={poi.imageUrl || ""}
                          alt={poi.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {poi.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {poi.specialties}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{poi.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {poi.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => toggleStatus(poi.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        poi.isActive
                          ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 hover:bg-green-100"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {poi.isActive ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                      {poi.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal("edit", poi)}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal("view", poi)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal("delete", poi)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1"></div>
                      <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POI Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === "add"
            ? "Add New POI"
            : modalMode === "edit"
              ? "Edit POI"
              : modalMode === "view"
                ? "POI Details"
                : "Delete POI"
        }
        size={modalMode === "delete" ? "sm" : "lg"}
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
          ) : modalMode !== "view" ? (
            <>
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
                Save Changes
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
                "{selectedPoi?.name}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedPoi?.name}
                  disabled={modalMode === "view"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                  placeholder="Enter restaurant name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Specialty Dishes
                </label>
                <input
                  type="text"
                  defaultValue={selectedPoi?.specialties || ""}
                  disabled={modalMode === "view"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                  placeholder="e.g. Beef Pho, Spring Rolls"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  defaultValue={selectedPoi?.address || ""}
                  disabled={modalMode === "view"}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                  placeholder="Enter full address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows={4}
                defaultValue={selectedPoi?.description || ""}
                disabled={modalMode === "view"}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60 resize-none"
                placeholder="Tell us about your restaurant..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Restaurant Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {selectedPoi?.imageUrl && (
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 group">
                    <img
                      src={selectedPoi.imageUrl}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {modalMode !== "view" && (
                      <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                {modalMode !== "view" && (
                  <button className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-all">
                    <Upload className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">
                      Upload
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
                  