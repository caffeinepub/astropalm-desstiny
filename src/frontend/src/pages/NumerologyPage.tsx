import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import VedicNumerologyApp from "../components/VedicNumerologyApp";

export default function NumerologyPage() {
  const navigate = useNavigate();
  const handleClose = () => navigate({ to: "/" });

  return (
    <div className="min-h-screen">
      <div className="flex justify-end px-4 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/horoscope" })}
          data-ocid="numerology.link"
          className="text-xs rounded-full border-green-600 text-green-700 hover:bg-green-50"
        >
          🔮 KP Horoscope
        </Button>
      </div>
      <VedicNumerologyApp
        onClose={handleClose}
        onGoToNadiCards={() => navigate({ to: "/nadi-cards" })}
      />
    </div>
  );
}
