import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Plane } from "lucide-react";

interface TrailDot {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

interface SectionTarget {
  id: string;
  x: number; // vw
  y: number; // vh
  rotation: number;
}

// Each section has a target point where the plane should guide attention
const SECTION_TARGETS: SectionTarget[] = [
  { id: "hero", x: 30, y: 55, rotation: 130 },        // Points to CTA buttons
  { id: "lead-capture", x: 65, y: 50, rotation: 45 },  // Points to form
  { id: "expert-story", x: 35, y: 45, rotation: -20 }, // Points to expert info
  { id: "book-features", x: 70, y: 50, rotation: 30 }, // Points to features list
  { id: "flipbook-preview", x: 60, y: 40, rotation: 50 }, // Points to book preview
  { id: "bonus-section", x: 40, y: 50, rotation: -30 },   // Points to bonuses
];

const PlaneAnimation = () => {
  const [visible, setVisible] = useState(false);
  const [planePos, setPlanePos] = useState({ x: 50, y: 50 });
  const [planeRotation, setPlaneRotation] = useState(90);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const location = useLocation();
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const trailId = useRef(0);
  const currentX = useRef(50);
  const currentY = useRef(50);
  const currentRot = useRef(90);
  const idleFrame = useRef<number>(0);
  const lastScrollY = useRef(0);

  const showPlane = useCallback(() => {
    setVisible(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setVisible(false), 4000);
  }, []);

  // Detect which section is in view
  useEffect(() => {
    const sectionIds = SECTION_TARGETS.map((s) => s.id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionIds.indexOf(entry.target.id);
            if (idx !== -1) {
              setActiveSection(idx);
              showPlane();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observe after a short delay to let DOM render
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [showPlane, location.pathname]);

  // Smooth animation loop
  useEffect(() => {
    let time = 0;

    const animate = () => {
      time += 0.01;
      const target = SECTION_TARGETS[activeSection];
      if (!target) {
        idleFrame.current = requestAnimationFrame(animate);
        return;
      }

      // Add gentle hovering motion around target
      const hoverX = Math.sin(time * 1.2) * 3 + Math.sin(time * 2.1) * 1.5;
      const hoverY = Math.cos(time * 0.9) * 2.5 + Math.sin(time * 1.7) * 1;

      const goalX = target.x + hoverX;
      const goalY = target.y + hoverY;
      const goalRot = target.rotation + Math.sin(time * 1.5) * 8;

      // Smooth lerp
      const lerp = 0.03;
      currentX.current += (goalX - currentX.current) * lerp;
      currentY.current += (goalY - currentY.current) * lerp;
      currentRot.current += (goalRot - currentRot.current) * lerp;

      // Clamp
      currentX.current = Math.min(85, Math.max(15, currentX.current));
      currentY.current = Math.min(85, Math.max(15, currentY.current));

      setPlanePos({ x: currentX.current, y: currentY.current });
      setPlaneRotation(currentRot.current);

      // Trail
      if (visible) {
        const dot: TrailDot = {
          id: ++trailId.current,
          x: currentX.current,
          y: currentY.current,
          createdAt: Date.now(),
        };
        setTrail((prev) => [...prev.slice(-50), dot]);
      }

      idleFrame.current = requestAnimationFrame(animate);
    };

    idleFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(idleFrame.current);
  }, [activeSection, visible]);

  // Show on scroll
  useEffect(() => {
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY.current);
      if (delta > 30) {
        showPlane();
        lastScrollY.current = window.scrollY;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showPlane]);

  // Route change trigger
  useEffect(() => {
    showPlane();
  }, [location.pathname, showPlane]);

  // Clean old trail dots
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((d) => now - d.createdAt < 2500));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!visible && trail.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Trail */}
      {trail.map((dot) => {
        const age = (Date.now() - dot.createdAt) / 2500;
        const opacity = Math.max(0, 1 - age);
        return (
          <div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              left: `${dot.x}vw`,
              top: `${dot.y}vh`,
              width: `${5 + (1 - opacity) * 4}px`,
              height: `${5 + (1 - opacity) * 4}px`,
              opacity: opacity * 0.6,
              background: `radial-gradient(circle, hsl(40 65% 62% / ${opacity}), hsl(40 65% 52% / ${opacity * 0.3}))`,
              boxShadow: `0 0 ${6 + (1 - opacity) * 5}px hsl(40 65% 52% / ${opacity * 0.4})`,
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
            transform: `translate(-50%, -50%) rotate(${planeRotation}deg)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          <Plane
            className="w-10 h-10 text-gold"
            style={{
              filter: "drop-shadow(0 0 12px hsl(40 65% 52% / 0.7))",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PlaneAnimation;
