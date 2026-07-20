import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Wrench, Zap, Layers, Wind, Truck } from "lucide-react";
import ewasteImg from "@/assets/service-ewaste.jpg";
import ironImg from "@/assets/service-iron.jpg";
import copperImg from "@/assets/service-copper.jpg";
import aluminiumImg from "@/assets/service-aluminium.jpg";
import acFridgeImg from "@/assets/service-ac-fridge.jpg";
import pickupImg from "@/assets/service-pickup.jpg";

const services = [
  {
    image: ewasteImg,
    icon: Cpu,
    title: "E-waste Scrap Buying",
    description: "We purchase all types of electronic waste including computers, laptops, mobiles and circuit boards at best prices."
  },
  {
    image: ironImg,
    icon: Wrench,
    title: "Iron Scrap Buying",
    description: "Competitive prices for all grades of iron scrap – structural steel, cast iron, wrought iron and more."
  },
  {
    image: copperImg,
    icon: Zap,
    title: "Copper Scrap Buying",
    description: "Best market rates for copper wires, pipes, coils and all copper-based scrap materials."
  },
  {
    image: aluminiumImg,
    icon: Layers,
    title: "Aluminium Scrap Buying",
    description: "Premium prices for aluminium scrap including utensils, window frames, sheets and cables."
  },
  {
    image: acFridgeImg,
    icon: Wind,
    title: "AC / Fridge Scrap Buying",
    description: "We buy old ACs, refrigerators, washing machines and all home appliances at fair prices."
  },
  {
    image: pickupImg,
    icon: Truck,
    title: "Doorstep Scrap Pickup",
    description: "Free doorstep pickup service across Chennai. Schedule a convenient time and we'll come to you."
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background scroll-mt-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-800 text-foreground">
              Our <span className="shimmer-text">Services</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Comprehensive scrap buying services across Chennai with the best prices and hassle-free experience.
            </p>
          </div>
          <Link
            to="/services"
            className="flex items-center gap-2 text-gold font-600 hover:gap-3 transition-all duration-200 flex-shrink-0">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-gold transition-all duration-300 hover:-translate-y-1">

                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="flex items-center gap-2.5 text-foreground font-700 text-lg group-hover:text-gold transition-colors">
                    <Icon className="w-5 h-5 text-gold flex-shrink-0" />
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
