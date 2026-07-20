import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Phone, ChevronRight, Tag, Layers, Scale } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import ironImg from "@/assets/scrap-iron.jpg";

interface ProductFull {
  id: string;
  product_name: string;
  category_id: string | null;
  sub_category_id: string | null;
  price_per_kg: number | null;
  description: string | null;
  image_url: string | null;
}

const WHATSAPP_NUMBER = "919876543210"; // ← replace with actual number

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductFull | null>(null);
  const [catName, setCatName] = useState<string>("");
  const [subCatName, setSubCatName] = useState<string>("");
  const [catSlug, setCatSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const toSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) { setLoading(false); return; }

      const { data: prod } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!prod) { setLoading(false); return; }
      setProduct(prod);

      const [catRes, subRes] = await Promise.all([
        prod.category_id
          ? supabase.from("categories").select("name").eq("id", prod.category_id).single()
          : Promise.resolve({ data: null }),
        prod.sub_category_id
          ? supabase.from("sub_categories").select("name").eq("id", prod.sub_category_id).single()
          : Promise.resolve({ data: null }),
      ]);

      if (catRes.data?.name) {
        setCatName(catRes.data.name);
        setCatSlug(toSlug(catRes.data.name));
      }
      if (subRes.data?.name) setSubCatName(subRes.data.name);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const whatsappMessage = product
    ? encodeURIComponent(
        `Hello, I want to sell ${product.product_name} scrap.\nPrice shown: ₹${product.price_per_kg ?? "N/A"}/kg`
      )
    : "";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Hero skeleton */}
          <div className="h-[55vh] bg-muted animate-pulse" />
          <div className="container mx-auto px-4 lg:px-16 py-12 max-w-4xl space-y-4">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-800 text-foreground">Product Not Found</h1>
            <Link to="/" className="text-gold hover:underline">← Back to Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* ── Hero Image ── */}
        <div className="relative h-[55vh] min-h-[360px] overflow-hidden">
          <img
            src={product.image_url || ironImg}
            alt={product.product_name}
            className="w-full h-full object-cover scale-105 transition-transform duration-700"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = ironImg; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-4 md:left-8 mt-16 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm text-white/80 hover:text-white hover:border-white/50 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Price badge over hero */}
          {product.price_per_kg != null && (
            <div className="absolute top-6 right-4 md:right-8 mt-16 z-10 px-4 py-2 gradient-gold text-background text-sm font-800 rounded-xl shadow-gold">
              ₹{product.price_per_kg}/kg
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="container mx-auto px-4 lg:px-16 py-12 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
            <button onClick={() => navigate("/")} className="hover:text-gold transition-colors">Home</button>
            <ChevronRight className="w-4 h-4" />
            {catSlug && (
              <>
                <button onClick={() => navigate(`/categories/${catSlug}`)} className="hover:text-gold transition-colors">{catName}</button>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gold">{product.product_name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* ── Left: Info ── */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-900 text-foreground leading-tight">
                  {product.product_name}
                </h1>
                {product.price_per_kg != null && (
                  <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 gradient-gold text-background font-800 text-xl rounded-xl shadow-gold">
                    <Scale className="w-4 h-4" />
                    ₹{product.price_per_kg}/kg
                  </div>
                )}
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3">
                {catName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span className="text-muted-foreground text-xs">Category</span>
                    <span className="text-foreground font-600">{catName}</span>
                  </div>
                )}
                {subCatName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm">
                    <Layers className="w-3.5 h-3.5 text-gold" />
                    <span className="text-muted-foreground text-xs">Sub Category</span>
                    <span className="text-foreground font-600">{subCatName}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="bg-surface border border-border rounded-2xl p-5">
                  <h3 className="text-foreground font-700 mb-2 text-sm uppercase tracking-wider text-muted-foreground">Description</h3>
                  <p className="text-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate("/contact")}
                  className="flex-1 flex items-center justify-center gap-2 py-4 gradient-gold text-background font-800 rounded-xl shadow-gold hover:opacity-90 transition-all text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  Sell Now
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-800 rounded-xl hover:bg-[#22bf5c] transition-all text-base shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* ── Right: Large Image Card ── */}
            <div className="lg:order-first">
              <div className="rounded-3xl overflow-hidden border border-border shadow-card aspect-[4/3]">
                <img
                  src={product.image_url || ironImg}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = ironImg; }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
