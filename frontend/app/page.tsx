"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Heart, Sparkles, Star, Smartphone, ShieldCheck, Send, Layers } from "lucide-react";

export default function Home() {
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [templateId, setTemplateId] = useState("pleading-cats-02");
  const [generatedLink, setGeneratedLink] = useState("");
  const [trackerLink, setTrackerLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareText, setShareText] = useState("Copy Proposal Link");
  const [trackText, setTrackText] = useState("Copy Secret Radar Key");

  const templatesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- Dynamic Tracking Config ---
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: senderName,
          receiver_name: receiverName,
          template_id: templateId,
          custom_question: customQuestion,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedLink(`http://localhost:3000/p/${data.proposal_id}`);
        setTrackerLink(`http://localhost:3000/track/${data.tracker_id}`);
        setShareText("Copy Proposal Link");
        setTrackText("Copy Secret Radar Key");
        setTimeout(() => scrollToSection(formRef), 100);
      } else {
        alert("Pipeline error: " + data.error);
      }
    } catch (error) {
      alert("Could not reach backend cloud server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (textToCopy: string, isShare: boolean) => {
    navigator.clipboard.writeText(textToCopy);
    if (isShare) {
      setShareText("Copied! ✨");
      setTimeout(() => setShareText("Copy Proposal Link"), 2000);
    } else {
      setTrackText("Key Copied! 🕶️");
      setTimeout(() => setTrackText("Copy Secret Radar Key"), 2000);
    }
  };

  return (
    <div className="relative min-h-screen text-[#2C2C2C] selection:bg-[#FFC8DD] overflow-hidden bg-[#FFF5F7]">
      


      {/* --- THEME 1: HERO CONTAINER --- */}
      <div className="theme-hero relative z-10">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
          <div className="flex items-center gap-2 cursor-pointer">
            <Heart className="w-6 h-6 text-[#FFAFCC] fill-[#FFAFCC]" />
            <span className="text-xl font-black tracking-tight text-[#2C2C2C]">Tell<span className="text-[#FFAFCC]">Me</span></span>
          </div>
          <button onClick={() => scrollToSection(templatesRef)} className="text-sm font-bold border-2 border-[#2C2C2C] px-4 py-2 rounded-xl bg-white shadow-[3px_3px_0px_#2C2C2C] hover:translate-y-[-1px] transition">
            Explore Strategies
          </button>
        </nav>

        <section className="max-w-4xl mx-auto px-6 pt-20 pb-36 text-center flex flex-col items-center justify-center min-h-[70vh] relative z-30">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#2C2C2C] leading-[1.1]">
            Turn a question <br /> into a MEMORY
          </h1>
          <p className="text-lg sm:text-xl font-medium text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
            Create beautifully structured, highly interactive custom web links to express deep feelings and ask your human anything.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full relative z-50">
            <button onClick={() => scrollToSection(templatesRef)} className="premium-btn w-full sm:w-auto">Explore Templates</button>
            <button onClick={() => scrollToSection(formRef)} className="premium-btn-secondary w-full sm:w-auto">Create Instant Link</button>
          </div>
        </section>

        {/* 🌊 Peak Wave Boundary: Hero -> Catalog */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-[#BDE0FE]">
            <path d="M1200,0 L0,105 L0,120 L1200,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* --- THEME 2: CATALOG SECTION --- */}
      <div ref={templatesRef} className="theme-catalog relative z-10 py-24 px-6 scroll-mt-2">
        <div className="max-w-6xl mx-auto relative z-30">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2C2C2C]">Interactive Strategies</h2>
            <p className="text-[#2C2C2C]/80 font-bold mt-3">The background tracking circles expand here to frame your layout styles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-30">
            {/* Strategy Card 1 */}
            <div 
              onClick={() => { setTemplateId("pleading-cats-02"); scrollToSection(formRef); }}
              className={`cursor-pointer solid-card p-8 flex flex-col justify-between h-80 transition-transform hover:-translate-y-2 bg-white ${templateId === "pleading-cats-02" ? "ring-4 ring-[#FFAFCC]" : ""}`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFC8DD] border-2 border-[#2C2C2C] flex items-center justify-center text-2xl mb-4 shadow-[2px_2px_0px_#2C2C2C]">🐱</div>
                <h3 className="text-2xl font-black text-[#2C2C2C]">Pleading Cats Arena</h3>
                <p className="text-gray-600 text-sm mt-3 font-medium leading-relaxed">
                  If they attempt to decline or hover over the "No" asset, the "Yes" trigger expands smoothly across the viewport, rendering acceptance absolute.
                </p>
              </div>
              <span className="text-xs font-black text-[#2C2C2C] bg-[#FFAFCC] border-2 border-[#2C2C2C] px-3 py-1.5 rounded-xl self-start shadow-[2px_2px_0px_#2C2C2C]">Guaranteed Scaling</span>
            </div>

            {/* Strategy Card 2 */}
            <div 
              onClick={() => { setTemplateId("retro-pixel-03"); scrollToSection(formRef); }}
              className={`cursor-pointer solid-card p-8 flex flex-col justify-between h-80 transition-transform hover:-translate-y-2 bg-white ${templateId === "retro-pixel-03" ? "ring-4 ring-[#CDB4DB]" : ""}`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#CDB4DB] border-2 border-[#2C2C2C] flex items-center justify-center text-2xl mb-4 shadow-[2px_2px_0px_#2C2C2C]">👾</div>
                <h3 className="text-2xl font-black text-[#2C2C2C]">Retro Arcade Evasion</h3>
                <p className="text-gray-600 text-sm mt-3 font-medium leading-relaxed">
                  Features customized chiptune retro aesthetics. The targeted rejection switch continuously computes vector evasions, flying away erratically upon approaches.
                </p>
              </div>
              <span className="text-xs font-black text-[#2C2C2C] bg-[#CDB4DB] border-2 border-[#2C2C2C] px-3 py-1.5 rounded-xl self-start shadow-[2px_2px_0px_#2C2C2C]">Evasive Physics</span>
            </div>
          </div>

          {/* Core Feature Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 relative z-30">
            {[
              { icon: <Layers className="w-5 h-5 text-[#2C2C2C]" />, t: "Choose Strategy" },
              { icon: <Smartphone className="w-5 h-5 text-[#2C2C2C]" />, t: "Customize Intent" },
              { icon: <Send className="w-5 h-5 text-[#2C2C2C]" />, t: "Distribute Link" },
              { icon: <ShieldCheck className="w-5 h-5 text-[#2C2C2C]" />, t: "Monitor Live" }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border-2 border-[#2C2C2C] rounded-2xl p-5 shadow-[4px_4px_0px_#2C2C2C]">
                <div className="w-9 h-9 rounded-xl bg-[#FFC8DD] border-2 border-[#2C2C2C] flex items-center justify-center mb-3">{step.icon}</div>
                <h4 className="font-extrabold text-[#2C2C2C] text-sm">{step.t}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* 🌊 Peak Wave Boundary: Catalog -> Input Form */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-[#2C2C2C]">
            <path d="M0,60 L1200,20 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* --- THEME 3: DEEP INPUT CONFIGURATOR --- */}
      <div ref={formRef} className="theme-form relative z-10 py-24 px-6 scroll-mt-2">
        <div className="max-w-3xl mx-auto relative z-30">
          <div className="mb-10 text-center">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Configure Your Proposal Package</h3>
            <p className="text-gray-400 font-medium mt-2">Notice the background elements tightening closely directly behind the input window.</p>
          </div>

          <div className="bg-[#1F1F1F] border-3 border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl relative z-30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black tracking-wider uppercase text-gray-400 mb-2">Your Signature Name</label>
                  <input type="text" required placeholder="e.g., Deep" className="w-full bg-[#2C2C2C] border-2 border-white/10 focus:border-[#CDB4DB] rounded-xl p-3 font-semibold text-white focus:outline-none transition" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-black tracking-wider uppercase text-gray-400 mb-2">Their Target Name</label>
                  <input type="text" required placeholder="e.g., Elena" className="w-full bg-[#2C2C2C] border-2 border-white/10 focus:border-[#FFAFCC] rounded-xl p-3 font-semibold text-white focus:outline-none transition" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black tracking-wider uppercase text-gray-400 mb-2">Custom Question Text (Optional)</label>
                <input type="text" placeholder="Default: Will you be my partner?" className="w-full bg-[#2C2C2C] border-2 border-white/10 focus:border-[#BDE0FE] rounded-xl p-3 font-semibold text-white focus:outline-none transition" value={customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-black tracking-wider uppercase text-gray-400 mb-2">Selected Target Strategy</label>
                <div className="p-4 bg-[#2C2C2C] rounded-xl border border-white/5 font-semibold text-sm text-gray-300 flex items-center justify-between">
                  <span>{templateId === "pleading-cats-02" ? "🐱 Pleading Cats Arena" : "👾 Retro Arcade Evasion"}</span>
                  <button type="button" onClick={() => scrollToSection(templatesRef)} className="text-xs font-black text-[#FFAFCC] uppercase tracking-wider hover:underline">Modify</button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="premium-btn w-full text-center mt-4 bg-white text-[#2C2C2C] border-white shadow-[4px_4px_0px_#FFAFCC]">
                {loading ? "Constructing Secure Pipeline..." : "Deploy Active Proposal Link"}
              </button>
            </form>

            {/* 💎 COMPACT UIVERSE LINKS OUTPUT PANEL */}
            {generatedLink && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mt-10 pt-8 border-t border-dashed border-white/10 flex flex-col sm:flex-row items-center justify-around gap-6 bg-[#252525] p-6 rounded-2xl"
              >
                {/* Custom Uiverse Link Trigger 1 */}
                <button onClick={() => handleCopy(generatedLink, true)} className="cta-share">
                  <span className="text-white!">{shareText}</span>
                  <svg width="15px" height="10px" viewBox="0 0 13 10" className="stroke-white!">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                  </svg>
                </button>

                {/* Custom Uiverse Link Trigger 2 */}
                <button onClick={() => handleCopy(trackerLink, false)} className="cta-track">
                  <span className="text-white!">{trackText}</span>
                  <svg width="15px" height="10px" viewBox="0 0 13 10" className="stroke-white!">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                  </svg>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <footer className="text-center pt-24 pb-12 text-sm text-gray-500 font-bold tracking-tight">
          partnerRadar © All connection payloads are transient.
        </footer>
      </div>

    </div>
  );
}