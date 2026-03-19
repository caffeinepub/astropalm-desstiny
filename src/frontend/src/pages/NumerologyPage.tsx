import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import VedicNumerologyApp from "../components/VedicNumerologyApp";

export default function NumerologyPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen">
      <button
        type="button"
        onClick={handleClose}
        data-ocid="numerology.secondary_button"
        className="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border text-foreground px-3 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-muted transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>
      <VedicNumerologyApp onClose={handleClose} />
    </div>
  );
}
