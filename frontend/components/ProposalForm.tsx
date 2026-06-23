"use client";

import styles from"./ProposalForm.module.css"
import { useState } from "react";
import { motion } from "framer-motion";

interface ProposalFormProps {
  templateId: string;
  scrollToCatalog: () => void;
}

export default function ProposalForm({
  templateId,
  scrollToCatalog,
}: ProposalFormProps) {
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");

  const [generatedLink, setGeneratedLink] = useState("");
  const [trackerLink, setTrackerLink] = useState("");

  const [loading, setLoading] = useState(false);

  const [shareText, setShareText] =
    useState("Copy Proposal Link");

  const [trackText, setTrackText] =
    useState("Copy Secret Radar Key");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/proposals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_name: senderName,
            receiver_name: receiverName,
            template_id: templateId,
            custom_question: customQuestion,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setGeneratedLink(
          `http://localhost:3000/p/${data.proposal_id}`
        );

        setTrackerLink(
          `http://localhost:3000/track/${data.tracker_id}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (
    textToCopy: string,
    isShare: boolean
  ) => {
    navigator.clipboard.writeText(textToCopy);

    if (isShare) {
      setShareText("Copied! ✨");

      setTimeout(() => {
        setShareText("Copy Proposal Link");
      }, 2000);
    } else {
      setTrackText("Key Copied! 🕶️");

      setTimeout(() => {
        setTrackText("Copy Secret Radar Key");
      }, 2000);
    }
  };

  return (
    <section className="theme-form py-24 px-6">
  <div className="max-w-3xl mx-auto">
    <div className="mb-10 text-center">
      <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
        Configure Your Proposal Package
      </h3>

      <p className="text-[#BDE0FE] font-bold mt-2">
        Personalize the interaction before deployment.
      </p>
    </div>

    <div className={styles.proposalCard}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={styles.formLabel}>
              Your Signature Name
            </label>

            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g., John"
              className={`${styles.formInput} ${styles.formInputPurple}`}
            />
          </div>

          <div>
            <label className={styles.formLabel}>
              Their Target Name
            </label>

            <input
              type="text"
              required
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="e.g., Elena"
              className={`${styles.formInput} ${styles.formInputPink}`}
            />
          </div>
        </div>

        <div>
          <label className={styles.formLabel}>
            Custom Question Text
          </label>

          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Default: Will you be my partner?"
            className={`${styles.formInput} ${styles.formInputBlue}`}
          />
        </div>

        <div>
          <label className={styles.formLabel}>
            Selected Strategy
          </label>

          <div className={styles.strategyBox}>
            <span>
              {templateId === "pleading-cats-02"
                ? "🐱 Pleading Cats Arena"
                : "👾 Retro Arcade Evasion"}
            </span>

            <button
              type="button"
              onClick={scrollToCatalog}
              className={styles.modifyBtn}
            >
              Modify
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="premium-btn w-full bg-white text-[#2C2C2C] border-white shadow-[4px_4px_0px_#FFAFCC]"
        >
          {loading
            ? "Constructing Secure Pipeline..."
            : "Deploy Active Proposal Link"}
        </button>
      </form>

      {generatedLink && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.resultBox}
        >
          <button
            onClick={() => handleCopy(generatedLink, true)}
            className="cta-share"
          >
            <span className="text-white">{shareText}</span>
          </button>

          <button
            onClick={() => handleCopy(trackerLink, false)}
            className="cta-track"
          >
            <span className="text-white">{trackText}</span>
          </button>
        </motion.div>
      )}
    </div>

    <footer className="text-center pt-24 pb-12 text-sm text-gray-500 font-bold tracking-tight">
      TellMe © All connection payloads are transient.
    </footer>
  </div>
</section>
  );
}