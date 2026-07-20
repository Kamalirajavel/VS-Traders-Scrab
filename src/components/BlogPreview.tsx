import { Link } from "react-router-dom";
import { ArrowRight, Clock, User } from "lucide-react";

export const blogPosts = [
  {
    id: 1,
    title: "How to Get the Best Price for Your Scrap Metal in Chennai",
    excerpt: "Discover tips and strategies to maximize your earnings when selling scrap metal. Learn about current market rates and what affects pricing.",
    date: "December 15, 2024",
    author: "Vimalraj",
    category: "Tips & Tricks",
    readTime: "5 min read",
    image: "🔩",
  },
  {
    id: 2,
    title: "E-Waste Recycling: Why It Matters for Chennai's Future",
    excerpt: "Electronic waste is a growing problem. Learn how responsible e-waste recycling helps protect our environment and creates value from old devices.",
    date: "December 10, 2024",
    author: "Vimalraj",
    category: "Environment",
    readTime: "4 min read",
    image: "💻",
  },
  {
    id: 3,
    title: "Complete Guide to Scrap Types and Their Current Market Prices",
    excerpt: "A comprehensive guide covering iron, copper, aluminium, brass and other scrap metals with their current market pricing in Chennai.",
    date: "December 5, 2024",
    author: "Vimalraj",
    category: "Pricing Guide",
    readTime: "6 min read",
    image: "📊",
  },
];

const BlogPreview = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">Latest Updates</span>
            <h2 className="text-4xl md:text-5xl font-800 text-foreground">
              From Our <span className="shimmer-text">Blog</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Stay updated with scrap industry news, pricing tips and recycling insights.
            </p>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-2 text-gold font-600 hover:gap-3 transition-all duration-200 flex-shrink-0"
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-background border border-border rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-gold transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card image area */}
              <div className="h-48 bg-surface-elevated flex items-center justify-center border-b border-border relative overflow-hidden">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{post.image}</span>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gold/20 border border-gold/30 rounded-full text-gold text-xs font-600">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-muted-foreground text-xs">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3 h-3" /> {post.author}
                  </span>
                </div>

                <h3 className="text-foreground font-700 text-lg leading-snug group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground text-xs">{post.date}</span>
                  <span className="text-gold text-sm font-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
