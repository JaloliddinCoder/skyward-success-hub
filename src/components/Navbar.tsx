import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className={`w-5 h-5 ${scrolled ? "text-primary" : "text-gold"}`} />
          <span
            className={`font-display text-lg font-bold ${
              scrolled ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            Skyward Mentor
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {["Kitob haqida", "Bonuslar", "Mentor"].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {item}
            </a>
          ))}
          <Button variant="hero" size="sm">
            Sotib olish
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
        >
          {mobileOpen ? (
            <X className={scrolled ? "text-foreground" : "text-primary-foreground"} />
          ) : (
            <Menu className={scrolled ? "text-foreground" : "text-primary-foreground"} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-background border-b border-border"
        >
          <div className="container mx-auto px-6 py-4 space-y-3">
            {["Kitob haqida", "Bonuslar", "Mentor"].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-muted-foreground hover:text-foreground text-sm"
              >
                {item}
              </a>
            ))}
            <Button variant="hero" size="sm" className="w-full">
              Sotib olish
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
