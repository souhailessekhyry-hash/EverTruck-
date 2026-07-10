import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-crimson-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Post Not Found</h2>
          <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[900px] mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.publishedAt
                ? new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : new Date(post.createdAt as Date).toLocaleDateString()}
            </span>
            {post.category && (
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {post.category.name}
              </span>
            )}
          </div>

          <h1 className="heading-lg text-white mb-4">{post.title}</h1>

          {post.author && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-crimson-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-crimson-400" />
              </div>
              <span className="text-gray-300">{post.author.name}</span>
            </div>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="section-padding max-w-[1000px] mx-auto pb-12">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-24">
        <div className="section-padding max-w-[800px] mx-auto">
          {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed mb-8 italic border-l-4 border-crimson-500 pl-6">
              {post.excerpt}
            </p>
          )}
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-gray-300 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
