"use client";


import styles from "./SkylineCatalog.module.css"
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

        

    {/* CARD 1 */}
<div
  onClick={() => {
    setTemplateId("pleading-cats-02");
    scrollToForm();
  }}
  className={`${styles.catalogCard} solid-card ${
    templateId === "pleading-cats-02"
      ? styles.selectedPink
      : ""
  }`}
>
  <div>
    <div
      className={`${styles.iconBox} ${styles.iconPink}`}
    >
      🐱
    </div>

    <h3 className={styles.cardTitle}>
      Pleading Cats Arena
    </h3>

    <p className={styles.cardDescription}>
      If they attempt to decline or hover over the "No"
      asset, the "Yes" trigger expands smoothly across the
      viewport, rendering acceptance absolute.
    </p>
  </div>

  <span
    className={`${styles.badge} ${styles.badgePink}`}
  >
    Guaranteed Scaling
  </span>
</div>
         <div
  onClick={() => {
    setTemplateId("retro-pixel-03");
    scrollToForm();
  }}
  className={`${styles.catalogCard} solid-card ${
    templateId === "retro-pixel-03"
      ? styles.selectedPurple
      : ""
  }`}
>
  <div>
    <div
      className={`${styles.iconBox} ${styles.iconPurple}`}
    >
      👾
    </div>

    <h3 className={styles.cardTitle}>
      Retro Arcade Evasion
    </h3>

    <p className={styles.cardDescription}>
      Features customized chiptune retro aesthetics. The
      targeted rejection switch continuously computes vector
      evasions, flying away erratically upon approaches.
    </p>
  </div>

  <span
    className={`${styles.badge} ${styles.badgePurple}`}
  >
    Evasive Physics
  </span>
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