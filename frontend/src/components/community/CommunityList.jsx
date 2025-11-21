import CommunityCard from './CommunityCard.jsx';
import Loader from '../common/Loader.jsx';

function CommunityList ({ communities, loading, error, onSelect }) {
  if (loading) return <Loader label="Loading communities..." />;
  if (error) return <p className="text-error text-sm">{error}</p>;

  if (!communities.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-muted">
        No communities yet. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {communities.map((community) => (
        <CommunityCard
          key={community.id}
          community={community}
          onSelect={() => onSelect?.(community.id)}
        />
      ))}
    </div>
  );
}

export default CommunityList;
