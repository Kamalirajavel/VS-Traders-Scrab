import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                <span className="text-background font-900 text-lg">VS</span>
              </div>
              <div>
                <p className="text-foreground font-800 text-lg leading-tight">V.S Traders</p>
                <p className="text-gold text-[10px] font-500 uppercase tracking-widest">Premium Scrap Buyers</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Best price scrap buyers in Chennai. We offer doorstep pickup for e-waste, iron, copper, aluminium and home appliances.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-foreground font-700 text-sm uppercase tracking-widest gold-underline pb-2">Quick Links</h4>
            <ul className="space-y-3 mt-6">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground text-sm hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-5">
            <h4 className="text-foreground font-700 text-sm uppercase tracking-widest gold-underline pb-2">Services</h4>
            <ul className="space-y-3 mt-6">
              {[
                "E-waste Scrap Buying",
                "Iron Scrap Buying",
                "Copper Scrap Buying",
                "Aluminium Scrap Buying",
                "AC/Fridge Scrap",
                "Doorstep Pickup",
              ].map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-foreground font-700 text-sm uppercase tracking-widest gold-underline pb-2">Contact Us</h4>
            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm leading-relaxed">
                  No:19 Thirumalai Street,<br />
                  Venkateshwara Nagar,<br />
                  Ambattur, Chennai – 600053
                </span>
              </li>
              <li>
                <a href="tel:9500805193" className="flex items-center gap-3 text-muted-foreground text-sm hover:text-gold transition-colors">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  9500805193
                </a>
              </li>
              <li>
                <a href="https://wa.me/919500805193" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground text-sm hover:text-gold transition-colors">
                  <MessageCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  WhatsApp: 9500805193
                </a>
              </li>
              <li>
                <a href="mailto:vstraders818@gmail.com" className="flex items-center gap-3 text-muted-foreground text-sm hover:text-gold transition-colors">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  vstraders818@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            © 2026 V.S Traders. All Rights Reserved.
          </p>
          <a
            href="https://gloovup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-xs hover:text-gold transition-colors"
          >
            Powered by{" "}
            <span className="text-gold font-600">Gloov Up Group</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
