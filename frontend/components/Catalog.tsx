"use client";

import { useState } from "react";
import styles from "./Catalog.module.css";

interface SkylineCatalogProps {
  templateId: string;
  setTemplateId: (id: string) => void;
  scrollToForm: () => void;
}

export default function SkylineCatalog({
  templateId,
  setTemplateId,
  scrollToForm,
}: SkylineCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const templates = [
    {
      id: "pleading-cats-02",
      title: "Pleading Cats Arena",
      icon: "🐱",
      description: 'If they attempt to decline or hover over "No", "Yes" expands.',
      badge: "Guaranteed Scaling",
      selectedClass: styles.selectedPink,
      iconClass: styles.iconPink,
      badgeClass: styles.badgePink,
      // Mini UI Snapshot Preview Setup
      renderPreview: () => (
        <div className="w-full h-full bg-pink-100 flex flex-col items-center justify-center p-3 font-sans">
          <div className="bg-white border-2 border-[#1b1c1c] p-2 rounded-lg text-center w-full max-w-[180px] shadow-[2px_2px_0px_#1b1c1c]">
            <p className="text-[10px] font-black text-[#1b1c1c] mb-2 leading-tight">Will you be mine? 🐱</p>
            <div className="flex gap-1.5 justify-center">
              <span className="text-[8px] bg-[#FFAFCC] border border-[#1b1c1c] px-2 py-0.5 font-bold text-white">YES</span>
              <span className="text-[8px] bg-gray-300 border border-[#1b1c1c] px-2 py-0.5 font-bold text-gray-600 line-through">NO</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "retro-pixel-03",
      title: "Retro Arcade Evasion",
      icon: "👾",
      description: "The targeted rejection switch continuously computes vector evasions.",
      badge: "Evasive Physics",
      selectedClass: styles.selectedPurple,
      iconClass: styles.iconPurple,
      badgeClass: styles.badgePurple,
      renderPreview: () => (
        <div className="w-full h-full bg-purple-950 flex flex-col items-center justify-center p-3 font-mono text-white">
          <div className="border-2 border-dashed border-pink-500 bg-purple-900 p-2 text-center w-full max-w-[180px]">
            <span className="text-[6px] text-yellow-400 block tracking-widest font-bold">QUEST INCOMING</span>
            <div className="text-xl my-0.5">❤️</div>
            <div className="flex gap-2 justify-center mt-1">
              <span className="text-[8px] bg-yellow-400 text-purple-950 font-black px-1.5 py-0.5">[ACCEPT]</span>
              <span className="text-[8px] bg-zinc-600 text-zinc-300 px-1.5 py-0.5 opacity-40">REJECT</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "tamagotchi-pet-04",
      title: "Tamagotchi Virtual Pet",
      icon: "🥺",
      description: "Virtual pet mechanics where the 'Ignore' choice physically shrinks to pixels on hover.",
      badge: "Forced Caretaking",
      selectedClass: styles.selectedPink,
      iconClass: styles.iconPink,
      badgeClass: styles.badgePink,
      renderPreview: () => (
        <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center p-2 font-mono">
          <div className="bg-pink-400 border-2 border-[#1b1c1c] rounded-full p-2 w-[110px] h-[110px] flex flex-col items-center justify-center shadow-md">
            <div className="bg-neutral-200 border border-neutral-700 p-1 rounded w-full text-center text-neutral-800">
              <span className="text-[6px] block opacity-70">STATUS: NEEDING LOVE</span>
              <span className="text-xl block my-0.5">🥺</span>
              <span className="text-[7px] bg-emerald-500 text-white px-1 block font-bold rounded-sm">FEED</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "cyberpunk-hack-05",
      title: "Cyberpunk Mainframe",
      icon: "🔓",
      description: "Mainframe matrix terminal. Denying authorization glitches the grid until compliance.",
      badge: "Intrusion Override",
      selectedClass: styles.selectedPurple,
      iconClass: styles.iconPurple,
      badgeClass: styles.badgePurple,
      renderPreview: () => (
        <div className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center p-3 font-mono text-cyan-400 border border-cyan-500/20">
          <div className="w-full max-w-[180px] border border-cyan-500 bg-neutral-900 p-2 text-left">
            <div className="text-[6px] opacity-60 border-b border-cyan-500 pb-1 mb-1 font-bold">CORE_MAIN_FRAME //</div>
            <p className="text-[7px] text-white font-black leading-tight mb-2">EXECUTE PROTOCOL ALLIANCE?</p>
            <div className="flex gap-1 justify-end text-[6px]">
              <span className="border border-red-500 text-red-400 p-0.5">[DENY]</span>
              <span className="bg-cyan-500 text-neutral-950 font-black p-0.5">[AUTHORIZE]</span>
            </div>
          </div>
        </div>
      )
    },
  ];

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-24 bg-[#BDE0FE] px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & SEARCH BAR BLOCK */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1b1c1c] tracking-tight mb-4">
              Choose a Template
            </h2>
            <p className="text-sm sm:text-base font-bold text-[#265a81] max-w-md">
              Browse our curated collection of interactive stories and playful proposal layouts.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 bg-white border-[3px] border-[#1b1c1c] rounded-xl px-12 font-bold focus:ring-0 focus:outline-none shadow-[4px_4px_0px_0px_#1b1c1c] focus:shadow-[8px_8px_0px_0px_#1b1c1c] transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#1b1c1c] pointer-events-none text-lg">
              🔍
            </span>
          </div>
        </div>

        {/* BRUTALIST SNAP-SCROLL CARDS ROW */}
        <div className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory scroll-smooth">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => {
              const isSelected = templateId === template.id;
              
              return (
                <div
                  key={template.id}
                  onClick={() => {
                    setTemplateId(template.id);
                    scrollToForm();
                  }}
                  className={`min-w-[320px] md:min-w-[420px] snap-start bg-white border-[3px] border-[#1b1c1c] rounded-xl p-6 transition-all cursor-pointer select-none flex flex-col justify-between
                    ${isSelected ? `scale-[0.98] ${template.selectedClass}` : "shadow-[8px_8px_0px_0px_#1b1c1c] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_#1b1c1c]"}
                  `}
                >
                  <div>
                    {/* Live Preview Micro Container Wrapper without 404 Iframes */}
                    <div className="w-full h-40 bg-gray-100 rounded-lg border-[3px] border-[#1b1c1c] mb-4 overflow-hidden relative shadow-[4px_4px_0px_0px_#1b1c1c] pointer-events-none">
                      {template.renderPreview()}
                    </div>

                    {/* Header Row with Icon */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg border-[3px] border-[#1b1c1c] flex items-center justify-center shadow-[2px_2px_0px_0px_#1b1c1c] ${template.iconClass}`}>
                        <span className="text-lg">{template.icon}</span>
                      </div>
                      <h3 className="text-xl font-black text-[#1b1c1c] truncate">
                        {template.title}
                      </h3>
                    </div>
                    
                    {/* Description Box */}
                    <p className="text-xs md:text-sm font-medium text-[#514347] mb-6 line-clamp-2 h-10 overflow-hidden">
                      {template.description}
                    </p>
                  </div>

                  {/* Footer Elements */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`px-3 py-1 rounded-full border-2 border-[#1b1c1c] text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#1b1c1c] ${template.badgeClass}`}>
                      {template.badge}
                    </span>
                    <span className="font-bold text-lg text-[#514347]">
                      ➔
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center font-black text-[#1b1c1c] opacity-60 w-full py-12 text-lg">
              No matching connection packages found.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}