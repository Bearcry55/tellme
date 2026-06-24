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

  // Template Data Array for clean filtering
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
      selectedClass: styles.selectedPink, // Using existing styles to keep it clean
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

  // Filter based on search query
  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="theme-catalog relative z-10 py-16 px-6 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2C2C2C]">
          Choose a Template
        </h2>
        <p className="text-[#2C2C2C]/70 font-bold mt-3">
          Choose the interaction style that matches your mission.
        </p>

        {/* SEARCH BAR */}
        <div className="mt-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-[#111] font-bold shadow-[3px_3px_0_#111] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0_#111] transition-all"
          />
        </div>
      </div>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div className={styles.scrollContainer}>
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                setTemplateId(template.id);
                scrollToForm();
              }}
              className={`${styles.catalogCard} solid-card ${
                templateId === template.id ? template.selectedClass : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${styles.iconBox} ${template.iconClass}`}>
                  {template.icon}
                </div>
                <h3 className={styles.cardTitle}>{template.title}</h3>
              </div>

              <p className={styles.cardDescription}>{template.description}</p>

              <span className={`${styles.badge} ${template.badgeClass}`}>
                {template.badge}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center font-bold text-gray-500 w-full py-4">No templates found.</p>
        )}
      </div>

      {/* WAVE */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden"
        style={{ lineHeight: 0 }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] fill-[#2C2C2C]"
        >
          <path d="M0,60 L1200,20 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}