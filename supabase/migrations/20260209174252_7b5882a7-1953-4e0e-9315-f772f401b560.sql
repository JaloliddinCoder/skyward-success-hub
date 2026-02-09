
-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false);

-- Users can upload their own CV
CREATE POLICY "Users can upload CV"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own CV
CREATE POLICY "Users can view own CV"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all CVs
CREATE POLICY "Admins can view all CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cvs' AND public.has_role(auth.uid(), 'admin'));

-- Add cv_file_path column to leads
ALTER TABLE public.leads ADD COLUMN cv_file_path text;
