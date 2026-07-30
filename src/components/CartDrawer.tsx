import { Send } from "lucide-react";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "919500805193";

const CartDrawer = () => {
  const { items, totalItems } = useCart();

  const buildMessage = () => {
    if (items.length === 0) return "Hi, I want to sell scrap.";
    const lines = items.map(
      (i, idx) => `${idx + 1}. ${i.name}${i.pricePerKg ? ` (₹${i.pricePerKg}/kg)` : ""}`
    );
    return `Hi, I'd like to sell the following scrap items:\n${lines.join("\n")}`;
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Sell now via WhatsApp"
      className="relative flex items-center gap-2 pl-4 pr-5 h-14 rounded-full bg-gold text-background font-800 text-sm shadow-lg hover:scale-105 transition-transform duration-200"
    >
      <Send className="w-4 h-4" />
      Sell Now
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-background text-gold border border-gold text-xs font-700 w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </a>
  );
};

export default CartDrawer;
