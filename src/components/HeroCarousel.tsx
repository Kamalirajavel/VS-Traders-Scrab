import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroSlide1 from "@/assets/hero-slide-1.jpg";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  index_number: number | null;
  status: string;
}

const scrapItems = ["Iron", "Copper", "E-Waste", "Aluminium"];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("status", "Active")
        .order("index_number", { ascending: true, nullsFirst: false });

      if (!error && data && data.length > 0) {
        setBanners(data);
      } else {
        // Fallback to default slides if no banners
        setBanners([]);
      }
      setLoading(false);
    };
    fetchBanners();
  }, []);

  const slides = banners.length > 0
    ? banners.map((b) => ({
        title: b.title,
        highlight: "",
        description: b.description || "",
        button: "Request Pickup",
        link: "/services",
        badge: "Trusted by 500+ Customers",
        bg: b.image_url || heroSlide1,
      }))
    : [
        {
          title: "Best Price Scrap",
          highlight: "Buyer in Chennai",
          description: "Sell your scrap materials easily with our quick doorstep pickup service. Get instant payment at the best market price.",
          button: "Request Pickup",
          link: "/services",
          badge: "Trusted by 500+ Customers",
          bg: heroSlide1,
        },
      ];

  const goTo = (index: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [current, slides.length]);

  // Reset current index if slides change
  useEffect(() => {
    setCurrent(0);
  }, [banners.length]);

  if (loading) {
    return (
      <section className="relative min-h-[35vh] md:min-h-[80vh] flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative min-h-[35vh] md:min-h-[80vh] flex items-center overflow-hidden bg-background">
      {/* Left dark background */}
      <div className="absolute inset-0 z-0 bg-background" />

      {/* Right side: slide images */}
      <div className="absolute inset-0 z-0">
        {/* Mobile: image covers top half */}
        <div className="block lg:hidden absolute inset-x-0 top-0 h-[45%]">
          {slides.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <img src={s.bg} alt={s.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
            </div>
          ))}
        </div>

        {/* Desktop: image on right half */}
        <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full">
          {slides.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <img src={s.bg} alt={s.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />
            </div>
          ))}
        </div>

        {/* Desktop: left side dark gradient */}
        <div className="hidden lg:block absolute left-0 top-0 w-1/2 h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background to-background/95" />
        </div>
      </div>

      {/* Background dot pattern */}
      <div className="absolute left-0 top-0 w-1/2 h-full opacity-5 z-[1] hidden lg:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Glowing orb */}
      <div
        className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl z-[1] hidden lg:block"
        style={{ background: `radial-gradient(circle, hsl(var(--gold) / 0.15), transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 w-full pt-28 pb-20">
        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col">
          <div className="h-[40vw] min-h-[180px]" />
          <div
            className={`px-5 pt-6 pb-8 space-y-6 transition-all duration-500 ${
              animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse flex-shrink-0" />
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">{slide.badge}</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground">
              {slide.title}
              {slide.highlight && (
                <>
                  <br />
                  <span className="shimmer-text">{slide.highlight}</span>
                </>
              )}
            </h1>
            {slide.description && (
              <p className="text-base text-muted-foreground leading-relaxed">{slide.description}</p>
            )}
            <div className="flex flex-wrap gap-3 items-center">
              <Link
                to={slide.link}
                className="inline-flex items-center gap-2 px-6 py-3 gradient-gold text-background font-bold rounded-xl shadow-gold hover:opacity-90 transition-all duration-200 text-sm"
              >
                {slide.button}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:9500805193"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gold/30 text-foreground font-semibold rounded-xl hover:bg-gold/10 hover:border-gold transition-all duration-200 text-sm"
              >
                Call Now
              </a>
            </div>
            <div className="flex flex-wrap gap-6 pt-1">
              {[
                { value: "500+", label: "Happy Customers" },
                { value: "10+", label: "Years Experience" },
                { value: "100%", label: "Best Price" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-0.5">
                  <p className="text-2xl font-extrabold text-gold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-0 items-center min-h-[80vh] container mx-auto px-4 lg:px-8">
          <div
            className={`space-y-7 pr-8 transition-all duration-500 ${
              animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse flex-shrink-0" />
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">{slide.badge}</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground">
                {slide.title}
                {slide.highlight && (
                  <>
                    <br />
                    <span className="shimmer-text">{slide.highlight}</span>
                  </>
                )}
              </h1>
            </div>
            {slide.description && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">{slide.description}</p>
            )}
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to={slide.link}
                className="inline-flex items-center gap-2 px-7 py-3.5 gradient-gold text-background font-bold rounded-xl shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200 text-base"
              >
                {slide.button}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:9500805193"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-gold/30 text-foreground font-semibold rounded-xl hover:bg-gold/10 hover:border-gold transition-all duration-200 text-base"
              >
                Call Now
              </a>
            </div>
            <div className="flex flex-wrap gap-8 pt-2">
              {[
                { value: "500+", label: "Happy Customers" },
                { value: "10+", label: "Years Experience" },
                { value: "100%", label: "Best Price" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-3xl font-extrabold text-gold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel controls — only show if multiple slides */}
        {slides.length > 1 && (
          <div className="flex items-center gap-6 mt-10 container mx-auto px-4 lg:px-8">
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? "w-8 h-2 bg-gold" : "w-2 h-2 bg-border hover:bg-gold/50"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
