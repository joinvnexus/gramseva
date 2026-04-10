"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types";
import ServiceCard from "@/components/services/ServiceCard";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import VoiceSearch from "@/components/common/VoiceSearch";

const categories = [
  { value: "ALL", label: "সব", icon: "📋" },
  { value: "ELECTRICIAN", label: "ইলেকট্রিশিয়ান", icon: "⚡" },
  { value: "PLUMBER", label: "মিস্ত্রি", icon: "🔧" },
  { value: "MECHANIC", label: "মেকানিক", icon: "🔨" },
  { value: "DOCTOR", label: "ডাক্তার", icon: "👨‍⚕️" },
  { value: "TUTOR", label: "টিউটর", icon: "📚" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

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
          <h1 className="text-2xl font-bold text-primary">সার্ভিস সমূহ</h1>
          <p className="text-gray-600 mt-1">
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
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* সার্চ বার */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="সার্ভিস বা নাম দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-3 top-2 text-gray-400">🔍</span>
            </div>
            <VoiceSearch
              onResult={(text) => {
                setSearchTerm(text);
                // অটো সার্চ
                fetchServices();
              }}
            />
          </div>

          {/* ক্যাটাগরি ফিল্টার */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === cat.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* সার্ভিস লিস্ট */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700">
            কোন সার্ভিস পাওয়া যায়নি
          </h3>
          <p className="text-gray-500 mt-2">
            অন্য ক্যাটাগরি বা কীওয়ার্ড দিয়ে চেষ্টা করুন
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
