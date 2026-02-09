import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Calendar } from "lucide-react";

const LeadCapture = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
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
                max={45}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="pl-11 h-12 bg-background border-border"
                required
              />
            </div>
            <Button variant="premium" size="lg" className="w-full">
              Davom etish
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadCapture;
