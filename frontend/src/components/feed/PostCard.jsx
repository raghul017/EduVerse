import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, MoreVertical, CheckCircle2, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ post, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <Link to={`/posts/${post.id}`} className="relative aspect-video rounded-xl overflow-hidden bg-surface border border-border group-hover:border-accent/50 transition-all duration-300 shadow-sm group-hover:shadow-glow">
        <img
          src={post.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Duration Pill */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[10px] font-bold text-white">
          {post.duration || "10:00"}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      </Link>

      {/* Meta Data */}
      <div className="flex gap-3 items-start px-1">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-secondary flex-shrink-0 p-0.5">
          <img 
            src={post.creator?.avatar || `https://ui-avatars.com/api/?name=${post.creator?.name || 'User'}`}
            alt=""
            className="w-full h-full rounded-[6px] object-cover bg-background"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <Link to={`/posts/${post.id}`}>
            <h3 className="text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {post.title}
            </h3>
          </Link>

          {/* Creator & Stats */}
          <div className="mt-1 flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-xs text-textSecondary hover:text-textPrimary transition-colors">
              <span className="font-medium">{post.creator?.name || "EduVerse Creator"}</span>
              <CheckCircle2 size={10} className="text-accent" fill="currentColor" />
            </div>
            
            <div className="flex items-center gap-1 text-[11px] text-textMuted">
              <span>{post.views || 0} views</span>
              <span className="w-0.5 h-0.5 bg-textMuted rounded-full" />
              <span>{post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : "Just now"}</span>
            </div>
          </div>
        </div>

        {/* Options */}
        <button className="text-textSecondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-surface rounded">
          <MoreVertical size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default PostCard;