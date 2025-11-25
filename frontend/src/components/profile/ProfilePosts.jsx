import PostCard from '../feed/PostCard.jsx';

function ProfilePosts ({ posts }) {
  if (!posts?.length) {
    return (
      <p className="text-center text-slate-400 py-10 text-sm">
        No uploads yet. Encourage them to share knowledge!
      </p>
    );
  }
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default ProfilePosts;
