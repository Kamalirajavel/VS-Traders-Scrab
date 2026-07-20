import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/", anchor: null },
  { label: "About", path: "/", anchor: "about" },
  { label: "Services", path: "/", anchor: "services" },
  { label: "Contact", path: "/contact", anchor: null },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.anchor) {
      if (location.pathname === "/") {
        // Already on home page — scroll to section
        const el = document.getElementById(link.anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Navigate to home then scroll
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(link.anchor!);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } else {
      navigate(link.path);
    }
    setIsOpen(false);
  };

  const isActive = (link: typeof navLinks[0]) => {
    if (link.anchor) {
      return location.pathname === "/" && location.hash === `#${link.anchor}`;
    }
    return location.pathname === link.path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shadow-gold">
              <span className="text-background font-900 text-lg">VS</span>
            </div>
            <div>
              <p className="text-foreground font-800 text-lg leading-tight">V.S Traders</p>
              <p className="text-gold text-[10px] font-500 uppercase tracking-widest">Premium Scrap Buyers</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`text-sm font-600 uppercase tracking-wider transition-colors duration-200 ${
                  isActive(link)
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:9500805193"
              className="flex items-center gap-2 text-sm font-600 text-muted-foreground hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4" />
              9500805193
            </a>
            <a
              href="https://wa.me/919500805193"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-background text-sm font-700 rounded-lg shadow-gold hover:opacity-90 transition-all duration-200 hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground hover:text-gold transition-colors p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background/98 backdrop-blur-xl border-t border-border px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className={`block w-full text-left text-base font-600 uppercase tracking-wider py-2 border-b border-border transition-colors ${
                isActive(link)
                  ? "text-gold"
                  : "text-muted-foreground hover:text-gold"
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <a
              href="tel:9500805193"
              className="flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-sm font-600 text-foreground hover:border-gold hover:text-gold transition-all"
            >
              <Phone className="w-4 h-4" />
              Call: 9500805193
            </a>
            <a
              href="https://wa.me/919500805193"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 gradient-gold text-background text-sm font-700 rounded-lg shadow-gold"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
