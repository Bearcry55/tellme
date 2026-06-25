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
            {/* Minimalist fallback search icon layout identifier */}
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
                  className={`min-w-[320px] md:min-w-[400px] snap-start bg-white border-[3px] border-[#1b1c1c] rounded-xl p-8 transition-all cursor-pointer select-none
                    ${isSelected ? `scale-[0.98] ${template.selectedClass}` : "shadow-[8px_8px_0px_0px_#1b1c1c] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_#1b1c1c]"}
                  `}
                >
                  {/* Icon Frame */}
                  <div className={`w-12 h-12 rounded-lg border-[3px] border-[#1b1c1c] flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_#1b1c1c] ${template.iconClass}`}>
                    <span className="text-xl">{template.icon}</span>
                  </div>

                  {/* Text Header */}
                  <h3 className="text-xl md:text-2xl font-black text-[#1b1c1c] mb-2">
                    {template.title}
                  </h3>
                  
                  {/* Description Box */}
                  <p className="text-sm md:text-base font-medium text-[#514347] mb-6 line-clamp-2 h-12 overflow-hidden">
                    {template.description}
                  </p>

                  {/* Footer Elements */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full border-2 border-[#1b1c1c] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#1b1c1c] ${template.badgeClass}`}>
                      {template.badge}
                    </span>
                    <span className="font-bold text-lg text-[#514347] transition-transform group-hover:translate-x-1">
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