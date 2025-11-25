import React, { useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { HeroSection } from "../components/home/HeroSection";
import { EarthSection } from "../components/home/EarthSection";
import { BentoGrid } from "../components/home/BentoGrid";
import { HowItWorks } from "../components/home/HowItWorks";
import { Testimonials } from "../components/home/Testimonials";
import { FeatureShowcase } from "../components/home/FeatureShowcase";

const Home = () => {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M64 0H0v64" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <BentoGrid />
        <Testimonials />
        <EarthSection />
        <HowItWorks />
        <FeatureShowcase />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
