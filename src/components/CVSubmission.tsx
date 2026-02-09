import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVSubmissionProps {
  leadId: string;
  hasCvSubmitted: boolean;
  onSubmitted: () => void;
}

const CVSubmission = ({ leadId, hasCvSubmitted, onSubmitted }: CVSubmissionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const today = new Date();
  const currentDay = today.getDate();
  const isSubmissionWindow = currentDay >= 5 && currentDay <= 10;

  const getNextWindowDate = () => {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 5);
    return nextMonth.toLocaleDateString("uz-UZ", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "Fayl juda katta",
          description: "CV fayli 5MB dan oshmasligi kerak",
          variant: "destructive",
        });
        return;
      }
      if (!selectedFile.type.includes("pdf")) {
        toast({
          title: "Noto'g'ri format",
          description: "Faqat PDF formatdagi fayllar qabul qilinadi",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Update lead record to mark CV as submitted
      const { error } = await supabase
        .from("leads")
        .update({ has_cv_submitted: true })
        .eq("id", leadId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      toast({
        title: "CV muvaffaqiyatli yuborildi!",
        description: "Shohruh 3-5 kun ichida sizning CV'ingizni ko'rib chiqadi",
      });

      onSubmitted();
    } catch (error: any) {
      toast({
        title: "Xatolik yuz berdi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (hasCvSubmitted) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">
                CV yuborilgan
              </h3>
              <p className="text-muted-foreground text-sm">
                Sizning CV'ingiz Shohruh tomonidan ko'rib chiqilmoqda
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isSubmissionWindow) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <Calendar className="w-5 h-5" />
            CV yuborish muddati
          </CardTitle>
          <CardDescription>
            CV faqat har oyning 5-10 kunlari orasida qabul qilinadi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background/50 rounded-lg p-4 border border-amber-500/20">
            <p className="text-foreground text-sm">
              Keyingi yuborish oynasi: <strong>{getNextWindowDate()}</strong>
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Bu muddat ichida CV tayyorlab, PDF formatda saqlang
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold" />
          CV yuborish
        </CardTitle>
        <CardDescription>
          Shohruh shaxsan sizning CV'ingizni ko'rib chiqib, tavsiyalar beradi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cv-file">CV fayli (PDF)</Label>
          <div className="relative">
            <Input
              id="cv-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
              disabled={uploading}
            />
          </div>
          {file && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Yuklanmoqda... {uploadProgress}%
            </p>
          </motion.div>
        )}

        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">CV tayyorlash maslahatlari:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Professional foto qo'shing</li>
                <li>Customer service tajribangizni yozing</li>
                <li>Ingliz tili grammatikasini tekshiring</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          variant="hero"
          className="w-full"
          onClick={handleSubmit}
          disabled={!file || uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Yuklanmoqda..." : "CV yuborish"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CVSubmission;
