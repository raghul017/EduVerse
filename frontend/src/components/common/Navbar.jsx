import { Search, Bell } from "lucide-react";

function Navbar() {
  return (
    <header className="h-[70px] flex items-center justify-between px-8 sticky top-0 z-40 bg-background/50 backdrop-blur-md border-b border-border">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary group-focus-within:text-accent transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search for videos, communities..."
          className="w-full bg-surface/50 border border-border rounded-full py-2.5 pl-10 pr-4 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-4">
        <button className="p-2.5 rounded-full text-textSecondary hover:bg-surface hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-background"></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
