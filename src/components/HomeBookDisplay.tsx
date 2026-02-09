import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PrimaryBook {
  id: string;
  title: string;
  description: string | null;
}

interface HomeBookDisplayProps {
  isAdmin: boolean;
}

const HomeBookDisplay = ({ isAdmin }: HomeBookDisplayProps) => {
  const [book, setBook] = useState<PrimaryBook | null>(null);

  useEffect(() => {
    const fetchPrimary = async () => {
      const { data } = await supabase
        .from("books")
        .select("id, title, description")
        .eq("is_primary", true)
        .maybeSingle();
      if (data) setBook(data as PrimaryBook);
    };
    fetchPrimary();
  }, []);

  if (!book) return null;

  return (
    <div className="text-center mb-4">
      <h3 className="font-display text-xl font-bold text-foreground">{book.title}</h3>
      {book.description && (
        <p className="text-muted-foreground text-sm mt-1">{book.description}</p>
      )}
    </div>
  );
};

export default HomeBookDisplay;
