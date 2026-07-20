import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ironImg from "@/assets/scrap-iron.jpg";

interface Category {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

const ScrapTypes = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();

    const channel = supabase
      .channel("categories_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, fetchCategories)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const toSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <section id="materials" className="py-24 bg-surface">
      <div className="container mx-auto px-4 lg:px-8">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-background border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="px-4 py-4 space-y-2">
                  <div className="h-4 w-20 bg-muted rounded mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No categories added yet.</p>
            <p className="text-muted-foreground text-sm mt-2">Add categories from the Admin → Categories section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/categories/${toSlug(cat.name)}`)}
                className="group bg-background border border-border rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-gold hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={cat.image_url || ironImg}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = ironImg; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                </div>

                {/* Info */}
                <div className="px-3 py-3 text-center flex flex-col items-center gap-2 flex-1">
                  <span className="text-foreground text-sm font-700 group-hover:text-gold transition-colors block leading-tight">
                    {cat.name}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs group-hover:text-gold transition-colors">
                    View Items <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScrapTypes;
