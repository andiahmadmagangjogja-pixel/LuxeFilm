import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import ServicesSection from "@/components/landing/ServicesSection";
import PortfolioSection from "@/components/landing/PortfolioSection";
import CountdownPromo from "@/components/landing/CountdownPromo";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import WorkProcess from "@/components/landing/WorkProcess";
import FAQSection from "@/components/landing/FAQSection";
import ContactSection from "@/components/landing/ContactSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/landing/WhatsAppButton";
import AboutSection from "@/components/landing/AboutSections";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <WhyChooseUs />
      <ServicesSection />
      <PortfolioSection />
      <CountdownPromo />
      <PricingSection />
      <TestimonialsSection />
      <WorkProcess />
      <FAQSection />
      <ContactSection />
      <FinalCTA />
     
      <Footer />
      <WhatsAppButton />
      
    </div>
  );
};

export default Index;
