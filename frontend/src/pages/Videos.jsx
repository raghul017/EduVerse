import {  useState, useEffect } from "react";
import { usePostStore } from "../store/postStore.js";
import { motion } from "framer-motion";
import { Play, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

function Videos() {
  const { posts, fetchFeed } = usePostStore();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchFeed(true);
  }, []);

  const categories = ["All", ...new Set(posts.map(p => p.subject).filter(Boolean))];
  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(p => p.subject === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-heading font-bold text-textPrimary mb-2">
          Learning Videos
        </h1>
        <p className="text-textSecondary text-lg mb-8">
          Explore educational content from our community
        </p>

        {/* Category Filter */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-void text-white shadow-lg"
                  : "bg-white border-2 border-border text-textPrimary hover:border-void"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/post/${post.id}`} className="group block">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-surface rounded-xl overflow-hidden mb-3">
                  <img 
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={20} fill="currentColor" className="text-black ml-1" />
                    </div>
                  </div>
                  {post.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white rounded text-xs font-bold">
                      {post.duration}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-bold text-textPrimary line-clamp-2 group-hover:text-void transition-colors mb-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-textSecondary mb-2">{post.creator?.name ||  "Unknown Creator"}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-textMuted">
                    {post.views && (
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{post.views.toLocaleString()} views</span>
                      </div>
                    )}
                    {post.created_at && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-textSecondary">
            <p>No videos found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Videos;
