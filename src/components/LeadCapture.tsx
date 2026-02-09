import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Calendar, AlertCircle } from "lucide-react";
import { z } from "zod";

const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Ism kamida 2 ta belgi").max(100, "Ism 100 belgidan oshmasin"),
  age: z.number().min(16, "Yosh 16 dan kam bo'lmasligi kerak").max(60, "Yosh 60 dan oshmasligi kerak"),
});

const LeadCapture = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = leadSchema.safeParse({
      fullName: name,
      age: parseInt(age),
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase.from("leads").insert({
        full_name: result.data.fullName,
        age: result.data.age,
      });

      if (insertError) {
        setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="lead-capture" className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✈️</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Rahmat, {name}!
            </h3>
            <p className="text-muted-foreground">
              Endi qo'llanmani bepul ko'rib chiqishingiz mumkin
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-capture" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Sayohatni <span className="text-gradient-gold">boshlang</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Ismingiz va yoshingizni kiriting — bort kuzatuvchisi bo'lish
            yo'lingizni boshlaymiz
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <span className="text-destructive text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ism-familiyangiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-11 h-12 bg-background border-border"
                required
                maxLength={100}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Yoshingiz"
                type="number"
                min={16}
                max={60}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="pl-11 h-12 bg-background border-border"
                required
              />
            </div>
            <Button variant="premium" size="lg" className="w-full" disabled={loading}>
              {loading ? "Yuklanmoqda..." : "Davom etish"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadCapture;
