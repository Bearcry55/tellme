"use client";

import { Layers, Smartphone, Send, ShieldCheck } from "lucide-react";

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
  return (
    <section className="theme-catalog relative z-10 py-24 px-6 overflow-hidden">
      

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2C2C2C]">
            Interactive Strategies
          </h2>

          <p className="text-[#2C2C2C]/70 font-bold mt-3">
            Choose the interaction style that matches your mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* CARD 1 */}
          <div
            onClick={() => {
              setTemplateId("pleading-cats-02");
              scrollToForm();
            }}
            className={`cursor-pointer solid-card p-8 flex flex-col justify-between h-80 transition-transform hover:-translate-y-2 bg-white ${
              templateId === "pleading-cats-02"
                ? "ring-4 ring-[#FFAFCC]"
                : ""
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFC8DD] border-2 border-[#111] flex items-center justify-center text-2xl mb-4 shadow-[2px_2px_0px_#111]">
                🐱
              </div>

              <h3 className="text-2xl font-black text-[#2C2C2C]">
                Pleading Cats Arena
              </h3>

              <p className="text-gray-600 text-sm mt-3 font-medium leading-relaxed">
                If they attempt to decline or hover over the "No"
                asset, the "Yes" trigger expands smoothly across the
                viewport, rendering acceptance absolute.
              </p>
            </div>

            <span className="text-xs font-black text-[#111] bg-[#FFAFCC] border-2 border-[#111] px-3 py-1.5 rounded-xl self-start shadow-[2px_2px_0px_#111]">
              Guaranteed Scaling
            </span>
          </div>

          {/* CARD 2 */}
          <div
            onClick={() => {
              setTemplateId("retro-pixel-03");
              scrollToForm();
            }}
            className={`cursor-pointer solid-card p-8 flex flex-col justify-between h-80 transition-transform hover:-translate-y-2 bg-white ${
              templateId === "retro-pixel-03"
                ? "ring-4 ring-[#CDB4DB]"
                : ""
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#CDB4DB] border-2 border-[#111] flex items-center justify-center text-2xl mb-4 shadow-[2px_2px_0px_#111]">
                👾
              </div>

              <h3 className="text-2xl font-black text-[#2C2C2C]">
                Retro Arcade Evasion
              </h3>

              <p className="text-gray-600 text-sm mt-3 font-medium leading-relaxed">
                Features customized chiptune retro aesthetics. The
                targeted rejection switch continuously computes vector
                evasions, flying away erratically upon approaches.
              </p>
            </div>

            <span className="text-xs font-black text-[#111] bg-[#CDB4DB] border-2 border-[#111] px-3 py-1.5 rounded-xl self-start shadow-[2px_2px_0px_#111]">
              Evasive Physics
            </span>
          </div>
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