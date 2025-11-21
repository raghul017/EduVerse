import { useEffect, useState } from "react";
import FeedContainer from "../components/feed/FeedContainer.jsx";
import { usePostStore } from "../store/postStore.js";
import { useCommunityStore } from "../store/communityStore.js";
import { usePathStore } from "../store/pathStore.js";
import PathCard from "../components/paths/PathCard.jsx";

const SummaryCard = ({ label, value, subtext }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <p className="text-xs uppercase text-muted">{label}</p>
    <p className="text-2xl font-semibold text-text">{value}</p>
    {subtext && <p className="text-xs text-muted mt-1">{subtext}</p>}
  </div>
);

function Home() {
  const { posts } = usePostStore();
  const { communities, fetchCommunities } = useCommunityStore();
  const { paths, fetchPaths } = usePathStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!communities.length) {
      fetchCommunities();
    }
    if (!paths.length) {
      fetchPaths();
    }
  }, []);

  const subjects = new Set(posts.map((post) => post.subject));
  const creators = new Set(posts.map((post) => post.creator_id));
  const totalMinutes = Math.round(
    posts.reduce((sum, post) => sum + (post.duration || 0), 0) / 60
  );
  const spotlightCommunities = communities.slice(0, 3);

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-white border border-slate-100 p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm uppercase tracking-wide text-primary">
              Your knowledge feed
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-text">
              Bite-sized lessons, transcripts, and AI tutors in one place.
            </h1>
            <p className="text-muted text-base">
              EduVerse curates videos from verified creators, generates
              transcripts automatically, and lets you ask contextual questions
              for every lesson you watch.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 flex-1 min-w-[240px]">
            <SummaryCard label="Videos available" value={posts.length || 0} />
            <SummaryCard label="Subjects" value={subjects.size || 0} />
            <SummaryCard label="Creators" value={creators.size || 0} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {Array.from(subjects)
            .slice(0, 4)
            .map((subject) => (
              <div
                key={subject}
                className="px-3 py-2 rounded-full bg-slate-100 text-text text-center"
              >
                {subject}
              </div>
            ))}
          {totalMinutes > 0 && (
            <div className="px-3 py-2 rounded-full bg-primary/10 text-primary text-center">
              {totalMinutes} minutes of learning uploaded
            </div>
          )}
        </div>
      </header>

      {spotlightCommunities.length > 0 && (
        <section className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-primary">
                Communities
              </p>
              <h2 className="text-2xl font-semibold text-text">
                Top study circles
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {spotlightCommunities.map((community) => (
              <div
                key={community.id}
                className="border border-slate-100 rounded-2xl p-4"
              >
                <p className="text-xs uppercase text-muted">
                  {community.subject}
                </p>
                <h3 className="text-lg font-semibold text-text">
                  {community.name}
                </h3>
                <p className="text-sm text-muted line-clamp-2">
                  {community.description}
                </p>
                <p className="text-xs text-muted mt-2">
                  {community.member_count} members
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {paths.length > 0 && (
        <section className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-primary">
                Learning paths
              </p>
              <h2 className="text-2xl font-semibold text-text">
                Structured mini-courses
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {paths.slice(0, 3).map((path) => (
              <PathCard key={path.id} path={path} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text">Browse videos</h2>
          <div className="flex-1 min-w-[220px] max-w-md ml-auto">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, subject, or tag..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <FeedContainer searchQuery={search} />
      </section>
    </div>
  );
}

export default Home;
