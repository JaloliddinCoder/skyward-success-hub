import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  is_primary: boolean;
}

const DashboardBookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("is_primary", false)
      .order("display_order", { ascending: true });

    if (!error && data) setBooks(data as Book[]);
    setLoading(false);
  };

  const handleDownload = async (book: Book) => {
    const { data, error } = await supabase.storage
      .from("books")
      .download(book.file_path);

    if (error || !data) {
      toast({ title: "Xatolik", description: "Fayl yuklab olinmadi", variant: "destructive" });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = book.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) return null;
  if (books.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="w-4 h-4 text-gold" />
          Qo'shimcha materiallar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-gold shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                {book.description && (
                  <p className="text-xs text-muted-foreground truncate">{book.description}</p>
                )}
                <p className="text-xs text-muted-foreground">{formatSize(book.file_size)}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleDownload(book)}>
              <Download className="w-3 h-3 mr-1" />
              Yuklab olish
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardBookList;
