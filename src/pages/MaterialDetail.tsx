import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ironImg from "@/assets/scrap-iron.jpg";
import copperImg from "@/assets/scrap-copper.jpg";
import aluminiumImg from "@/assets/scrap-aluminium.jpg";
import ewasteImg from "@/assets/scrap-ewaste.jpg";
import acImg from "@/assets/scrap-ac.jpg";
import fridgeImg from "@/assets/scrap-fridge.jpg";
import washingImg from "@/assets/scrap-washingmachine.jpg";
import tvImg from "@/assets/scrap-tv.jpg";
import mobileImg from "@/assets/scrap-mobileboards.jpg";
import paperImg from "@/assets/scrap-paperplastic.jpg";

const materials: Record<string, {
  label: string;
  image: string;
  description: string;
  benefits: string[];
}> = {
  iron: {
    label: "Iron Scrap",
    image: ironImg,
    description: "We buy all types of iron scrap including old gates, grills, rods, beams and structural steel at the best market rates with doorstep pickup. Iron is one of the most commonly recycled metals and we ensure you get the highest possible price for your scrap.",
    benefits: [
      "Best market rate guaranteed",
      "Free doorstep pickup across Chennai",
      "Accepts all grades of iron scrap",
      "Instant cash payment on pickup",
      "Eco-friendly recycling process",
    ],
  },
  copper: {
    label: "Copper Scrap",
    image: copperImg,
    description: "Premium rates for copper wires, pipes, motors and fittings. Copper is one of the highest-value metals we purchase — get an instant quote today. We buy all forms of copper including bare bright, #1 copper, #2 copper, copper tubing and more.",
    benefits: [
      "Highest value metal – best prices",
      "Same-day pickup available",
      "All copper grades accepted",
      "Transparent weighing process",
      "Instant cash or bank transfer",
    ],
  },
  aluminium: {
    label: "Aluminium Scrap",
    image: aluminiumImg,
    description: "Sell aluminium sheets, utensils, window frames and profiles at competitive prices. We offer same-day pickup anywhere in Chennai. Aluminium is 100% recyclable and we ensure responsible processing of every kilogram you sell.",
    benefits: [
      "Competitive aluminium pricing",
      "Same-day pickup in Chennai",
      "Accepts utensils, frames and sheets",
      "Accurate weight measurement",
      "Cash payment on the spot",
    ],
  },
  "e-waste": {
    label: "E-waste Scrap",
    image: ewasteImg,
    description: "Responsibly recycle electronic waste including circuit boards, cables, batteries and old appliances. We ensure eco-friendly disposal and extraction of valuable metals. Our process is fully certified and environmentally responsible.",
    benefits: [
      "Certified eco-friendly disposal",
      "Best price for circuit boards and cables",
      "All electronic appliances accepted",
      "Zero landfill waste guarantee",
      "Doorstep collection service",
    ],
  },
  ac: {
    label: "AC Scrap",
    image: acImg,
    description: "Sell your old or broken air conditioners — window AC, split AC or central units. We dismantle and recycle all components professionally. Get the best price for your old AC regardless of brand or condition.",
    benefits: [
      "All brands and models accepted",
      "Window AC and split AC purchased",
      "Safe refrigerant handling",
      "Free pickup and dismantling",
      "Fair pricing by weight and parts",
    ],
  },
  fridge: {
    label: "Fridge Scrap",
    image: fridgeImg,
    description: "Get the best price for old refrigerators regardless of brand or condition. Our team handles safe pickup and eco-friendly recycling of all refrigerator components. We accept single door, double door and commercial refrigerators.",
    benefits: [
      "All refrigerator types accepted",
      "Safe compressor gas handling",
      "Free pickup from your location",
      "Best price per kilogram",
      "Eco-certified recycling process",
    ],
  },
  "washing-machine": {
    label: "Washing Machine Scrap",
    image: washingImg,
    description: "Sell your old washing machine — top load or front load. We accept all brands and conditions and offer free doorstep pickup. Our team handles safe disconnection, pickup and recycling of all parts including motors and drums.",
    benefits: [
      "Top load and front load accepted",
      "All brands and conditions",
      "Free doorstep pickup service",
      "Motor and drum priced separately",
      "Instant payment guaranteed",
    ],
  },
  tv: {
    label: "TV Scrap",
    image: tvImg,
    description: "Recycle old televisions including CRT, LCD and LED models. We offer fair prices and ensure responsible e-waste disposal. Our team handles collection and certified recycling of all TV components safely.",
    benefits: [
      "CRT, LCD and LED accepted",
      "Responsible e-waste processing",
      "All sizes and brands purchased",
      "Free collection service",
      "Certified recycling facility",
    ],
  },
  "mobile-boards": {
    label: "Mobile Boards Scrap",
    image: mobileImg,
    description: "Sell PCBs, motherboards and mobile circuit boards for recycling. These contain valuable metals including gold, silver and copper that fetch premium rates. We offer the best prices for electronic boards in Chennai.",
    benefits: [
      "Premium rates for PCBs",
      "Gold and silver recovery pricing",
      "All circuit board types accepted",
      "Bulk quantity discounts",
      "Instant quote available",
    ],
  },
  "paper-plastic": {
    label: "Paper & Plastic Scrap",
    image: paperImg,
    description: "We collect old newspapers, cardboard boxes, plastic bottles and packaging material. Best rates guaranteed with free pickup service. We ensure proper segregation and recycling of all paper and plastic waste.",
    benefits: [
      "Newspapers, cardboard and plastic accepted",
      "Best market rates guaranteed",
      "Free pickup for bulk quantities",
      "Promotes sustainable recycling",
      "Regular pickup schedule available",
    ],
  },
};

const MaterialDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const material = slug ? materials[slug] : null;

  if (!material) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-800 text-foreground">Material Not Found</h1>
            <Link to="/services" className="text-gold hover:underline">← Back to Services</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Banner */}
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
          <img
            src={material.image}
            alt={material.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-4 md:left-8 mt-16 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/70 border border-border backdrop-blur-sm text-muted-foreground hover:text-gold hover:border-gold transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {/* Title over hero */}
          <div className="absolute bottom-8 left-4 md:left-16 right-4 md:right-16 z-10">
            <span className="text-gold text-xs font-700 uppercase tracking-[0.3em] mb-2 block">Scrap Material</span>
            <h1 className="text-4xl md:text-6xl font-800 text-foreground leading-tight">
              {material.label}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-16 py-16 max-w-4xl">
          <div className="space-y-12">
            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-800 text-foreground">About this Material</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{material.description}</p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <h2 className="text-2xl font-800 text-foreground">Why Sell With Us</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {material.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 bg-surface border border-border rounded-xl p-4 hover:border-gold/40 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm font-500">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-surface border border-border rounded-2xl p-8 text-center space-y-4">
              <h3 className="text-2xl font-800 text-foreground">Ready to Sell?</h3>
              <p className="text-muted-foreground">Get the best price for your {material.label.toLowerCase()} with free doorstep pickup.</p>
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 px-8 py-4 gradient-gold text-background font-800 rounded-xl shadow-gold hover:opacity-90 transition-all duration-200 text-lg"
              >
                Sell Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MaterialDetail;
