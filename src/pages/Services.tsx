import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import CallToAction from "@/components/CallToAction";
import ScrapTypes from "@/components/ScrapTypes";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-36 pb-20 bg-surface relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(47 100% 50%) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">What We Offer</span>
              <h1 className="text-5xl md:text-6xl font-800 text-foreground leading-tight">
                Our <span className="shimmer-text">Services</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Comprehensive scrap buying services across Chennai. We offer the best prices and doorstep pickup for all types of scrap.
              </p>
            </div>
          </div>
        </section>

        <ServicesSection />
        <ScrapTypes />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
