import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import ironImg from "@/assets/scrap-iron.jpg";

interface Category {
  id: string;
  name: string;
  image_url: string | null;
}

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
}

interface Product {
  id: string;
  product_name: string;
  price_per_kg: number | null;
  description: string | null;
  image_url: string | null;
  sub_category_id: string | null;
  sub_category_name?: string;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const [cat, setCat] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const toSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: cats } = await supabase.from("categories").select("*");
      const matched = cats?.find((c) => toSlug(c.name) === category);
      if (!matched) { setLoading(false); return; }
      setCat(matched);

      const [{ data: subs }, { data: prods }] = await Promise.all([
        supabase.from("sub_categories").select("*").eq("category_id", matched.id).order("created_at", { ascending: true }),
        supabase.from("products").select("*").eq("category_id", matched.id).order("created_at", { ascending: true }),
      ]);

      const subList = subs || [];
      const subMap = Object.fromEntries(subList.map((s) => [s.id, s.name]));
      setSubCategories(subList);
      setProducts((prods || []).map((p) => ({
        ...p,
        sub_category_name: p.sub_category_id ? subMap[p.sub_category_id] : undefined,
      })));
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const filteredProducts = activeFilter
    ? products.filter((p) => p.sub_category_id === activeFilter)
    : products;

  if (!loading && !cat) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-800 text-foreground">Category Not Found</h1>
            <button onClick={() => navigate("/")} className="text-gold hover:underline">← Back to Home</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const heroImage = cat?.image_url || ironImg;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* ── Hero Banner with slight blur ── */}
        <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
          {/* Blurred background */}
          <div
            className="absolute inset-0 scale-105"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(1px)",
            }}
          />
          {/* Dark overlay — lighter than before */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-4 md:left-8 mt-16 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm text-white/80 hover:text-white hover:border-white/50 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Centered title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 pt-16">
            <span className="text-gold text-xs font-700 uppercase tracking-[0.3em] mb-3 block">Category</span>
            <h1 className="text-5xl md:text-7xl font-900 text-white leading-tight drop-shadow-lg">
              {loading ? "" : cat?.name}
            </h1>
            <p className="text-white/70 mt-4 text-base md:text-lg max-w-lg">
              Browse all {cat?.name?.toLowerCase()} scrap products and prices.
            </p>
          </div>
        </div>

        <section className="py-14">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-10 flex-wrap">
              <button onClick={() => navigate("/")} className="hover:text-gold transition-colors">Home</button>
              <ChevronRight className="w-4 h-4" />
              <button onClick={() => navigate("/#materials")} className="hover:text-gold transition-colors">Materials</button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gold">{cat?.name}</span>
            </div>

            {/* Sub Category Filter Pills */}
            {!loading && subCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-600 border transition-all duration-200 ${
                    activeFilter === null
                      ? "gradient-gold text-background border-transparent shadow-gold"
                      : "bg-background border-border text-muted-foreground hover:border-gold/50 hover:text-gold"
                  }`}
                >
                  All
                </button>
                {subCategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveFilter(sub.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-600 border transition-all duration-200 ${
                      activeFilter === sub.id
                        ? "gradient-gold text-background border-transparent shadow-gold"
                        : "bg-background border-border text-muted-foreground hover:border-gold/50 hover:text-gold"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="bg-background border border-border rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-20 bg-muted rounded mx-auto" />
                      <div className="h-3 w-14 bg-muted rounded mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No products found.</p>
                {activeFilter && (
                  <button onClick={() => setActiveFilter(null)} className="mt-3 text-gold text-sm hover:underline">
                    Clear filter
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="group bg-background border border-border rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-gold hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={product.image_url || ironImg}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = ironImg; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />

                      {/* Price badge */}
                      {product.price_per_kg != null && (
                        <div className="absolute top-2 right-2 px-2 py-1 gradient-gold text-background text-[10px] font-700 rounded-lg shadow-gold leading-none">
                          ₹{product.price_per_kg}/kg
                        </div>
                      )}

                      {/* Sub category badge */}
                      {product.sub_category_name && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm border border-border text-muted-foreground text-[10px] font-600 rounded-lg leading-none">
                          {product.sub_category_name}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="px-3 py-3 text-center flex flex-col items-center gap-1 flex-1">
                      <span className="text-foreground text-sm font-700 group-hover:text-gold transition-colors block leading-tight">
                        {product.product_name}
                      </span>
                      {product.sub_category_name && (
                        <span className="text-muted-foreground text-xs">{product.sub_category_name}</span>
                      )}
                      {product.price_per_kg != null && (
                        <span className="text-gold text-xs font-700">₹{product.price_per_kg}/kg</span>
                      )}
                      {product.description && (
                        <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate("/contact"); }}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 gradient-gold text-background text-xs font-700 rounded-xl shadow-gold hover:opacity-90 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Sell Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
