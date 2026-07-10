import { motion } from "framer-motion";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  Calendar,
  ArrowRight,
  Loader2,
  Tag,
} from "lucide-react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery({});
  const { data: categories } = trpc.blogCategory.list.useQuery();

  const featuredPosts = posts?.filter((p) => p.featured) || [];
  const regularPosts = posts?.filter((p) => !p.featured) || [];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[1400px] mx-auto text-center">
          <FadeIn>
            <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
              Insights
            </span>
            <h1 className="heading-xl text-white mt-4 mb-6">
              LOGISTICS <span className="text-crimson-500">BLOG</span>
            </h1>
            <p className="body-text max-w-2xl mx-auto">
              Stay informed with the latest industry trends, expert tips, and
              company updates from the EverTruck team.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="pb-12">
          <div className="section-padding max-w-[1400px] mx-auto">
            <FadeIn>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/blog"
                  className="px-4 py-2 rounded-full bg-crimson-500/10 text-crimson-400 text-sm font-medium hover:bg-crimson-500/20 transition-colors"
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-4 py-2 rounded-full bg-white/5 text-gray-400 text-sm font-medium"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-24">
          <div className="section-padding max-w-[1400px] mx-auto">
            <FadeIn>
              <h2 className="text-sm uppercase tracking-widest text-golden-400 font-semibold mb-6">
                Featured
              </h2>
            </FadeIn>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.1}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="glass-card-hover overflow-hidden">
                      <div className="relative h-56 overflow-hidden">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {String(new Date((post.publishedAt ?? post.createdAt) as Date).toLocaleDateString())}
                          </span>
                          {post.category && (
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {post.category.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-crimson-400 transition-colors mb-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="pb-24">
        <div className="section-padding max-w-[1400px] mx-auto">
          <FadeIn>
            <h2 className="text-sm uppercase tracking-widest text-teal-400 font-semibold mb-6">
              All Articles
            </h2>
          </FadeIn>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-crimson-500" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.08}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="glass-card-hover overflow-hidden h-full flex flex-col">
                      <div className="relative h-44 overflow-hidden">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {String(new Date((post.publishedAt ?? post.createdAt) as Date).toLocaleDateString())}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-crimson-400 transition-colors mb-2 flex-1">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                        )}
                        <span className="flex items-center gap-1 text-sm text-crimson-400 group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
