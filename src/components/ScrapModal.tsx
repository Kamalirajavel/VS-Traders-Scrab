import { X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ScrapItem {
  image: string;
  label: string;
  description: string;
}

interface ScrapModalProps {
  item: ScrapItem | null;
  onClose: () => void;
}

const ScrapModal = ({ item, onClose }: ScrapModalProps) => {
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative z-10 bg-surface border border-border rounded-2xl overflow-hidden w-full max-w-md shadow-card animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="w-full h-56 overflow-hidden">
          <img
            src={item.image}
            alt={item.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Scrap Material</span>
            <h3 className="text-foreground text-2xl font-extrabold">{item.label}</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
          <button
            onClick={() => { onClose(); navigate("/contact"); }}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 gradient-gold text-background font-bold rounded-xl shadow-gold hover:opacity-90 transition-all duration-200"
          >
            Sell Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrapModal;
