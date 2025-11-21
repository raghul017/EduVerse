import Button from '../common/Button.jsx';

function ProfileHeader ({ profile, isOwnProfile, onFollowToggle }) {
  if (!profile) return null;
  return (
    <div className="bg-surface rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex-1 space-y-2">
        <h1 className="text-2xl font-semibold">{profile.name}</h1>
        <p className="text-text/70">{profile.bio || 'No bio yet.'}</p>
        <p className="text-sm text-text/50">
          Interests: {profile.interests?.join(', ') || '—'}
        </p>
        <div className="flex gap-4 text-sm text-text/60">
          <span>{profile.followers_count ?? 0} followers</span>
          <span>{profile.following_count ?? 0} following</span>
          <span>{profile.posts?.length ?? 0} posts</span>
        </div>
      </div>
      {!isOwnProfile && (
        <Button onClick={onFollowToggle}>
          {profile.following ? 'Following' : 'Follow'}
        </Button>
      )}
    </div>
  );
}

export default ProfileHeader;
