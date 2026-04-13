"use client";

import { useState, useEffect, useMemo } from "react";
import { Service } from "@/types";
import ServiceCard from "@/components/services/ServiceCard";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Loader from '@/components/common/Loader';
import ServiceFilter from '@/components/services/ServiceFilter';
import { List, Zap, Wrench, Hammer, Stethoscope, GraduationCap, SearchX, ArrowUpDown, LayoutGrid, Star } from 'lucide-react';

const categories = [
  { value: "ALL", label: "সব", icon: List },
  { value: "ELECTRICIAN", label: "ইলেকট্রিশিয়ান", icon: Zap },
  { value: "PLUMBER", label: "মিস্ত্রি", icon: Wrench },
  { value: "MECHANIC", label: "মেকানিক", icon: Hammer },
  { value: "DOCTOR", label: "ডাক্তার", icon: Stethoscope },
  { value: "TUTOR", label: "টিউটর", icon: GraduationCap },
];

type SortOption = "rating" | "price" | "name";
type ViewMode = "grid" | "list";

function SortSelect({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-primary"
    >
      <option value="rating">রেটিং</option>
      <option value="price">দাম (কম → বেশি)</option>
      <option value="name">নাম (A-Z)</option>
    </select>
  );
}

function RatingFilter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-primary"
      >
        <option value={0}>সব রেটিং</option>
        <option value={1}>১+ ⭐</option>
        <option value={2}>২+ ⭐</option>
        <option value={3}>৩+ ⭐</option>
        <option value={4}>৪+ ⭐</option>
        <option value={5}>৫ ⭐</option>
      </select>
    </div>
  );
}

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="flex border rounded-lg overflow-hidden dark:border-gray-600">
      <button
        onClick={() => onChange("grid")}
        className={`p-2 ${value === "grid" ? "bg-primary text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
        title="গ্রিড ভিউ"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-2 ${value === "list" ? "bg-primary text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
        title="লিস্ট ভিউ"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { user } = useAuth();

  const filteredAndSortedServices = useMemo(() => {
    let result = [...services];
    
    if (minRating > 0) {
      result = result.filter(s => (s.rating || 0) >= minRating);
    }
    
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price":
        result.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
        break;
      case "name":
        result.sort((a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""));
        break;
    }
    
    return result;
  }, [services, sortBy, minRating]);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchTerm]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "ALL")
        params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/services?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light">সার্ভিস সমূহ</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            আপনার এলাকার সার্ভিস প্রোভাইডারদের তালিকা
          </p>
        </div>
        {user?.role === "PROVIDER" && (
          <Link
            href="/services/new"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            + নতুন সার্ভিস যোগ করুন
          </Link>
        )}
      </div>

      {/* সার্চ ও ফিল্টার */}
      <ServiceFilter
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    />

      {/* <VoiceSearch />
        {/* ভয়েস সার্চ সেন্টার */}
        {/* <VoiceButton /> */} 

      {/* সার্ভিস লিস্ট */}
      {loading ? (
          <Loader />

      ) : services.length === 0 ? (
<div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            কোন সার্ভিস পাওয়া যায়নি
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            অন্য ক্যাটাগরি বা কীওয়ার্ড দিয়ে চেষ্টা করুন
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* টুলবার */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              মোট <span className="font-semibold text-primary dark:text-primary-light">{filteredAndSortedServices.length}</span> জন সার্ভিস পাওয়া গেছে
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>
              <RatingFilter value={minRating} onChange={setMinRating} />
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* সার্ভিস গ্রিড/লিস্ট */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredAndSortedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
