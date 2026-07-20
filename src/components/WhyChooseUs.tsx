import { BadgeCheck, Zap, Recycle, Star } from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Best Price Guarantee",
    description: "We offer the highest market rates for all scrap types. No hidden deductions, transparent pricing always.",
  },
  {
    icon: Zap,
    title: "Quick Pickup Service",
    description: "Schedule a pickup and our team arrives at your doorstep. Same-day service available across Chennai.",
  },
  {
    icon: Recycle,
    title: "Responsible Recycling",
    description: "We ensure all collected scrap is processed through certified recycling channels for environmental safety.",
  },
  {
    icon: Star,
    title: "Trusted Local Buyer",
    description: "Serving Chennai for over 10 years. Hundreds of satisfied customers trust V.S Traders for reliable service.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">Why Us</span>
              <h2 className="text-4xl md:text-5xl font-800 text-foreground">
                Why Choose <br />
                <span className="shimmer-text">V.S Traders?</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We are Chennai's most trusted scrap buying service. Our commitment to fair pricing and exceptional service sets us apart.
              </p>
            </div>

            {/* Testimonial */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-foreground text-base italic leading-relaxed">
                "V.S Traders gave me the best price for my old AC and iron scrap. The pickup was fast and payment was immediate. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-background text-sm font-700">R</div>
                <div>
                  <p className="text-foreground text-sm font-700">Ramesh K.</p>
                  <p className="text-muted-foreground text-xs">Chennai Customer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right – benefit cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                className="group bg-surface border border-border rounded-2xl p-6 hover:border-gold/50 hover:shadow-gold transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <benefit.icon className="w-6 h-6 text-gold group-hover:text-background transition-colors duration-300" />
                </div>
                <h3 className="text-foreground font-700 text-base mb-2 group-hover:text-gold transition-colors">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
