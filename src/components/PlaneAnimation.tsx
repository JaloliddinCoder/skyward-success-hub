import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";

const PlaneAnimation = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const timeoutRef = { current: null as NodeJS.Timeout | null };

  const showPlane = useCallback(() => {
    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 1800);
  }, []);

  // Show on scroll
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const delta = Math.abs(window.scrollY - lastY);
          if (delta > 30) {
            showPlane();
            lastY = window.scrollY;
          }
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showPlane]);

  // Show on route change
  useEffect(() => {
    showPlane();
  }, [location.pathname, showPlane]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="plane"
          initial={{ x: "-10vw", y: "40vh", opacity: 0, rotate: -10 }}
          animate={{ x: "110vw", y: "20vh", opacity: 1, rotate: 5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ width: 0, height: 0 }}
        >
          <Plane className="w-8 h-8 text-gold drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 8px hsl(40 65% 52% / 0.5))" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaneAnimation;
