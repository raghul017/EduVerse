import { useState } from "react";
import { Search, ThumbsUp, MessageSquare, Share2, MoreHorizontal, Heart, Users, Hash, Calendar } from "lucide-react";

function Communities() {
  const [activeTab, setActiveTab] = useState("All Updates");

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
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Sidebar */}
      <div className="lg:col-span-3 space-y-8">
        {/* Blog Widget */}
        <div>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">BLOG</h3>
          <div className="space-y-4">
            {[
              { title: "Tackle Your closest Spring cleaning", date: "May 14, 2019", img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=100&h=100&fit=crop" },
              { title: "The Truth About Business Blogging", date: "May 14, 2019", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=100&h=100&fit=crop" },
              { title: "10 Tips to stay healthy when...", date: "May 14, 2019", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&h=100&fit=crop" },
              { title: "Visiting Amsterdam on a Budget", date: "May 8, 2019", img: "https://images.unsplash.com/photo-1512470876302-687da745313d?w=100&h=100&fit=crop" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 group cursor-pointer">
                <img src={item.img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-stone-800 leading-tight group-hover:text-orange-500 transition-colors">{item.title}</h4>
                  <p className="text-xs text-stone-500 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Following Widget */}
        <div>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">USERS I'M FOLLOWING <span className="text-stone-300">16</span></h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <img 
                key={i} 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                alt="" 
                className="w-10 h-10 rounded-full bg-stone-200 hover:opacity-80 cursor-pointer transition-opacity" 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Activity Feed</h1>
        </div>

        {/* Post Input */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm mb-8">
          <div className="flex gap-4 mb-4">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="" className="w-10 h-10 rounded-full bg-stone-200" />
            <div className="flex-1">
              <p className="font-bold text-stone-900">John</p>
            </div>
          </div>
          <textarea 
            placeholder="Write here or use @ to mention someone." 
            className="w-full min-h-[80px] text-stone-600 placeholder-stone-400 resize-none focus:outline-none text-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 border-b border-stone-200 pb-1">
          <div className="flex gap-6">
            {["All Updates", "Likes", "Groups", "Mentions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold transition-colors relative ${
                  activeTab === tab ? "text-orange-500" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Feed..." 
              className="w-full bg-stone-50 border border-stone-200 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-stone-400"
            />
          </div>
        </div>

        {/* Posts Stream */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <div className="flex gap-4">
                <img src={post.avatar} alt="" className="w-12 h-12 rounded-full bg-stone-200" />
                <div className="flex-1">
                  <div className="flex items-baseline flex-wrap gap-1 text-sm mb-2">
                    <span className="font-bold text-stone-900">{post.author}</span>
                    <span className="text-stone-500">{post.action}</span>
                    <span className="font-bold text-stone-900">{post.target}</span>
                    <span className="text-stone-400">– {post.time}</span>
                  </div>
                  
                  <p className="text-stone-600 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-stone-500 hover:text-orange-500 transition-colors text-sm font-medium">
                      <ThumbsUp size={16} /> Like
                    </button>
                    <button className="flex items-center gap-2 text-stone-500 hover:text-orange-500 transition-colors text-sm font-medium">
                      <MessageSquare size={16} /> Reply
                    </button>
                    <button className="flex items-center gap-2 text-stone-500 hover:text-orange-500 transition-colors text-sm font-medium ml-auto">
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
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">LATEST UPDATES</h3>
          <div className="space-y-4">
            {members.map((member, i) => (
              <div key={i} className="flex gap-3">
                <img src={member.avatar} alt="" className="w-10 h-10 rounded-full bg-stone-200" />
                <div>
                  <p className="text-sm">
                    <span className="font-bold text-stone-900">{member.name}</span> <span className="text-stone-500">{member.action}</span>
                  </p>
                  <p className="text-xs text-stone-400">{member.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Active Members */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">RECENTLY ACTIVE MEMBERS</h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <img 
                key={i} 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Active${i}`} 
                alt="" 
                className="w-10 h-10 rounded-full bg-stone-200 hover:opacity-80 cursor-pointer transition-opacity" 
              />
            ))}
          </div>
          <button className="text-orange-500 text-sm font-bold mt-4 hover:underline">MORE {">"}</button>
        </div>

        {/* Groups */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">GROUPS</h3>
            <div className="flex gap-2 text-xs font-bold text-stone-400">
              <span className="text-orange-500 cursor-pointer">Popular</span>
              <span className="cursor-pointer hover:text-stone-600">Newest</span>
            </div>
          </div>
          <div className="space-y-4">
            {groups.map((group, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-xl group-hover:bg-orange-100 transition-colors">
                  {group.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-orange-500 transition-colors">{group.name}</h4>
                  <p className="text-xs text-stone-500">{group.members} members</p>
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
