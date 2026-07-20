import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import ServicesSection from "@/components/ServicesSection";
import ScrapTypes from "@/components/ScrapTypes";
import WhyChooseUs from "@/components/WhyChooseUs";
import CallToAction from "@/components/CallToAction";
import { MapPin, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>

        {/* ① Materials We Collect — first after hero */}
        <ScrapTypes />

        {/* ② How It Works */}
        <HowItWorks />

        {/* ③ Our Services */}
        <ServicesSection />

        {/* About Snippet */}
        <section id="about" className="py-24 bg-surface">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">About V.S Traders</span>
                <h2 className="text-4xl md:text-5xl font-800 text-foreground">
                  Chennai's Most <br />
                  <span className="shimmer-text">Trusted Scrap Buyer</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  V.S Traders is a scrap buying service based in Chennai. We purchase all types of scrap materials including e-waste, iron, copper, aluminium and home appliances.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our goal is to provide customers with the best price and quick doorstep scrap pickup service. We focus on responsible recycling and proper disposal of electronic waste.
                </p>
                <div className="grid grid-cols-3 gap-6 pt-4">
                  {[
                    { value: "500+", label: "Customers" },
                    { value: "10+", label: "Years" },
                    { value: "100%", label: "Trusted" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-background border border-border rounded-xl p-4 text-center">
                      <p className="text-gold text-2xl font-800">{stat.value}</p>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-background border border-border rounded-3xl p-10 shadow-card">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-2xl gradient-gold flex items-center justify-center shadow-gold mb-4 animate-float">
                        <span className="text-background font-900 text-2xl">VS</span>
                      </div>
                      <h3 className="text-foreground font-800 text-2xl">Vimalraj</h3>
                      <p className="text-gold text-sm font-600 mt-1">Founder, V.S Traders</p>
                    </div>
                    <div className="bg-surface rounded-xl p-5 space-y-3">
                      <p className="text-muted-foreground text-sm leading-relaxed italic">
                        "Our mission is simple – give every customer the best price and the most convenient scrap pickup experience in Chennai."
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface border border-border rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          <p className="text-gold text-xs font-600">Location</p>
                        </div>
                        <p className="text-muted-foreground text-xs">Ambattur, Chennai</p>
                      </div>
                      <div className="bg-surface border border-border rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          <p className="text-gold text-xs font-600">Available</p>
                        </div>
                        <p className="text-muted-foreground text-xs">Mon – Sat, 9AM–6PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 gradient-gold rounded-2xl px-4 py-2 shadow-gold">
                  <p className="text-background text-xs font-700">Est. 2014</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WhyChooseUs />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
