import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const TAB_ROOT_PATHS = ['/', '/schedule', '/gallery', '/info', '/settings'];

export default function BackHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  if (TAB_ROOT_PATHS.includes(location.pathname)) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1000] bg-background/80 backdrop-blur-md border-b border-border"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center px-4" style={{ height: 48 }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-heading font-semibold text-foreground select-none"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      </div>
    </div>
  );
}