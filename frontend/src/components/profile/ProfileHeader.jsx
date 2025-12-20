function ProfileHeader ({ profile, isOwnProfile, onFollowToggle }) {
  if (!profile) return null;
  
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 bg-[#FF6B35] flex items-center justify-center text-black text-3xl font-bold flex-shrink-0">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            profile.name?.charAt(0).toUpperCase()
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <h1 className="text-[24px] font-bold text-white mb-1">{profile.name}</h1>
          <p className="text-[#666] text-[14px] mb-3">{profile.bio || 'No bio yet.'}</p>
          
          {profile.interests?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.interests.map((interest, i) => (
                <span key={i} className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[11px] text-[#FF6B35] font-mono">
                  {interest}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex gap-6 text-[13px] text-[#555]">
            <span><span className="text-white font-semibold">{profile.followers_count ?? 0}</span> followers</span>
            <span><span className="text-white font-semibold">{profile.following_count ?? 0}</span> following</span>
            <span><span className="text-white font-semibold">{profile.posts?.length ?? 0}</span> posts</span>
          </div>
        </div>
        
        {/* Follow Button */}
        {!isOwnProfile && (
          <button 
            onClick={onFollowToggle}
            className={`px-5 py-2.5 font-bold text-[13px] transition-all ${
              profile.following
                ? 'bg-[#1a1a1a] border border-[#FF6B35] text-[#FF6B35]'
                : 'bg-[#FF6B35] text-black'
            }`}
          >
            {profile.following ? 'FOLLOWING' : 'FOLLOW'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;
