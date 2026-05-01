"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/views/HeroSection";
import ProductPreview from "@/components/views/ProductPreview";
import ContactCard from "@/components/views/ContactCard";
import Footer from "@/components/layout/footer/Footer";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search name, type, price..."
      />
      {!searchQuery.trim() && <HeroSection />}
      <ProductPreview
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
      />
      <ContactCard />
      <Footer />
    </main>
  );
}