"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Search,
  Filter,
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
  Loader,
} from "lucide-react";
import { Modal } from "../../components/Modal";
import { api } from "@/lib/api";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";

const ASSET_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
  /\/api\/?$/,
  ""
);

function normalizePoiImageUrl(url?: string) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Fix common misconfiguration where URLs are saved as .../api/img_modules/...
  const withoutApi = trimmed.replace("/api/img_modules/", "/img_modules/");

  // If the URL is relative to backend static, make it absolute so Next.js can load it.
  if (withoutApi.startsWith("/img_modules/")) {
    return `${ASSET_BASE_URL}${withoutApi}`;
  }

  return withoutApi;
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const PoiMiniMapSync = dynamic(() => import("./PoiMiniMapSync"), { ssr: false });

interface POIItem {
  id: string;
  name: string;
  address?: string;
  specialties?: string;
  priceRange?: string;
  lat: number;
  lng: number;
  rating: number;
  isActive: boolean;
  translations?: Array<{
    name: string;
    description?: string;
    specialties?: string;
    priceRange?: string;
    imageUrl?: string;
    audioUrl?: string;
  }>;
}

export default function POIManagement() {
  const defaultMapCenter: [number, number] = [10.7769, 106.7009];
  const [pois, setPois] = useState<POIItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, limit: 10 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedPoi, setSelectedPoi] = useState<POIItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    specialties: "",
    priceRange: "",
    description: "",
    imageUrl: "",
    lat: 0,
    lng: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const hasSelectedPosition = formData.lat !== 0 || formData.lng !== 0;
  const selectedPosition: [number, number] | null = hasSelectedPosition
    ? [formData.lat, formData.lng]
    : null;

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!isModalOpen || modalMode === "delete" || !mapInstance || !selectedPosition) return;

    const center: [number, number] = selectedPosition;
    const applyMapLayout = () => {
      mapInstance.invalidateSize();
      const targetZoom = Math.max(mapInstance.getZoom(), 15);
      mapInstance.setView(center, targetZoom, { animate: false });
    };

    const timers = [0, 120, 300].map((delay) =>
      window.setTimeout(applyMapLayout, delay)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [isModalOpen, modalMode, mapInstance, selectedPosition]);

  // Fetch POIs
  const fetchPOIs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/pois/owner/list?search=${searchQuery}&status=${statusFilter}&page=${currentPage}&limit=10`
      );
      setPois(
        response.data.data.map((poi: any) => ({
          ...poi,
          name: poi.translations?.[0]?.name || "Unnamed POI",
          address: poi.translations?.[0]?.description || "",
          specialties: poi.translations?.[0]?.specialties || "",
          priceRange: poi.translations?.[0]?.priceRange || "",
          description: poi.translations?.[0]?.description || "",
          translations: poi.translations?.length
            ? [
                {
                  ...poi.translations[0],
                  imageUrl: normalizePoiImageUrl(poi.translations[0]?.imageUrl),
                  audioUrl: poi.translations[0]?.audioUrl,
                },
                ...poi.translations.slice(1),
              ]
            : poi.translations,
        }))
      );
      setPagination({
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        limit: response.data.pagination.limit,
      });
    } catch (error) {
      console.error("Failed to fetch POIs:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, currentPage]);

  useEffect(() => {
    fetchPOIs();
  }, [fetchPOIs]);

  const requestCurrentLocation = useCallback(() => {
    setIsResolvingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setIsResolvingLocation(false);
      setLocationError("Browser does not support geolocation. Please pick a location on the map.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));
        setIsResolvingLocation(false);
      },
      () => {
        // Do not force default coordinates as selected location when GPS fails.
        setFormData((prev) => ({
          ...prev,
          lat: 0,
          lng: 0,
        }));
        setIsResolvingLocation(false);
        setLocationError("Cannot get current location. Please allow location permission or pick on map.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  const handleOpenModal = (mode: "add" | "edit" | "view" | "delete", poi?: POIItem) => {
    setModalMode(mode);
    setMapInstance(null);
    setLocationError("");
    if (poi) {
      setIsResolvingLocation(false);
      setSelectedPoi(poi);
      const normalizedImageUrl = normalizePoiImageUrl(poi.translations?.[0]?.imageUrl);
      setFormData({
        name: poi.name,
        address: poi.address || "",
        specialties: poi.translations?.[0]?.specialties || "",
        priceRange: poi.translations?.[0]?.priceRange || "",
        description: poi.translations?.[0]?.description || "",
        imageUrl: normalizedImageUrl,
        lat: poi.lat,
        lng: poi.lng,
      });
      setImagePreview(normalizedImageUrl);
      setImageFile(null);
      setAudioFile(null);
    } else {
      setSelectedPoi(null);
      const emptyForm = { name: "", address: "", specialties: "", priceRange: "", description: "", imageUrl: "", lat: 0, lng: 0 };
      setFormData(emptyForm);
      setImagePreview("");
      setImageFile(null);
      setAudioFile(null);

      if (mode === "add") {
        requestCurrentLocation();
      } else {
        setFormData({ ...emptyForm, lat: defaultMapCenter[0], lng: defaultMapCenter[1] });
        setIsResolvingLocation(false);
      }
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMapInstance(null);
    setIsResolvingLocation(false);
    setLocationError("");
    setSelectedPoi(null);
    setFormData({ name: "", address: "", specialties: "", priceRange: "", description: "", imageUrl: "", lat: 0, lng: 0 });
    setImagePreview("");
    setImageFile(null);
    setAudioFile(null);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter POI name");
      return;
    }

    if (!hasSelectedPosition) {
      alert("Please select a valid location before saving.");
      return;
    }

    try {
      setIsSubmitting(true);
      const imageUrl = formData.imageUrl.trim() || undefined;

      const payload = {
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        translations: [
          {
            name: formData.name,
            description: formData.description,
            specialties: formData.specialties,
            priceRange: formData.priceRange.trim() || undefined,
            imageUrl,
            language: "vi",
          },
        ],
      };

      let poiId = selectedPoi?.id;

      if (modalMode === "add") {
        const response = await api.post("/pois", payload);
        poiId = response.data?.id;
      } else if (modalMode === "edit" && poiId) {
        await api.put(`/pois/${poiId}`, payload);
      }

      if (poiId && (imageFile || audioFile)) {
        const mediaFormData = new FormData();
        if (imageFile) mediaFormData.append("image", imageFile);
        if (audioFile) mediaFormData.append("audio", audioFile);
        await api.post(`/pois/${poiId}/media`, mediaFormData);
      }

      handleCloseModal();
      setCurrentPage(1);
      fetchPOIs();
    } catch (error) {
      console.error("Failed to save POI:", error);
      alert("Failed to save POI. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPoi) return;

    try {
      setIsSubmitting(true);
      await api.delete(`/pois/${selectedPoi.id}`);
      handleCloseModal();
      fetchPOIs();
    } catch (error) {
      console.error("Failed to delete POI:", error);
      alert("Failed to delete POI. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/pois/${id}`, { isActive: !currentStatus });
      fetchPOIs();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const statusLabelMap: Record<typeof statusFilter, string> = {
    all: "All Status",
    active: "Active",
    hidden: "Hidden",
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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-600 dark:text-gray-200"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            {statusLabelMap[statusFilter]}
          </button>

          {isFilterMenuOpen && (
            <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-2">
              {([
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "hidden", label: "Hidden" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setCurrentPage(1);
                    setIsFilterMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    statusFilter === option.value
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POI Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        )}

        {!loading && pois.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No POIs found</p>
          </div>
        )}

        {!loading && pois.length > 0 && (
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
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {poi.translations?.[0]?.imageUrl ? (
                            <img
                              src={poi.translations[0].imageUrl}
                              alt={poi.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <MapPin className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {poi.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {poi.specialties || "No specialties"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {poi.lat.toFixed(4)}, {poi.lng.toFixed(4)}
                        </span>
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
                        onClick={() => toggleStatus(poi.id, poi.isActive)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, pagination.total)} of {pagination.total} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
                disabled={isSubmitting}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </>
          ) : modalMode !== "view" ? (
            <>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  disabled={modalMode === "view"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                  placeholder="e.g. Beef Pho, Spring Rolls"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Price Range
                </label>
                <input
                  type="text"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  disabled={modalMode === "view"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                  placeholder="Ví dụ: 30.000đ - 120.000đ"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Location (click on map to choose)
              </label>
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                {modalMode === "add" && isResolvingLocation && !selectedPosition ? (
                  <div className="h-[260px] flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                    <Loader className="w-4 h-4 animate-spin" />
                    Detecting your current location...
                  </div>
                ) : selectedPosition ? (
                  <MapContainer
                    key={modalMode}
                    center={selectedPosition}
                    zoom={15}
                    style={{ height: 260, width: "100%" }}
                    scrollWheelZoom={modalMode !== "view"}
                    ref={(map) => {
                      if (!map) return;
                      setMapInstance(map);
                      map.invalidateSize();
                      const targetZoom = Math.max(map.getZoom(), 15);
                      map.setView(selectedPosition, targetZoom, { animate: false });
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <PoiMiniMapSync
                      center={selectedPosition}
                      editable={modalMode !== "view"}
                      onPick={(lat, lng) => setFormData((prev) => ({ ...prev, lat, lng }))}
                    />
                    <CircleMarker
                      center={selectedPosition}
                      radius={10}
                      pathOptions={{
                        color: "#f97316",
                        weight: 2,
                        fillColor: "#fb923c",
                        fillOpacity: 0.9,
                      }}
                    />
                  </MapContainer>
                ) : (
                  <div className="h-[260px] flex flex-col items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 text-center">
                    <p>Current location is unavailable.</p>
                    {modalMode === "add" && (
                      <button
                        type="button"
                        onClick={requestCurrentLocation}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                      >
                        Retry current location
                      </button>
                    )}
                  </div>
                )}
              </div>
              {locationError && (
                <p className="text-xs text-red-500">{locationError}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selected: {selectedPosition ? `${selectedPosition[0].toFixed(6)}, ${selectedPosition[1].toFixed(6)}` : "--"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Latitude
                </label>
                <input
                  type="text"
                  value={selectedPosition ? selectedPosition[0].toFixed(6) : "--"}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-gray-700 dark:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Longitude
                </label>
                <input
                  type="text"
                  value={selectedPosition ? selectedPosition[1].toFixed(6) : "--"}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-gray-700 dark:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={modalMode === "view"}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60 resize-none"
                placeholder="Tell us about your restaurant..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  POI Image
                </label>
                <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-4 bg-gray-50/60 dark:bg-gray-800/40 space-y-3">
                  <div className="h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    {(imagePreview || formData.imageUrl) ? (
                      <img
                        src={imagePreview || formData.imageUrl}
                        alt="POI preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">No image selected</span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={modalMode === "view"}
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={modalMode === "view"}
                    className="w-full py-2 px-4 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-60"
                  >
                    {imagePreview || formData.imageUrl ? "Change Image" : "Choose Image"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Narration Audio
                </label>
                <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-4 bg-gray-50/60 dark:bg-gray-800/40 space-y-3">
                  <div className="h-40 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-center px-4">
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200 break-all line-clamp-2">
                        {audioFile ? audioFile.name : selectedPoi?.translations?.[0]?.audioUrl ? "Audio narration uploaded" : "No audio selected"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Upload an MP3, WAV, or M4A narration file.
                      </p>
                    </div>
                  </div>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    disabled={modalMode === "view"}
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={modalMode === "view"}
                    className="w-full py-2 px-4 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-60"
                  >
                    {audioFile || selectedPoi?.translations?.[0]?.audioUrl ? "Change Audio" : "Choose Audio"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}