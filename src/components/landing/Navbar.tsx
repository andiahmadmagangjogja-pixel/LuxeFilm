import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Layanan", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Harga", href: "#pricing" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#contact"},
   {/*{ label: "Admin⭐", href: "/admin/login", type: "route" },*/}
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        <a href="#hero" className="font-heading text-xl md:text-2xl font-bold tracking-wider">
          <span className="gold-gradient-text">LUXE</span>
          <span className="text-foreground">FILMS</span>
        </a>

       {/* Desktop */}
<div className="hidden md:flex items-center gap-8">
  {navLinks.map((link) => (
    <a
      key={link.href}
      href={link.href}
      className="text-sm font-body text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase py-2"
    >
      {link.label}
    </a>
  ))}

  <a
    href="#contact"
    className="gold-gradient-bg text-primary-foreground px-6 py-2.5 text-sm font-semibold tracking-wide uppercase rounded-sm hover:opacity-90 transition-opacity"
  >
    Booking
  </a>
</div>


        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/30 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-body text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="gold-gradient-bg text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wide uppercase text-center rounded-sm mt-2"
              >
                Booking Sekarang
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </nav>
    
  );
}
