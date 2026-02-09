
-- Create books table for storing book/file metadata
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Everyone (authenticated) can view books
CREATE POLICY "Authenticated users can view books"
ON public.books
FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert books
CREATE POLICY "Admins can insert books"
ON public.books
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update books
CREATE POLICY "Admins can update books"
ON public.books
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete books
CREATE POLICY "Admins can delete books"
ON public.books
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for books
INSERT INTO storage.buckets (id, name, public) VALUES ('books', 'books', false);

-- Storage policies for books bucket
CREATE POLICY "Authenticated users can view book files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'books');

CREATE POLICY "Admins can upload book files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'books' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update book files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'books' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete book files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'books' AND public.has_role(auth.uid(), 'admin'::app_role));
