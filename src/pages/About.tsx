import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { MapPin, Phone, Mail, Users, Calendar, Recycle, TrendingUp } from "lucide-react";

const stats = [
  { value: "500+", label: "Happy Customers", icon: Users },
  { value: "10+", label: "Years Experience", icon: Calendar },
  { value: "10+", label: "Scrap Types", icon: Recycle },
  { value: "100%", label: "Best Price", icon: TrendingUp },
];

const About = () => {
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
              <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">About Us</span>
              <h1 className="text-5xl md:text-6xl font-800 text-foreground leading-tight">
                About <span className="shimmer-text">V.S Traders</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Chennai's most trusted premium scrap buying service, committed to offering the best prices with responsible recycling practices.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">Our Story</span>
                <h2 className="text-4xl font-800 text-foreground">
                  A Decade of Trust in <span className="shimmer-text">Chennai</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    V.S Traders was founded by Vimalraj with a simple mission – to make scrap selling easy, transparent and profitable for every customer in Chennai.
                  </p>
                  <p>
                    We purchase all types of scrap materials including e-waste, iron, copper, aluminium and home appliances. Our team ensures every customer receives the best market price for their scrap.
                  </p>
                  <p>
                    Our goal is to provide customers with the best price and quick doorstep scrap pickup service. We focus on responsible recycling and proper disposal of electronic waste to contribute to a cleaner, greener Chennai.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-surface border border-border rounded-2xl p-6 text-center hover:border-gold/50 hover:shadow-gold transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-5 h-5 text-gold" />
                    </div>
                    <p className="text-gold text-3xl font-800">{stat.value}</p>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="py-24 bg-surface">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">Our Founder</span>
              <div className="bg-background border border-border rounded-3xl p-10 shadow-card">
                <div className="w-24 h-24 mx-auto rounded-2xl gradient-gold flex items-center justify-center shadow-gold mb-6 animate-float">
                  <span className="text-background font-900 text-3xl">V</span>
                </div>
                <h3 className="text-foreground font-800 text-3xl">Vimalraj</h3>
                <p className="text-gold font-600 mt-2 mb-6">Founder & CEO, V.S Traders</p>
                <p className="text-muted-foreground leading-relaxed text-lg italic">
                  "Our mission is simple – give every customer the best price and the most convenient scrap pickup experience in Chennai. We believe in building long-term relationships based on trust and transparency."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">Find Us</span>
              <h2 className="text-4xl font-800 text-foreground">
                Our <span className="shimmer-text">Location</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: MapPin, title: "Address", info: "No:19 Thirumalai Street, Venkateshwara Nagar, Ambattur, Chennai – 600053" },
                { icon: Phone, title: "Phone", info: "9500805193" },
                { icon: Mail, title: "Email", info: "vstraders818@gmail.com" },
              ].map((item) => (
                <div key={item.title} className="bg-surface border border-border rounded-2xl p-7 text-center hover:border-gold/50 hover:shadow-gold transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-gold" />
                  </div>
                  <p className="text-gold font-700 text-sm uppercase tracking-wider mb-2">{item.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.info}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default About;
