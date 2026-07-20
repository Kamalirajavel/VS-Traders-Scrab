import { MessageCircle, Phone } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(47 100% 50%) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, hsl(47 100% 50% / 0.15), transparent)",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/30 bg-gold/10">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-600 uppercase tracking-widest">Ready to Sell?</span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-800 text-foreground leading-tight">
            Sell Your Scrap
            <br />
            <span className="shimmer-text">Today</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get the best price for your scrap materials. Our team is ready to provide instant pickup and immediate payment anywhere in Chennai.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919500805193?text=Hi%2C%20I%20want%20to%20sell%20my%20scrap.%20Please%20help%20me%20with%20a%20price%20estimate."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-10 py-4 gradient-gold text-background font-700 rounded-xl shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200 text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp Us
            </a>
            <a
              href="tel:9500805193"
              className="flex items-center justify-center gap-3 px-10 py-4 border border-border text-foreground font-600 rounded-xl hover:border-gold hover:text-gold transition-all duration-200 text-lg"
            >
              <Phone className="w-6 h-6" />
              Call: 9500805193
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            {[
              { value: "Free", label: "Doorstep Pickup" },
              { value: "Instant", label: "Cash Payment" },
              { value: "Best", label: "Market Price" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-gold font-800 text-2xl">{item.value}</p>
                <p className="text-muted-foreground text-sm uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
