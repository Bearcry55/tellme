"use client";
//this is the home page 
import "./globals.css";
import { useState, useRef } from "react";
import SkylineCatalog from "../components/Catalog";
import ProposalForm from "../components/ProposalForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [templateId, setTemplateId] = useState("pleading-cats-02");

  const catalogSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen text-[#2C2C2C] selection:bg-[#FFC8DD] overflow-hidden bg-[#FFF5F7] flex flex-col justify-between">
      
      <div>
        {/* ── HERO SECTION ── */}
        <div className="theme-hero relative z-10 overflow-hidden">
          
          {/* Global Navbar Component */}
          <Navbar onExploreClick={() => scrollToRef(catalogSectionRef)} />

          <section className="max-w-4xl mx-auto px-6 pt-20 pb-36 text-center flex flex-col items-center justify-center min-h-[70vh] relative z-30">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#2C2C2C] leading-[1.1]">
              Turn a question <br /> into a MEMORY
            </h1>
            <p className="text-lg sm:text-xl font-medium text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Create beautifully structured, highly interactive custom web links to express deep feelings and ask your human anything.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full relative z-50">
              <button onClick={() => scrollToRef(catalogSectionRef)} className="premium-btn w-full sm:w-auto">Explore Templates</button>
              <button onClick={() => scrollToRef(formSectionRef)} className="premium-btn-secondary w-full sm:w-auto">Create Instant Link</button>
            </div>
          </section>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-[#111111]">
              <path d="M1200,0 L0,105 L0,120 L1200,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* ── INTERACTIVE CATALOG COMPONENT ── */}
        <div ref={catalogSectionRef}>
          <SkylineCatalog 
            templateId={templateId} 
            setTemplateId={setTemplateId} 
            scrollToForm={() => scrollToRef(formSectionRef)} 
          />
        </div>

        {/* ── CONFIGURATION FORM COMPONENT ── */}
        <div ref={formSectionRef}>
          <ProposalForm 
            templateId={templateId} 
            scrollToCatalog={() => scrollToRef(catalogSectionRef)} 
          />
        </div>
      </div>

      {/* Global Footer Component placed perfectly at the bottom layout grid boundary */}
      <div className="px-6 pb-6 bg-[#BDE0FE]">
        <Footer />
      </div>

    </div>
  );
}