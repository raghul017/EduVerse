import Button from '../common/Button.jsx';
import { useCommunityStore } from '../../store/communityStore.js';

function CommunityCard ({ community, onSelect }) {
  const { toggleMembership } = useCommunityStore();

  return (
    <div className="bg-white border border-slate-100  p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <button type="button" className="text-left" onClick={onSelect}>
          <h3 className="text-lg font-semibold text-text hover:text-primary transition">
            {community.name}
          </h3>
          <p className="text-xs text-muted uppercase tracking-wide">{community.subject}</p>
        </button>
        <span className="text-sm text-muted">{community.member_count} members</span>
      </div>
      <p className="text-sm text-muted leading-relaxed">{community.description}</p>
      <Button
        variant={community.joined ? 'secondary' : 'primary'}
        size="sm"
        onClick={() => toggleMembership(community.id, community.joined)}
      >
        {community.joined ? 'Joined' : 'Join'}
      </Button>
    </div>
  );
}

export default CommunityCard;
