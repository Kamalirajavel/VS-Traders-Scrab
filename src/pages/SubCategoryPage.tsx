import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import ironImg from "@/assets/scrap-iron.jpg";

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
}

const SubCategoryPage = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  const navigate = useNavigate();

  const [catName, setCatName] = useState<string>("");
  const [sub, setSub] = useState<SubCategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const toSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  useEffect(() => {
    const fetchData = async () => {
      // Resolve category name
      const { data: cats } = await supabase.from("categories").select("*");
      const matchedCat = cats?.find((c) => toSlug(c.name) === category);
      if (!matchedCat) { setLoading(false); return; }
      setCatName(matchedCat.name);

      // Resolve sub-category
      const { data: subs } = await supabase
        .from("sub_categories")
        .select("*")
        .eq("category_id", matchedCat.id);
      const matchedSub = subs?.find((s) => toSlug(s.name) === subcategory);
      if (!matchedSub) { setLoading(false); return; }
      setSub(matchedSub);

      // Fetch products
      const { data: prods } = await supabase
        .from("products")
        .select("*")
        .eq("sub_category_id", matchedSub.id)
        .order("created_at", { ascending: true });

      setProducts(prods || []);
      setLoading(false);
    };

    fetchData();
  }, [category, subcategory]);

  if (!loading && !sub) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-800 text-foreground">Sub Category Not Found</h1>
            <button onClick={() => navigate(-1)} className="text-gold hover:underline">← Back</button>
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
        {/* Header bar */}
        <div className="bg-surface border-b border-border pt-20 pb-10">
          <div className="container mx-auto px-4 lg:px-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-gold transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
              <button onClick={() => navigate("/")} className="hover:text-gold transition-colors">Home</button>
              <ChevronRight className="w-4 h-4" />
              <button onClick={() => navigate("/#materials")} className="hover:text-gold transition-colors">Materials</button>
              <ChevronRight className="w-4 h-4" />
              <button onClick={() => navigate(`/categories/${category}`)} className="hover:text-gold transition-colors">{catName}</button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gold">{sub?.name}</span>
            </div>

            <div className="space-y-2">
              <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">{catName}</span>
              <h1 className="text-3xl md:text-5xl font-800 text-foreground">{sub?.name}</h1>
              <p className="text-muted-foreground">Browse products and prices below.</p>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-background border border-border rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-20 bg-muted rounded mx-auto" />
                      <div className="h-3 w-14 bg-muted rounded mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No products added yet for this sub category.</p>
                <p className="text-muted-foreground text-sm mt-2">Add products from the Admin → Products section.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-background border border-border rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-gold hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
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
                    </div>

                    {/* Info */}
                    <div className="px-3 py-3 text-center flex flex-col items-center gap-1 flex-1">
                      <span className="text-foreground text-sm font-700 group-hover:text-gold transition-colors block leading-tight">
                        {product.product_name}
                      </span>
                      {product.price_per_kg != null && (
                        <span className="text-gold text-xs font-700">₹{product.price_per_kg}/kg</span>
                      )}
                      {product.description && (
                        <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      {/* Sell Now */}
                      <button
                        onClick={() => navigate("/contact")}
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

export default SubCategoryPage;
