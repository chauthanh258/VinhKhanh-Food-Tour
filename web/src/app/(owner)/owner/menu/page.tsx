"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Utensils,
  Coffee,
  IceCream,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Upload,
  Eye,
  X,
} from "lucide-react";
import { Modal } from "../../components/Modal";

const categories = [
  { id: "all", label: "All Items", icon: Utensils },
  { id: "food", label: "Food", icon: Utensils },
  { id: "drink", label: "Drinks", icon: Coffee },
  { id: "dessert", label: "Desserts", icon: IceCream },
];

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  description: string;
  imageUrl?: string;
}

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Pho Bo",
    category: "food",
    price: 45000,
    isAvailable: true,
    description: "Traditional beef noodle soup",
    imageUrl:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    name: "Spring Rolls",
    category: "food",
    price: 35000,
    isAvailable: true,
    description: "Crispy rolls with fresh herbs",
    imageUrl:
      "https://images.unsplash.com/photo-1599599810694-b5ac4dd53c4f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "3",
    name: "Iced Coffee",
    category: "drink",
    price: 25000,
    isAvailable: true,
    description: "Vietnamese iced coffee with condensed milk",
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "4",
    name: "Mango Sticky Rice",
    category: "dessert",
    price: 35000,
    isAvailable: false,
    description: "Sweet mango with sticky rice",
    imageUrl:
      "https://images.unsplash.com/photo-1585518419759-47c2d4f9af1d?auto=format&fit=crop&q=80&w=400",
  },
];

export default function MenuManagement() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">(
    "add"
  );
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleOpenModal = (
    mode: "add" | "edit" | "view" | "delete",
    item?: MenuItem
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
            Menu Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your food items, prices, and availability.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal("add")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 dark:shadow-orange-900/20 hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm w-fit overflow-x-auto transition-colors">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={
              `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap
              ${
                activeCategory === cat.id
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }
            `}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.imageUrl || ""}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleOpenModal("edit", item)}
                  className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 rounded-xl shadow-sm transition-all hover:scale-110"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenModal("view", item)}
                  className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 rounded-xl shadow-sm transition-all hover:scale-110"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenModal("delete", item)}
                  className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-red-500 rounded-xl shadow-sm transition-all hover:scale-110"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div
                className={`
                absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20
                ${
                  item.isAvailable
                    ? "bg-green-500/80 text-white"
                    : "bg-red-500/80 text-white"
                }
              `}
              >
                {item.isAvailable ? "Available" : "Sold Out"}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug group-hover:text-orange-600 transition-colors">
                  {item.name}
                </h3>
                <span className="text-orange-600 dark:text-orange-500 font-bold whitespace-nowrap">
                  ₫{item.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-6">
                {item.description}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {item.category === "food" && (
                    <Utensils className="w-3 h-3" />
                  )}
                  {item.category === "drink" && <Coffee className="w-3 h-3" />}
                  {item.category === "dessert" && (
                    <IceCream className="w-3 h-3" />
                  )}
                  {item.category}
                </div>
                <button
                  className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    item.isAvailable
                      ? "text-green-600 hover:text-green-700"
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  {item.isAvailable ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Toggle Status
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-all group min-h-[350px]"
        >
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:scale-110 transition-all shadow-sm">
            <Plus className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900 dark:text-white">
              Add New Item
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a new menu entry
            </p>
          </div>
        </button>
      </div>

      {/* Menu Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === "add"
            ? "Add Menu Item"
            : modalMode === "edit"
              ? "Edit Menu Item"
              : modalMode === "view"
                ? "Menu Item Details"
                : "Delete Menu Item"
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
                Save Item
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
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Item Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedItem?.name}
                  disabled={modalMode === "view"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                  placeholder="Enter item name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Price (VND)
                </label>
                <input
                  type="number"
                  defaultValue={selectedItem?.price || ""}
                  disabled={modalMode === "view"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                  placeholder="e.g. 85000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  defaultValue={selectedItem?.category || "food"}
                  disabled={modalMode === "view"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                >
                  <option value="food">Food</option>
                  <option value="drink">Drink</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Availability
                </label>
                <select
                  defaultValue={
                    selectedItem?.isAvailable ? "true" : "false"
                  }
                  disabled={modalMode === "view"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60"
                >
                  <option value="true">Available</option>
                  <option value="false">Sold Out</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows={3}
                defaultValue={selectedItem?.description || ""}
                disabled={modalMode === "view"}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-60 resize-none"
                placeholder="Describe this dish..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Food Image
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {selectedItem?.imageUrl && (
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 group">
                    <img
                      src={selectedItem.imageUrl}
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
