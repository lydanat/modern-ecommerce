import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/views/HeroSection";
import ProductPreview from "@/components/views/ProductPreview";
import ContactCard from "@/components/views/ContactCard";
import Footer from "@/components/layout/footer/Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection/>
      <ProductPreview />
      <ContactCard />
      <Footer />
    </main>
  );
}