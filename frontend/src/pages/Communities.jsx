import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ThumbsUp, MessageSquare, Share2, MoreHorizontal, Heart, Users, Hash, Calendar } from "lucide-react";

function Communities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");
  
  // Map URL params to tab names
  const getTabName = (param) => {
    switch(param) {
      case "feed": return "All Updates";
      case "groups": return "Groups";
      case "members": return "Mentions"; // Mapping "Members" to "Mentions" for now as per design, or we can add a Members tab
      default: return "All Updates";
    }
  };

  const [activeTab, setActiveTab] = useState(getTabName(initialTab));

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(getTabName(tab));
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let param = "";
    switch(tab) {
      case "All Updates": param = "feed"; break;
      case "Groups": param = "groups"; break;
      case "Mentions": param = "members"; break;
      default: param = "feed";
    }
    setSearchParams({ tab: param });
  };

  const posts = [
    {
      id: 1,
      author: "John",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      action: "replied to the discussion",
      target: "Day Five of House Public Impeachment Hearings",
      group: "Politics News",
      time: "2 weeks ago",
      content: "Even if you put this Ukraine business aside, all the crazy things this administration has actually done fly in the face of so many things which were \"normal\" for decades. Nothing like a good shakeup, but Trump's disregard for almost every professional in so many different disciplines of what used to be sane governance is beyond belief.",
      likes: 12,
      comments: 4
    },
    {
      id: 2,
      author: "Charles",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charles",
      action: "started the discussion",
      target: "Day Five of House Public Impeachment Hearings",
      group: "Politics News",
      time: "2 weeks ago",
      content: "This morning the House Intelligence Committee will hold their seventh round of public hearings in preparation for possible impeachment proceedings against President Donald Trump. Testifying today are Fiona Hill, Trump's former Russia adviser and David Holmes, an aide to top Ukraine diplomat Bill Taylor.",
      likes: 8,
      comments: 2
    },
    {
      id: 3,
      author: "John",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      action: "started the discussion",
      target: "Obama is Stepping Back Into Politics",
      group: "Politics News",
      time: "2 weeks ago",
      content: "Planning to Nudge Democrats to the Center in the forum Politics News",
      likes: 15,
      comments: 6
    }
  ];

  const members = [
    { name: "Nicolina", action: "posted an update", time: "2 months ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nicolina" },
    { name: "Alyssa", action: "posted an update", time: "2 months ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alyssa" },
    { name: "Robert", action: "posted an update", time: "2 months ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" },
    { name: "Neville", action: "posted an update", time: "2 months ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neville" },
    { name: "Madelyn", action: "posted an update", time: "2 months ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Madelyn" },
  ];

  const groups = [
    { name: "Mountain Riders", members: 20, icon: "🚴" },
    { name: "Graphic Design", members: 20, icon: "🎨" },
    { name: "Nature Lovers", members: 19, icon: "🌲" },
    { name: "Coffee Addicts", members: 19, icon: "☕" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0a0a0a] min-h-screen text-white">
      {/* Left Sidebar */}
      <div className="lg:col-span-3 space-y-8">
        {/* Blog Widget */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">BLOG</h3>
          <div className="space-y-4">
            {[
              { title: "Tackle Your closest Spring cleaning", date: "May 14, 2019", img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=100&h=100&fit=crop" },
              { title: "The Truth About Business Blogging", date: "May 14, 2019", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=100&h=100&fit=crop" },
              { title: "10 Tips to stay healthy when...", date: "May 14, 2019", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&h=100&fit=crop" },
              { title: "Visiting Amsterdam on a Budget", date: "May 8, 2019", img: "https://images.unsplash.com/photo-1512470876302-687da745313d?w=100&h=100&fit=crop" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 group cursor-pointer">
                <img src={item.img} alt="" className="w-16 h-16 rounded-lg object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-sm font-bold text-slate-200 leading-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Following Widget */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">USERS I'M FOLLOWING <span className="text-slate-400">16</span></h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <img 
                key={i} 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                alt="" 
                className="w-10 h-10 rounded-full bg-white/10 hover:opacity-80 cursor-pointer transition-opacity border border-white/10" 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
        </div>

        {/* Post Input */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm mb-8 backdrop-blur-sm">
          <div className="flex gap-4 mb-4">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="" className="w-10 h-10 rounded-full bg-white/10" />
            <div className="flex-1">
              <p className="font-bold text-white">John</p>
            </div>
          </div>
          <textarea 
            placeholder="Write here or use @ to mention someone." 
            className="w-full min-h-[80px] bg-transparent text-slate-200 placeholder-slate-500 resize-none focus:outline-none text-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-1">
          <div className="flex gap-6">
            {["All Updates", "Likes", "Groups", "Mentions"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`pb-3 text-sm font-bold transition-colors relative ${
                  activeTab === tab ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />
                )}
              </button>
            ))}
          </div>
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search Feed..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Posts Stream */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
              <div className="flex gap-4">
                <img src={post.avatar} alt="" className="w-12 h-12 rounded-full bg-white/10" />
                <div className="flex-1">
                  <div className="flex items-baseline flex-wrap gap-1 text-sm mb-2">
                    <span className="font-bold text-white">{post.author}</span>
                    <span className="text-slate-500">{post.action}</span>
                    <span className="font-bold text-white">{post.target}</span>
                    <span className="text-slate-500">– {post.time}</span>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium">
                      <ThumbsUp size={16} /> Like
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium">
                      <MessageSquare size={16} /> Reply
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium ml-auto">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-3 space-y-8">
        {/* Latest Updates */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">LATEST UPDATES</h3>
          <div className="space-y-4">
            {members.map((member, i) => (
              <div key={i} className="flex gap-3">
                <img src={member.avatar} alt="" className="w-10 h-10 rounded-full bg-white/10" />
                <div>
                  <p className="text-sm">
                    <span className="font-bold text-white">{member.name}</span> <span className="text-slate-500">{member.action}</span>
                  </p>
                  <p className="text-xs text-slate-500">{member.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Active Members */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">RECENTLY ACTIVE MEMBERS</h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <img 
                key={i} 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Active${i}`} 
                alt="" 
                className="w-10 h-10 rounded-full bg-white/10 hover:opacity-80 cursor-pointer transition-opacity border border-white/10" 
              />
            ))}
          </div>
          <button className="text-blue-400 text-sm font-bold mt-4 hover:underline">MORE {">"}</button>
        </div>

        {/* Groups */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">GROUPS</h3>
            <div className="flex gap-2 text-xs font-bold text-slate-500">
              <span className="text-blue-400 cursor-pointer">Popular</span>
              <span className="cursor-pointer hover:text-slate-300">Newest</span>
            </div>
          </div>
          <div className="space-y-4">
            {groups.map((group, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl group-hover:bg-blue-500/20 transition-colors border border-white/5">
                  {group.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{group.name}</h4>
                  <p className="text-xs text-slate-500">{group.members} members</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Communities;
