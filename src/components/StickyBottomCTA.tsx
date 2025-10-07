import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const StickyBottomCTA = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ne pas afficher sur les pages de consultation et checkout
  const hideOnRoutes = ["/consultation", "/checkout"];
  const shouldHide = hideOnRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (shouldHide) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <Button
        onClick={() => navigate("/consultation")}
        className="w-full"
        size="lg"
      >
        Obtenir mon arrêt maintenant
      </Button>
    </div>
  );
};
