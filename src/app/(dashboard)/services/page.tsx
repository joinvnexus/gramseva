"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types";
import ServiceCard from "@/components/services/ServiceCard";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Loader from '@/components/common/Loader';
import ServiceFilter from '@/components/services/ServiceFilter';

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
