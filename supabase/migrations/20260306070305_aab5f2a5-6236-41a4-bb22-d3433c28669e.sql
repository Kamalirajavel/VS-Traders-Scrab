
-- Create contact_requests table
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  scrap_type TEXT NOT NULL,
  message TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public contact form)
CREATE POLICY "Anyone can submit contact requests"
  ON public.contact_requests
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read (admin panel reads submissions)
CREATE POLICY "Anyone can view contact requests"
  ON public.contact_requests
  FOR SELECT
  USING (true);

-- Allow anyone to delete (admin action)
CREATE POLICY "Anyone can delete contact requests"
  ON public.contact_requests
  FOR DELETE
  USING (true);

-- Create scrap-images storage bucket with public access
INSERT INTO storage.buckets (id, name, public)
VALUES ('scrap-images', 'scrap-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to scrap-images
CREATE POLICY "Anyone can upload scrap images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'scrap-images');

-- Allow public read of scrap images
CREATE POLICY "Public read scrap images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'scrap-images');

-- Allow delete of scrap images
CREATE POLICY "Anyone can delete scrap images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'scrap-images');
