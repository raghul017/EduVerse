import PostCard from '../feed/PostCard.jsx';
import { Video } from 'lucide-react';

function ProfilePosts ({ posts }) {
  if (!posts?.length) {
    return (
      <div className="text-center py-12 bg-[#0f0f0f] border border-[#1f1f1f]">
        <Video size={40} className="text-[#333] mx-auto mb-4" />
        <p className="text-[#555] text-[14px]">No uploads yet</p>
        <p className="text-[#444] text-[12px]">Posts will appear here</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default ProfilePosts;
