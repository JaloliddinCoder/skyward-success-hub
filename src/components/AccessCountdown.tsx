import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar, AlertTriangle } from "lucide-react";

interface AccessCountdownProps {
  accessUntil: string;
}

const AccessCountdown = ({ accessUntil }: AccessCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [percentageLeft, setPercentageLeft] = useState(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(accessUntil);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    const calculatePercentage = () => {
      const endDate = new Date(accessUntil);
      const startDate = new Date(endDate.getTime() - 180 * 24 * 60 * 60 * 1000); // 6 months before
      const now = new Date();
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsed = now.getTime() - startDate.getTime();
      return Math.max(0, Math.min(100, 100 - (elapsed / totalDuration) * 100));
    };

    const tick = () => {
      setTimeLeft(calculateTimeLeft());
      setPercentageLeft(calculatePercentage());
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [accessUntil]);

  const isExpiringSoon = timeLeft.days < 14;
  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  const timeUnits = [
    { value: timeLeft.days, label: "Kun" },
    { value: timeLeft.hours, label: "Soat" },
    { value: timeLeft.minutes, label: "Daqiqa" },
    { value: timeLeft.seconds, label: "Soniya" },
  ];

  const accessEndDate = new Date(accessUntil).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isExpired) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">
                Kirish muddati tugagan
              </h3>
              <p className="text-muted-foreground text-sm">
                Kitobga kirish uchun qayta sotib oling
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isExpiringSoon ? "border-amber-500/30" : "border-gold/30"}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${isExpiringSoon ? "text-amber-500" : "text-gold"}`} />
          Kirish muddati
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {accessEndDate} gacha
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2">
          {timeUnits.map((unit) => (
            <motion.div
              key={unit.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className={`
                rounded-lg p-2 border
                ${isExpiringSoon 
                  ? "bg-amber-500/10 border-amber-500/20" 
                  : "bg-gold/10 border-gold/20"
                }
              `}>
                <span className={`
                  font-display text-xl font-bold
                  ${isExpiringSoon ? "text-amber-600" : "text-gold"}
                `}>
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-muted-foreground text-xs mt-1 block">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>6 oylik muddat</span>
            <span>{Math.round(percentageLeft)}% qoldi</span>
          </div>
          <Progress 
            value={percentageLeft} 
            className={`h-2 ${isExpiringSoon ? "[&>div]:bg-amber-500" : "[&>div]:bg-gold"}`} 
          />
        </div>

        {isExpiringSoon && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-amber-600 text-xs flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" />
              Kirish muddati tugashiga oz qoldi!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessCountdown;
