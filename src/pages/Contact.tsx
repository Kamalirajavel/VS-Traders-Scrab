import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, MessageCircle, Send, Upload, Loader2, CheckCircle, Navigation, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Category = { id: string; name: string };
type SubCategory = { id: string; category_id: string; name: string };
type Product = { id: string; category_id: string | null; sub_category_id: string | null; product_name: string };

const Contact = () => {
  const [form, setForm] = useState({
    name: "", phone: "", address: "", scrapType: "",
    description: "", location: "", message: "",
  });
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hierarchical scrap type data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSubCat, setSelectedSubCat] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [{ data: cats }, { data: subs }, { data: prods }] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("sub_categories").select("id, category_id, name").order("name"),
        supabase.from("products").select("id, category_id, sub_category_id, product_name").order("product_name"),
      ]);
      setCategories((cats || []) as Category[]);
      setSubCategories((subs || []) as SubCategory[]);
      setProducts((prods || []) as Product[]);
    };
    loadData();
  }, []);

  const filteredSubCats = subCategories.filter(s => !selectedCat || s.category_id === selectedCat);
  const filteredProducts = products.filter(p => {
    if (selectedCat && p.category_id !== selectedCat) return false;
    if (selectedSubCat && p.sub_category_id !== selectedSubCat) return false;
    return true;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10MB."); return; }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) { setLocationError("Geolocation is not supported by your browser."); return; }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLiveLocation({ lat: coords.latitude, lng: coords.longitude });
        setForm(p => ({ ...p, location: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}` }));
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(err.code === err.PERMISSION_DENIED ? "Location access denied." : "Unable to get location.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let image_url: string | null = null;
      if (imageFile) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${imageFile.name.split(".").pop()}`;
        const { error: uploadError } = await supabase.storage.from("scrap-images").upload(fileName, imageFile, { upsert: false });
        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);
        image_url = supabase.storage.from("scrap-images").getPublicUrl(fileName).data.publicUrl;
      }

      const locationText = liveLocation
        ? `https://maps.google.com/?q=${liveLocation.lat},${liveLocation.lng}`
        : form.location;

      const { error: dbError } = await supabase.from("contact_requests").insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: `${form.address.trim()}${form.location ? `, ${form.location.trim()}` : ""}`,
        scrap_type: form.scrapType,
        message: [form.description, form.message].filter(Boolean).join(" | ") || null,
        image_url,
      });
      if (dbError) throw new Error("Failed to save request: " + dbError.message);

      const locationLine = liveLocation
        ? `\nLive Location: https://maps.google.com/?q=${liveLocation.lat},${liveLocation.lng}`
        : form.location ? `\nPickup Location: ${form.location}` : "";

      const waText = [
        `New Scrap Request from ${form.name}`,
        `Phone: ${form.phone}`,
        `Address: ${form.address}`,
        locationLine,
        `Scrap: ${form.scrapType}`,
        form.description ? `Description: ${form.description}` : "",
        image_url ? `Image: ${image_url}` : "",
      ].filter(Boolean).join("\n");

      window.open(`https://wa.me/919500805193?text=${encodeURIComponent(waText)}`, "_blank");
      setSuccess(true);
      setForm({ name: "", phone: "", address: "", scrapType: "", description: "", location: "", message: "" });
      setLiveLocation(null); setImageFile(null); setImagePreview(null);
      setSelectedCat(""); setSelectedSubCat("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-36 pb-20 bg-surface relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(47 100% 50%) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">Get In Touch</span>
              <h1 className="text-5xl md:text-6xl font-800 text-foreground leading-tight">Contact <span className="shimmer-text">Us</span></h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Ready to sell your scrap? Fill in the form and we'll arrange a pickup at your convenience.</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-800 text-foreground">Get In Touch</h2>
                  <p className="text-muted-foreground leading-relaxed">Reach out to us via phone, WhatsApp or email. We're available Monday to Saturday, 9AM to 6PM.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: Phone, label: "Phone", value: "9500805193", href: "tel:9500805193" },
                    { icon: MessageCircle, label: "WhatsApp", value: "9500805193", href: "https://wa.me/919500805193" },
                    { icon: Mail, label: "Email", value: "V.vimalraj9841@gmail.com", href: "mailto:V.vimalraj9841@gmail.com" },
                    { icon: MapPin, label: "Address", value: "No:19 Thirumalai Street, Venkateshwara Nagar, Ambattur, Chennai – 600053", href: "https://maps.app.goo.gl/ZaNsH7bPNUGss7EU8" },
                  ].map((c) => (
                    <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 bg-surface border border-border rounded-xl hover:border-gold/50 hover:shadow-gold transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:border-gold transition-all">
                        <c.icon className="w-5 h-5 text-gold group-hover:text-background transition-colors" />
                      </div>
                      <div>
                        <p className="text-gold text-xs font-700 uppercase tracking-wider">{c.label}</p>
                        <p className="text-foreground text-sm mt-1 leading-relaxed">{c.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <a href="https://maps.app.goo.gl/ZaNsH7bPNUGss7EU8" target="_blank" rel="noopener noreferrer"
                  className="block bg-surface border border-border rounded-xl p-4 hover:border-gold/50 transition-all">
                  <div className="bg-surface-elevated rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
                    <iframe title="V.S Traders Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.0!2d80.1!3d13.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA2JzAwLjAiTiA4MMKwMDYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1" width="100%" height="128" className="rounded-lg border-0 pointer-events-none" loading="lazy" />
                  </div>
                  <p className="text-gold text-sm font-600 text-center">View on Google Maps</p>
                </a>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-surface border border-border rounded-2xl p-8">
                  <h2 className="text-2xl font-800 text-foreground mb-8">Request Scrap Pickup</h2>

                  {success && (
                    <div className="mb-5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Request submitted! WhatsApp has been opened.
                    </div>
                  )}
                  {error && (
                    <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-600">{error}</div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-600 text-foreground">Full Name *</label>
                        <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" maxLength={100} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-600 text-foreground">Phone Number *</label>
                        <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="Your phone number" maxLength={15} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-600 text-foreground">Address *</label>
                      <input type="text" name="address" required value={form.address} onChange={handleChange} placeholder="Your full address" maxLength={300} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm transition-colors" />
                    </div>

                    {/* Hierarchical scrap type selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-600 text-foreground">Scrap Type *</label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {/* Category */}
                        <div className="space-y-1.5">
                          <label className="text-muted-foreground text-xs font-600">Category</label>
                          <select value={selectedCat} onChange={e => { setSelectedCat(e.target.value); setSelectedSubCat(""); setForm(p => ({ ...p, scrapType: "" })); }}
                            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-gold text-sm">
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        {/* Sub Category */}
                        <div className="space-y-1.5">
                          <label className="text-muted-foreground text-xs font-600">Sub Category</label>
                          <select value={selectedSubCat} onChange={e => { setSelectedSubCat(e.target.value); setForm(p => ({ ...p, scrapType: "" })); }}
                            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-gold text-sm">
                            <option value="">All Sub Categories</option>
                            {filteredSubCats.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        {/* Product */}
                        <div className="space-y-1.5">
                          <label className="text-muted-foreground text-xs font-600">Product *</label>
                          <select name="scrapType" required value={form.scrapType} onChange={handleChange}
                            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-gold text-sm">
                            <option value="">Select product</option>
                            {filteredProducts.map(p => <option key={p.id} value={p.product_name}>{p.product_name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-600 text-foreground">Pickup Location</label>
                        <div className="relative">
                          <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Area / landmark" maxLength={200} className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm transition-colors" />
                          <button type="button" onClick={handleShareLocation} disabled={locationLoading} title="Share Live Location" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold hover:text-gold/80 transition-colors disabled:opacity-50">
                            {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                          </button>
                        </div>
                        {locationError && <p className="text-red-400 text-xs font-600">{locationError}</p>}
                      </div>
                      <div className="space-y-2 flex flex-col justify-end">
                        <button type="button" onClick={handleShareLocation} disabled={locationLoading} className="flex items-center gap-2 px-4 py-3 border border-gold/40 text-gold text-sm font-600 rounded-xl hover:bg-gold/10 hover:border-gold transition-all disabled:opacity-50">
                          {locationLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting Location…</> : liveLocation ? <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-400">Location Captured!</span></> : <><Navigation className="w-4 h-4" /> Share Live Location</>}
                        </button>
                      </div>
                    </div>

                    {liveLocation && (
                      <div className="space-y-2">
                        <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider">Live Location Preview</p>
                        <div className="rounded-xl overflow-hidden border border-gold/30">
                          <iframe title="Live Location" src={`https://maps.google.com/maps?q=${liveLocation.lat},${liveLocation.lng}&z=16&output=embed`} width="100%" height="180" className="border-0" loading="lazy" />
                        </div>
                        <a href={`https://maps.google.com/?q=${liveLocation.lat},${liveLocation.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gold text-xs font-600 hover:underline">
                          <MapPin className="w-3.5 h-3.5" /> {liveLocation.lat.toFixed(6)}, {liveLocation.lng.toFixed(6)}
                        </a>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-600 text-foreground">Scrap Description</label>
                      <textarea name="description" value={form.description} onChange={handleChange} rows={3} maxLength={1000} placeholder="Describe your scrap (quantity, condition, etc.)" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm transition-colors resize-none" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-600 text-foreground">Additional Message</label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={2} maxLength={500} placeholder="Any additional information..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm transition-colors resize-none" />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-600 text-foreground">Upload Scrap Image (Optional)</label>
                      {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-border">
                          <img src={imagePreview} className="w-full max-h-48 object-cover" alt="preview" />
                          <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1.5 bg-background/80 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gold/40 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-gold transition-all">
                          <Upload className="w-7 h-7 text-gold/60" />
                          <span className="text-muted-foreground text-sm">Click to upload scrap photo</span>
                          <span className="text-muted-foreground text-xs">JPEG, PNG, WebP — max 10MB</span>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>

                    <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-4 gradient-gold text-background font-700 rounded-xl shadow-gold hover:opacity-90 transition-all disabled:opacity-50 text-base">
                      {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</> : <><Send className="w-5 h-5" /> Send via WhatsApp</>}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
