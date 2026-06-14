import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import ClientsSection from "@/components/sections/ClientsSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WorkSection from "@/components/sections/WorkSection";
import CtaSection from "@/components/sections/CtaSection";
import ShowreelSection from "@/components/sections/ShowreelSection";
import ContentSection from "@/components/sections/ContentSection";
import CreationSection from "@/components/sections/CreationSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-white">
        <HeroSection />
        <ClientsSection />
        <AboutSection />
        <ServicesSection />
        <WorkSection />
        <CtaSection />
        <ShowreelSection />
        <ContentSection />
        <CreationSection />
        <ContactSection />
      </main>
    </>
  );
}
