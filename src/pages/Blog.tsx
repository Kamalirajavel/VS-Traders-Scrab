import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { blogPosts } from "@/components/BlogPreview";
import { Clock, User, ArrowRight, Search } from "lucide-react";

const Blog = () => {
  const [search, setSearch] = useState("");
  const filtered = blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

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
              <span className="text-gold text-xs font-700 uppercase tracking-[0.3em]">Latest Updates</span>
              <h1 className="text-5xl md:text-6xl font-800 text-foreground leading-tight">
                Our <span className="shimmer-text">Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Industry insights, pricing tips and recycling guides from Chennai's trusted scrap buyer.
              </p>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No posts found for "{search}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-gold transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-52 bg-surface-elevated flex items-center justify-center border-b border-border relative overflow-hidden">
                      <span className="text-8xl group-hover:scale-110 transition-transform duration-300">{post.image}</span>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-gold/20 border border-gold/30 rounded-full text-gold text-xs font-600">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 text-muted-foreground text-xs">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                        <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</span>
                      </div>
                      <h3 className="text-foreground font-700 text-lg leading-snug group-hover:text-gold transition-colors">{post.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
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
            )}
          </div>
        </section>

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
