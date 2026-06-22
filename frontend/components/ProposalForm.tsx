"use client";

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

        <div className="bg-[#3A3A3A] border-[3px] border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-black tracking-wider uppercase text-gray-400 mb-2">
                  Your Signature Name
                </label>

                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) =>
                    setSenderName(e.target.value)
                  }
                  placeholder="e.g., Deep"
                  className="w-full bg-[#262626] border-2 border-white/10 rounded-xl p-3 font-semibold text-white focus:outline-none focus:border-[#CDB4DB]"
                />
              </div>

              <div>
                <label className="block text-xs font-black tracking-wider uppercase text-gray-400 mb-2">
                  Their Target Name
                </label>

                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) =>
                    setReceiverName(e.target.value)
                  }
                  placeholder="e.g., Elena"
                  className="w-full bg-[#262626] border-2 border-white/10 rounded-xl p-3 font-semibold text-white focus:outline-none focus:border-[#FFAFCC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black tracking-wider uppercase text-gray-400 mb-2">
                Custom Question Text
              </label>

              <input
                type="text"
                value={customQuestion}
                onChange={(e) =>
                  setCustomQuestion(e.target.value)
                }
                placeholder="Default: Will you be my partner?"
                className="w-full bg-[#262626] border-2 border-white/10 rounded-xl p-3 font-semibold text-white focus:outline-none focus:border-[#BDE0FE]"
              />
            </div>

            <div>
              <label className="block text-xs font-black tracking-wider uppercase text-gray-400 mb-2">
                Selected Strategy
              </label>

              <div className="p-4 bg-[#262626] rounded-xl border border-white/10 font-semibold text-sm text-gray-300 flex items-center justify-between">
                <span>
                  {templateId === "pleading-cats-02"
                    ? "🐱 Pleading Cats Arena"
                    : "👾 Retro Arcade Evasion"}
                </span>

                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="text-xs font-black text-[#FFAFCC] uppercase hover:underline"
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
              className="mt-10 pt-8 border-t border-dashed border-white/10 flex flex-col sm:flex-row items-center justify-around gap-6 bg-[#252525] p-6 rounded-2xl"
            >
              <button
                onClick={() =>
                  handleCopy(generatedLink, true)
                }
                className="cta-share"
              >
                <span className="text-white">
                  {shareText}
                </span>
              </button>

              <button
                onClick={() =>
                  handleCopy(trackerLink, false)
                }
                className="cta-track"
              >
                <span className="text-white">
                  {trackText}
                </span>
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