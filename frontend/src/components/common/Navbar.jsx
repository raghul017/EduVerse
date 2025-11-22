import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Navbar() {
  const location = useLocation();
  
  const links = [
    { name: "Roadmaps", path: "/ai-roadmap" },
    { name: "Videos", path: "/videos" },
    { name: "Communities", path: "/communities" },
    { name: "AI Tutor", path: "/ai-tutor" },
  ];

  return (
    <header className="h-[70px] flex items-center justify-between px-8 sticky top-0 z-40 bg-[#fbf7f1]/80 backdrop-blur-md border-b border-stone-200">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-stone-900 font-heading font-bold text-xl tracking-tight">
        EDUVERSE
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition-colors ${
              location.pathname === link.path
                ? "text-stone-900"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Link
          to="/ai-roadmap"
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-[#fbf7f1] rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Sparkles size={16} />
          <span>Start Learning</span>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
