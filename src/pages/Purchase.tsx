import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane, User, Calendar, ArrowLeft, Send } from "lucide-react";
import { z } from "zod";

const purchaseSchema = z.object({
  fullName: z.string().trim().min(2, "Ism kamida 2 ta belgi bo'lishi kerak").max(100),
  age: z.number().min(16, "Yosh kamida 16 bo'lishi kerak").max(65, "Yosh 65 dan oshmasligi kerak"),
});

const Purchase = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = purchaseSchema.safeParse({
      fullName,
      age: parseInt(age),
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    // Save as lead
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error: insertError } = await supabase.from("leads").insert({
        full_name: result.data.fullName,
        age: result.data.age,
        user_id: session?.user.id,
      });

      if (insertError) throw insertError;
    } catch (err: any) {
      // Continue even if insert fails (might be duplicate)
      console.log("Lead insert note:", err.message);
    }

    // Redirect to Telegram
    const message = encodeURIComponent(
      `Salom! Men kitob sotib olmoqchiman.\nIsm: ${result.data.fullName}\nYosh: ${result.data.age}`
    );
    window.open(`https://t.me/Dew0277?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-background rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Plane className="w-6 h-6 text-gold" />
              <span className="font-display text-xl font-bold text-foreground">
                Skyward Mentor
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Kitobni sotib olish
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Ma'lumotlaringizni kiriting va Telegram orqali bog'laning
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6 flex items-center gap-2">
              <span className="text-destructive text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Ism va familiya</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ismingiz va familiyangiz"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="age">Yoshingiz</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="age"
                  type="number"
                  placeholder="Yoshingizni kiriting"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="pl-10"
                  min={16}
                  max={65}
                />
              </div>
            </div>

            <Button variant="premium" size="lg" className="w-full gap-2">
              <Send className="w-4 h-4" />
              Telegram orqali bog'lanish
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gold hover:text-gold/80 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Purchase;
