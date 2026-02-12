import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Plane } from "lucide-react";

interface TrailDot {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

const PlaneAnimation = () => {
  const [visible, setVisible] = useState(false);
  const [planePos, setPlanePos] = useState({ x: 50, y: -30 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const location = useLocation();
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const trailId = useRef(0);
  const lastScrollY = useRef(0);
  const animFrame = useRef<number>(0);

  const showPlane = useCallback(() => {
    setVisible(true);
    setPlanePos({ x: 50, y: -30 });
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setVisible(false), 2500);
  }, []);

  // Scroll-driven movement
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        animFrame.current = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const delta = scrollY - lastScrollY.current;
          const absDelta = Math.abs(delta);

          if (absDelta > 15) {
            setVisible(true);
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
            hideTimeout.current = setTimeout(() => setVisible(false), 2000);

            setPlanePos((prev) => {
              const newY = Math.min(110, Math.max(-30, prev.y + delta * 0.15));
              // Slight horizontal sway
              const sway = Math.sin(scrollY * 0.01) * 8;
              const newX = 50 + sway;

              // Add trail dot
              const dot: TrailDot = {
                id: ++trailId.current,
                x: newX,
                y: newY,
                createdAt: Date.now(),
              };
              setTrail((prev) => [...prev.slice(-60), dot]);

              return { x: newX, y: newY };
            });

            lastScrollY.current = scrollY;
          }
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animFrame.current);
    };
  }, []);

  // Route change trigger
  useEffect(() => {
    showPlane();
  }, [location.pathname, showPlane]);

  // Clean old trail dots
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((d) => now - d.createdAt < 3000));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!visible && trail.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Trail dots */}
      {trail.map((dot) => {
        const age = (Date.now() - dot.createdAt) / 3000;
        const opacity = Math.max(0, 1 - age);
        return (
          <div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              left: `${dot.x}vw`,
              top: `${dot.y}vh`,
              width: `${6 + (1 - opacity) * 5}px`,
              height: `${6 + (1 - opacity) * 5}px`,
              opacity: opacity * 0.7,
              background: `radial-gradient(circle, hsl(40 65% 62% / ${opacity}), hsl(40 65% 52% / ${opacity * 0.4}))`,
              boxShadow: `0 0 ${8 + (1 - opacity) * 6}px hsl(40 65% 52% / ${opacity * 0.5})`,
              transform: "translate(-50%, -50%)",
              transition: "opacity 0.3s ease-out",
            }}
          />
        );
      })}

      {/* Plane */}
      {visible && (
        <div
          className="absolute transition-all duration-200 ease-out"
          style={{
            left: `${planePos.x}vw`,
            top: `${planePos.y}vh`,
            transform: "translate(-50%, -50%) rotate(90deg)",
          }}
        >
          <Plane
            className="w-12 h-12 text-gold"
            style={{
              filter: "drop-shadow(0 0 10px hsl(40 65% 52% / 0.6))",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PlaneAnimation;
