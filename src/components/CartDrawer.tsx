import { useState } from "react";
import { Heart, X, Send } from "lucide-react";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "919500805193";

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { items, removeFromCart, clearCart, totalItems } = useCart();

  const buildMessage = () => {
    if (items.length === 0) return "Hi, I want to sell scrap.";
    const lines = items.map(
      (i, idx) => `${idx + 1}. ${i.name}${i.pricePerKg ? ` (₹${i.pricePerKg}/kg)` : ""}`
    );
    return `Hi, I'd like to sell the following scrap items:\n${lines.join("\n")}`;
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="View selected items"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-background border border-gold shadow-lg hover:scale-110 transition-transform duration-200"
      >
        <Heart className="w-6 h-6 text-gold" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-background text-xs font-700 w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-background border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-800 text-foreground">Your Selected Items</h3>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No items selected yet. Tap the heart icon on any material or product to add it here.
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-surface rounded-lg p-3">
                    <div>
                      <p className="text-foreground text-sm font-600">{item.name}</p>
                      {item.pricePerKg != null && (
                        <p className="text-gold text-xs">₹{item.pricePerKg}/kg</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-destructive text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex-1 border border-border rounded-lg py-2.5 text-sm font-600 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              )}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-lg py-2.5 text-sm font-700 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" /> Send via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
