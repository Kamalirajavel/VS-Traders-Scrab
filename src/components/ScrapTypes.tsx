import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ironImg from "@/assets/scrap-iron.jpg";

interface Category {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

interface Product {
  id: string;
  product_name: string;
  price_per_kg: number | null;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
}

const ScrapTypes = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = async () => {
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("*").order("created_at", { ascending: true }),
      supabase.from("products").select("*").order("created_at", { ascending: true }),
    ]);
    if (cats) setCategories(cats);
    if (prods) setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("categories_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="materials" className="py-24 bg-surface">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">We Accept</span>
          <h2 className="text-4xl md:text-5xl font-800 text-foreground">
            Materials We <span className="shimmer-text">Collect</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our material categories and get the best market price for your scrap with fast doorstep pickup in Chennai.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-background border border-border rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No categories added yet.</p>
            <p className="text-muted-foreground text-sm mt-2">Add categories from the Admin → Categories section.</p>
          </div>
        ) : (
          /* ── Vertical accordion list ── */
          <div className="flex flex-col gap-4">
            {categories.map((cat) => {
              const isOpen = expandedId === cat.id;
              const catProducts = products.filter((p) => p.category_id === cat.id);

              return (
                <div
                  key={cat.id}
                  className={`bg-background border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? "border-gold/50 shadow-gold" : "border-border hover:border-gold/50"
                  }`}
                >
                  {/* Category row — click to expand/collapse, no navigation */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="group w-full flex items-center gap-4 p-4 cursor-pointer text-left"
                  >
                    <img
                      src={cat.image_url || ironImg}
                      alt={cat.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = ironImg; }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-foreground text-lg font-700 group-hover:text-gold transition-colors block">
                        {cat.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {catProducts.length} item{catProducts.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground group-hover:text-gold transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded items — listed under the category, in place */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {catProducts.length === 0 ? (
                        <p className="text-muted-foreground text-sm px-4 pb-4">No items listed yet.</p>
                      ) : (
                        <div className="border-t border-border divide-y divide-border">
                          {catProducts.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="flex items-center gap-4 p-4 hover:bg-surface cursor-pointer transition-colors"
                            >
                              <img
                                src={product.image_url || ironImg}
                                alt={product.product_name}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = ironImg; }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-foreground text-sm font-600 truncate">{product.product_name}</p>
                                {product.description && (
                                  <p className="text-muted-foreground text-xs line-clamp-1">{product.description}</p>
                                )}
                              </div>
                              {product.price_per_kg != null && (
                                <span className="text-gold text-sm font-700 flex-shrink-0">
                                  ₹{product.price_per_kg}/kg
                                </span>
                              )}
                              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScrapTypes;
