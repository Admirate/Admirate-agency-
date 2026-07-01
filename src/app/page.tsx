import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WorkSection from "@/components/sections/WorkSection";
import SocialCreativesSection from "@/components/sections/SocialCreativesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import CountersSection from "@/components/sections/CountersSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ClientsSection from "@/components/sections/ClientsSection";
import CtaSection from "@/components/sections/CtaSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <WorkSection />
        <SocialCreativesSection />
        <ProcessSection />
        <CountersSection />
        <TestimonialsSection />
        <ClientsSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
