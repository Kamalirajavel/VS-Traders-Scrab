
-- ── banners table ──────────────────────────────────────────────
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Anyone can insert banners" ON public.banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update banners" ON public.banners FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete banners" ON public.banners FOR DELETE USING (true);

-- ── scrap_types table ──────────────────────────────────────────
CREATE TABLE public.scrap_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scrap_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scrap_types" ON public.scrap_types FOR SELECT USING (true);
CREATE POLICY "Anyone can insert scrap_types" ON public.scrap_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update scrap_types" ON public.scrap_types FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete scrap_types" ON public.scrap_types FOR DELETE USING (true);

-- ── updated_at trigger function ────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scrap_types_updated_at
  BEFORE UPDATE ON public.scrap_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── Storage RLS for scrap-images bucket ───────────────────────
CREATE POLICY "Public can upload to scrap-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'scrap-images');

CREATE POLICY "Public can read from scrap-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'scrap-images');

CREATE POLICY "Public can delete from scrap-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'scrap-images');
