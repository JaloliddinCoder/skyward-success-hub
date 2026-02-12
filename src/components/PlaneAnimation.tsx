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
  const [planePos, setPlanePos] = useState({ x: 50, y: 50 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const location = useLocation();
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const trailId = useRef(0);
  const lastScrollY = useRef(0);
  const animFrame = useRef<number>(0);
  const velocityY = useRef(0);
  const velocityX = useRef(0);
  const targetY = useRef(50);
  const targetX = useRef(50);
  const currentY = useRef(50);
  const currentX = useRef(50);
  const isScrolling = useRef(false);
  const idleFrame = useRef<number>(0);

  const showPlane = useCallback(() => {
    setVisible(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setVisible(false), 3000);
  }, []);

  // Smooth idle drift when not scrolling
  useEffect(() => {
    let time = 0;
    const drift = () => {
      time += 0.008;
      if (!isScrolling.current) {
        // Gentle figure-8 drift pattern
        targetY.current = 50 + Math.sin(time * 0.7) * 12 + Math.sin(time * 1.3) * 5;
        targetX.current = 50 + Math.sin(time * 0.5) * 8 + Math.cos(time * 0.9) * 4;
      }

      // Smooth interpolation (lerp) for buttery movement
      const lerpFactor = 0.04;
      currentX.current += (targetX.current - currentX.current) * lerpFactor;
      currentY.current += (targetY.current - currentY.current) * lerpFactor;

      // Clamp to center area
      currentX.current = Math.min(65, Math.max(35, currentX.current));
      currentY.current = Math.min(80, Math.max(20, currentY.current));

      setPlanePos({ x: currentX.current, y: currentY.current });

      // Add trail when visible
      if (visible) {
        const dot: TrailDot = {
          id: ++trailId.current,
          x: currentX.current,
          y: currentY.current,
          createdAt: Date.now(),
        };
        setTrail((prev) => [...prev.slice(-60), dot]);
      }

      idleFrame.current = requestAnimationFrame(drift);
    };

    idleFrame.current = requestAnimationFrame(drift);
    return () => cancelAnimationFrame(idleFrame.current);
  }, [visible]);

  // Scroll-driven target updates
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;

      if (Math.abs(delta) > 5) {
        isScrolling.current = true;
        setVisible(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => setVisible(false), 3000);

        // Scroll affects target with momentum
        velocityY.current += delta * 0.08;
        velocityX.current += Math.sin(scrollY * 0.005) * delta * 0.03;

        // Apply velocity with damping
        targetY.current += velocityY.current;
        targetX.current += velocityX.current;
        velocityY.current *= 0.85;
        velocityX.current *= 0.85;

        // Soft bounce back toward center
        targetY.current += (50 - targetY.current) * 0.02;
        targetX.current += (50 - targetX.current) * 0.02;

        lastScrollY.current = scrollY;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
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

  // Calculate rotation based on movement direction
  const rotation = Math.atan2(
    velocityY.current,
    velocityX.current
  ) * (180 / Math.PI) + 90;

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
            }}
          />
        );
      })}

      {/* Plane */}
      {visible && (
        <div
          className="absolute"
          style={{
            left: `${planePos.x}vw`,
            top: `${planePos.y}vh`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            transition: "transform 0.3s ease-out",
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
