"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Heart, Sparkles, Star, Smartphone, ShieldCheck, Send, Layers } from "lucide-react";

function FloatingElement({ children, initialX, initialY }: { children: React.ReactNode; initialX: string; initialY: string }) {
  const [elementPos, setElementPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elemX = rect.left + rect.width / 2;
      const elemY = rect.top + rect.height / 2;
      const distX = e.clientX - elemX;
      const distY = e.clientY - elemY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < 120) {
        const angle = Math.atan2(distY, distX);
        const force = (120 - distance) / 3;
        setElementPos({ x: -Math.cos(angle) * force, y: -Math.sin(angle) * force });
      } else {
        setElementPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={ref} style={{ position: "absolute", left: initialX, top: initialY, pointerEvents: "none" }}>
      <motion.div animate={{ x: elementPos.x, y: elementPos.y }} transition={{ type: "spring", stiffness: 60, damping: 15 }}>
        {children}
      </motion.div>
    </div>
  );
}

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

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  const leftBlobX = useTransform(smoothProgress, [0, 0.85], ["-25vw", "0vw"]);
  const rightBlobX = useTransform(smoothProgress, [0, 0.85], ["25vw", "0vw"]);
  const normalBlobOpacity = useTransform(smoothProgress, [0.75, 0.85], [0.7, 0]);
  const finalHeartScale = useTransform(smoothProgress, [0.75, 0.9], [0.4, 1.1]);
  const finalHeartOpacity = useTransform(smoothProgress, [0.75, 0.85], [0, 1]);

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
        alert("Failed to build tracking link pipeline: " + data.error);
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
      setShareText("Copied to Clipboard! ✨");
      setTimeout(() => setShareText("Copy Proposal Link"), 2000);
    } else {
      setTrackText("Key Copied securely! 🕶️");
      setTimeout(() => setTrackText("Copy Secret Radar Key"), 2000);
    }
  };

  return (
    <div className="relative min-h-screen text-[#2C2C2C] selection:bg-[#FFC8DD] overflow-hidden">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center">
        <motion.div style={{ x: leftBlobX, opacity: normalBlobOpacity, backgroundColor: "#A2D2FF" }} className="absolute w-[450px] h-[450px] rounded-full blur-[70px] mix-blend-multiply" />
        <motion.div style={{ x: rightBlobX, opacity: normalBlobOpacity, backgroundColor: "#FFAFCC" }} className="absolute w-[450px] h-[450px] rounded-full blur-[70px] mix-blend-multiply" />
        <motion.div style={{ scale: finalHeartScale, opacity: finalHeartOpacity }} className="absolute flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-gradient-to-tr from-[#FFC8DD] to-[#CDB4DB] blur-[50px] rounded-full opacity-60" />
          <Heart className="absolute text-[#FFAFCC] w-80 h-80 drop-shadow-[0_10px_30px_rgba(255,185,204,0.6)] fill-[#FFAFCC]" />
        </motion.div>
      </div>

      {/* FLOATING SYMBOLS */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
        <FloatingElement initialX="8%" initialY="25vh"><Heart className="text-[#FFAFCC] w-7 h-7 opacity-70 fill-[#FFAFCC]" /></FloatingElement>
        <FloatingElement initialX="90%" initialY="15vh"><Sparkles className="text-[#CDB4DB] w-8 h-8 opacity-80" /></FloatingElement>
        <FloatingElement initialX="12%" initialY="75vh"><Star className="text-[#BDE0FE] w-6 h-6 opacity-70 fill-[#BDE0FE]" /></FloatingElement>
        <FloatingElement initialX="85%" initialY="60vh"><Heart className="text-[#FFC8DD] w-6 h-6 opacity-60 fill-[#FFC8DD]" /></FloatingElement>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <Heart className="w-6 h-6 text-[#FFAFCC] fill-[#FFAFCC]" />
          <span className="text-xl font-black tracking-tight text-[#2C2C2C]">partner<span className="text-[#FFAFCC]">Radar</span></span>
        </div>
        <div className="flex items-center gap-8 text-sm font-semibold text-gray-500">
          <button onClick={() => scrollToSection(templatesRef)} className="hover:text-[#2C2C2C] transition">Templates</button>
          <span className="text-xs bg-white border border-[#2C2C2C]/10 px-3 py-1 rounded-full shadow-sm text-gray-400">No signup required</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-20 max-w-4xl mx-auto px-6 pt-20 pb-32 text-center flex flex-col items-center justify-center min-h-[75vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#2C2C2C] leading-[1.1]">
            Turn a question <br /> into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAFCC] to-[#CDB4DB]">memory.</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Create beautifully structured, highly interactive custom web links to express deep feelings, share delicate moments, and ask your human anything.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => scrollToSection(templatesRef)} className="premium-btn w-full sm:w-auto">Explore Templates</button>
            <button onClick={() => scrollToSection(formRef)} className="premium-btn-secondary w-full sm:w-auto">Create Instant Link</button>
          </div>
        </motion.div>
      </section>

      {/* TEMPLATES */}
      <section ref={templatesRef} className="relative z-20 max-w-6xl mx-auto px-6 py-24 scroll-mt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Interactive Strategies</h2>
          <p className="text-gray-500 font-medium mt-2">Every scenario features premium customized layouts and dedicated physics behaviors.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div whileHover={{ scale: 1.02, y: -6 }} onClick={() => { setTemplateId("pleading-cats-02"); scrollToSection(formRef); }} className={`cursor-pointer rounded-3xl p-8 border-2 transition-all bg-white/60 backdrop-blur-md flex flex-col justify-between h-80 ${templateId === "pleading-cats-02" ? "border-[#FFAFCC] shadow-[0_12px_24px_rgba(255,175,204,0.25)]" : "border-[#2C2C2C]/10"}`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFC8DD]/30 flex items-center justify-center text-2xl mb-4">🐱</div>
              <h3 className="text-xl font-black text-gray-900">Pleading Cats Arena</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">If they attempt to decline or hover over the "No" asset, the "Yes" trigger expands smoothly across the viewport.</p>
            </div>
            <span className="text-xs font-bold text-[#FFAFCC] bg-[#FFAFCC]/10 border border-[#FFAFCC]/30 px-3 py-1 rounded-full self-start">Guaranteed Button Scaling</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -6 }} onClick={() => { setTemplateId("retro-pixel-03"); scrollToSection(formRef); }} className={`cursor-pointer rounded-3xl p-8 border-2 transition-all bg-white/60 backdrop-blur-md flex flex-col justify-between h-80 ${templateId === "retro-pixel-03" ? "border-[#CDB4DB] shadow-[0_12px_24px_rgba(205,180,219,0.25)]" : "border-[#2C2C2C]/10"}`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#CDB4DB]/30 flex items-center justify-center text-2xl mb-4">👾</div>
              <h3 className="text-xl font-black text-gray-900">Retro Arcade Evasion</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">Features customized chiptune retro aesthetics. The targeted rejection switch continuously computes vector evasions.</p>
            </div>
            <span className="text-xs font-bold text-[#CDB4DB] bg-[#CDB4DB]/10 border border-[#CDB4DB]/30 px-3 py-1 rounded-full self-start">Evasive Flying Physics</span>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">The Mechanics of Connection</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Layers className="w-5 h-5 text-[#CDB4DB]" />, t: "Choose Strategy", d: "Select an architectural interaction style designed to elicit a smile." },
            { icon: <Smartphone className="w-5 h-5 text-[#FFC8DD]" />, t: "Customize Intent", d: "Inject signature names and supply custom validation context questions." },
            { icon: <Send className="w-5 h-5 text-[#BDE0FE]" />, t: "Distribute Link", d: "Dispatch the unique target token URL securely to your destination human." },
            { icon: <ShieldCheck className="w-5 h-5 text-[#A2D2FF]" />, t: "Monitor Live", d: "Watch state updates complete in real-time before total telemetry self-destruct." }
          ].map((step, idx) => (
            <div key={idx} className="bg-white/40 backdrop-blur-sm border border-[#2C2C2C]/5 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[#2C2C2C]/5 flex items-center justify-center mb-4">{step.icon}</div>
              <h4 className="font-bold text-gray-900 text-base">{step.t}</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORM INPUTS AND HIDDEN LINKS OUTPUT */}
      <section ref={formRef} className="relative z-20 max-w-3xl mx-auto px-6 py-24 scroll-mt-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-pink-100/30">
          <div className="mb-8">
            <h3 className="text-2xl font-black tracking-tight">Configure Your Proposal Package</h3>
            <p className="text-sm text-gray-500 mt-1">This context instantly configures your interactive deployment link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2">Your Signature Name</label>
                <input type="text" required placeholder="e.g., Deep" className="w-full bg-white/50 border-2 border-gray-200 focus:border-[#CDB4DB] rounded-xl p-3 font-semibold text-black focus:outline-none transition" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2">Their Target Name</label>
                <input type="text" required placeholder="e.g., Elena" className="w-full bg-white/50 border-2 border-gray-200 focus:border-[#FFAFCC] rounded-xl p-3 font-semibold text-black focus:outline-none transition" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2">Custom Question Text (Optional)</label>
              <input type="text" placeholder="Default: Will you be my partner?" className="w-full bg-white/50 border-2 border-gray-200 focus:border-[#BDE0FE] rounded-xl p-3 font-semibold text-black focus:outline-none transition" value={customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2">Selected Target Strategy</label>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 font-semibold text-sm text-gray-700 flex items-center justify-between">
                <span>{templateId === "pleading-cats-02" ? "🐱 Pleading Cats Arena" : "👾 Retro Arcade Evasion"}</span>
                <button type="button" onClick={() => scrollToSection(templatesRef)} className="text-xs font-black text-[#FFAFCC] uppercase tracking-wider hover:underline">Change</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="premium-btn w-full text-center mt-4">
              {loading ? "Constructing Secure Pipeline..." : "Deploy Active Proposal Link"}
            </button>
          </form>

          {/* 💎 NEW HIPPITY-HOP CLEANED LINK OUTPUT INTERFACE */}
          {generatedLink && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-10 pt-8 border-t border-dashed border-gray-200 flex flex-col sm:flex-row items-center justify-around gap-6">
              
              {/* Uiverse-Inspired Share Button Trigger */}
              <button onClick={() => handleCopy(generatedLink, true)} className="cta-share">
                <span>{shareText}</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5"></path>
                  <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
              </button>

              {/* Uiverse-Inspired Dashboard Key Trigger */}
              <button onClick={() => handleCopy(trackerLink, false)} className="cta-track">
                <span>{trackText}</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5"></path>
                  <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
              </button>

            </motion.div>
          )}
        </div>
      </section>

      {/* FOOTER CLIMAX CLOSURE */}
      <section className="relative z-20 max-w-4xl mx-auto px-6 pt-32 pb-56 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <motion.div style={{ opacity: finalHeartOpacity }} className="space-y-4">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">Some feelings deserve more than a text message.</h3>
          <p className="text-gray-400 font-medium text-sm max-w-md mx-auto">PartnerRadar keeps your intents clean, playful, and beautifully transient. Wipes entirely from history once witnessed.</p>
        </motion.div>
      </section>
    </div>
  );
}