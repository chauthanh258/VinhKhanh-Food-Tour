"use client";

import React, { useState, useCallback, useEffect } from "react";
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

interface POIItem {
  id: string;
  name: string;
  address?: string;
  specialties?: string;
  lat: number;
  lng: number;
  rating: number;
  isActive: boolean;
  translations?: Array<{
    name: string;
    description?: string;
    specialties?: string;
    imageUrl?: string;
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
    description: "",
    lat: 0,
    lng: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const selectedPosition: [number, number] =
    formData.lat !== 0 || formData.lng !== 0
      ? [formData.lat, formData.lng]
      : defaultMapCenter;

  useEffect(() => {
    if (!mapInstance || modalMode === "view") return;

    const handleMapClick = (event: any) => {
      const { lat, lng } = event.latlng;
      setFormData((prev) => ({ ...prev, lat, lng }));
    };

    mapInstance.on("click", handleMapClick);
    return () => {
      mapInstance.off("click", handleMapClick);
    };
  }, [mapInstance, modalMode]);

  // Fetch POIs
  const fetchPOIs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/pois/owner/list?search=${searchQuery}&status=${statusFilter}&page=${currentPage}&limit=10`
      );
      if (response.success) {
        setPois(
          response.data.data.map((poi: any) => ({
            ...poi,
            name: poi.translations?.[0]?.name || "Unnamed POI",
            address: poi.translations?.[0]?.description || "",
            specialties: poi.translations?.[0]?.specialties || "",
            description: poi.translations?.[0]?.description || "",
          }))
        );
        setPagination({
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
          limit: response.data.pagination.limit,
        });
      }
    } catch (error) {
      console.error("Failed to fetch POIs:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, currentPage]);

  useEffect(() => {
    fetchPOIs();
  }, [fetchPOIs]);

  const handleOpenModal = (mode: "add" | "edit" | "view" | "delete", poi?: POIItem) => {
    setModalMode(mode);
    if (poi) {
      setSelectedPoi(poi);
      setFormData({
        name: poi.name,
        address: poi.address || "",
        specialties: poi.translations?.[0]?.specialties || "",
        description: poi.translations?.[0]?.description || "",
        lat: poi.lat,
        lng: poi.lng,
      });
    } else {
      setSelectedPoi(null);
      setFormData({ name: "", address: "", specialties: "", description: "", lat: 0, lng: 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPoi(null);
    setFormData({ name: "", address: "", specialties: "", description: "", lat: 0, lng: 0 });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter POI name");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        translations: [
          {
            name: formData.name,
            description: formData.description,
            specialties: formData.specialties,
            language: "vi",
          },
        ],
      };

      if (modalMode === "add") {
        await api.post("/pois", payload);
      } else if (modalMode === "edit" && selectedPoi) {
        await api.put(`/pois/${selectedPoi.id}`, payload);
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Location (click on map to choose)
              </label>
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <MapContainer
                  ref={(map) => {
                    if (map) setMapInstance(map);
                  }}
                  key={`${modalMode}-${selectedPosition[0]}-${selectedPosition[1]}`}
                  center={selectedPosition}
                  zoom={15}
                  style={{ height: 260, width: "100%" }}
                  scrollWheelZoom={modalMode !== "view"}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selected: {selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Latitude
                </label>
                <input
                  type="text"
                  value={selectedPosition[0].toFixed(6)}
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
                  value={selectedPosition[1].toFixed(6)}
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
          </div>
        )}
      </Modal>
    </div>
  );
}
