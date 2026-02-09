import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LeadCapture from "@/components/LeadCapture";
import ExpertStory from "@/components/ExpertStory";
import BookFeatures from "@/components/BookFeatures";
import FlipBookPreview from "@/components/FlipBookPreview";
import BonusSection from "@/components/BonusSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <LeadCapture />
      <ExpertStory />
      <BookFeatures />
      <FlipBookPreview />
      <BonusSection />
      <Footer />
    </main>
  );
};

export default Index;
