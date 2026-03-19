import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import NadiAppMain from "../components/NadiAppMain";

export default function NadiCardsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        data-ocid="nadi_cards.back_button"
        className="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-white transition-colors border border-gray-200"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>
      <NadiAppMain />
    </div>
  );
}
