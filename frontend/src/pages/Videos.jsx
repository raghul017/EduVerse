import { useState, useEffect } from "react";
import { usePostStore } from "../store/postStore.js";
import { motion } from "framer-motion";
import { Play, Clock, Eye, Video, Upload } from "lucide-react";
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
    <div className="min-h-screen bg-[#fbf7f1] font-sans text-stone-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-stone-100 rounded-lg">
            <Video size={24} className="text-stone-700" />
          </div>
          <h1 className="text-4xl font-serif font-medium text-stone-900">
            Learning Videos
          </h1>
        </div>
        <p className="text-stone-600 text-lg mb-8 max-w-2xl">
          Explore deep-dive educational content curated by our community of experts.
        </p>

        {/* Category Filter */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-stone-900 text-[#fbf7f1] shadow-md"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/posts/${post.id}`} className="group block h-full">
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-stone-300 transition-all h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-stone-100 overflow-hidden">
                    <img 
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        <Play size={20} fill="currentColor" className="text-stone-900 ml-1" />
                      </div>
                    </div>
                    {post.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white rounded text-xs font-bold backdrop-blur-sm">
                        {Math.floor(post.duration / 60)}:{String(post.duration % 60).padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-stone-900 line-clamp-2 group-hover:text-stone-600 transition-colors mb-2 leading-tight text-lg">
                      {post.title}
                    </h3>
                    <p className="text-sm text-stone-500 mb-4 flex-1">{post.creator_name || "Unknown Creator"}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-stone-400 pt-4 border-t border-stone-100 mt-auto">
                      {post.views && (
                        <div className="flex items-center gap-1.5">
                          <Eye size={14} />
                          <span>{post.views.toLocaleString()} views</span>
                        </div>
                      )}
                      {post.created_at && (
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Upload Button */}
      <Link
        to="/upload"
        className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 bg-stone-900 text-white rounded-full shadow-2xl hover:bg-stone-800 hover:shadow-3xl transition-all duration-300 hover:scale-105 group z-50"
      >
        <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
        <span className="font-medium">Upload Video</span>
      </Link>
    </div>
  );
}

export default Videos;
