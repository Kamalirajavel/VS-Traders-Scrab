import { ArrowRight } from "lucide-react";
import uploadImg from "@/assets/how-it-works-upload.jpg";
import estimateImg from "@/assets/how-it-works-estimate.jpg";
import scheduleImg from "@/assets/how-it-works-schedule.jpg";
import paymentImg from "@/assets/how-it-works-payment.jpg";

const steps = [
  {
    step: "01",
    title: "Upload Scrap Details",
    description: "Share details or photos of your scrap material through WhatsApp or our contact form.",
    image: uploadImg,
  },
  {
    step: "02",
    title: "Get Price Estimate",
    description: "Our team will evaluate and provide you with the best market price for your scrap.",
    image: estimateImg,
  },
  {
    step: "03",
    title: "Schedule Pickup",
    description: "Choose a convenient time for our team to pick up the scrap directly from your location.",
    image: scheduleImg,
  },
  {
    step: "04",
    title: "Instant Payment",
    description: "Receive immediate cash payment after the pickup is completed. Fast and hassle-free.",
    image: paymentImg,
  },
];

const StepImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/50 mb-5 flex-shrink-0 shadow-[0_0_18px_rgba(212,175,55,0.35)] bg-background ring-4 ring-gold/10 group-hover:border-gold group-hover:ring-gold/25 group-hover:shadow-[0_0_28px_rgba(212,175,55,0.55)] transition-all duration-300 mx-auto">
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </div>
);

const StepCard = ({ step, className = "" }: { step: typeof steps[0]; className?: string }) => (
  <div className={`relative z-10 bg-background border border-border rounded-2xl p-7 w-full h-full flex flex-col items-center text-center hover:border-gold/50 hover:shadow-gold transition-all duration-300 hover:-translate-y-1 group ${className}`}>
    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full gradient-gold text-background text-xs font-800 flex items-center justify-center shadow-gold z-10">
      {step.step}
    </div>
    <StepImage src={step.image} alt={step.title} />
    <h3 className="text-foreground font-700 text-lg mb-3">{step.title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-surface">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-800 text-foreground">
            How It <span className="shimmer-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Selling your scrap has never been easier. Just 4 simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Desktop row */}
          <div className="hidden lg:flex items-stretch gap-0">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="flex items-stretch flex-1 min-w-0"
                style={index === steps.length - 1 ? { maxWidth: "calc(25% - 4%)" } : undefined}
              >
                <StepCard step={step} />
                {index < steps.length - 1 && (
                  <div className="flex items-center self-center px-3 flex-shrink-0">
                    <div className="w-8 h-px bg-gradient-to-r from-gold/60 to-gold/20" />
                    <ArrowRight className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tablet: 2×2 grid */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <StepCard step={step} />
                {(index === 0 || index === 2) && (
                  <div className="absolute top-7 -right-5 flex items-center z-20">
                    <div className="w-3 h-px bg-gold/60" />
                    <ArrowRight className="w-4 h-4 text-gold/60" />
                  </div>
                )}
                {index === 1 && (
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-px h-5 bg-gradient-to-b from-gold/60 to-gold/20" />
                    <ArrowRight className="w-4 h-4 text-gold/60 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: 2 col grid */}
          <div className="grid grid-cols-2 md:hidden gap-5">
            {steps.map((step) => (
              <div key={step.step} className="relative">
                <StepCard step={step} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
