import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../state/store.js";
import { NAV_LINKS } from "../../utils/constants.js";

const accountLinks = (userId) => [
  { to: `/profile/${userId}`, label: "Profile" },
  { to: "/my-videos", label: "My videos" },
  { to: "/paths", label: "Video Paths" },
  { to: "/dashboard", label: "Dashboard" },
];

function Navbar() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("ev-theme") || "light"
  );

  useEffect(() => {
    const handleClickAway = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "";
    document.documentElement.style.setProperty(
      "color-scheme",
      theme === "dark" ? "dark" : "light"
    );
    window.localStorage.setItem("ev-theme", theme);
  }, [theme]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="max-w-layout mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
            <span className="text-background font-bold text-sm">EV</span>
          </div>
          <span className="text-textPrimary font-semibold text-lg hidden sm:inline">EduVerse</span>
        </Link>

        {/* Center Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.filter((link) => (link.auth ? !!user : true)).map(
            (link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition rounded-md ${
                    isActive
                      ? "text-textPrimary"
                      : "text-textSecondary hover:text-textPrimary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3" ref={menuRef}>
          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-xs text-textSecondary hover:border-accent hover:text-accent transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/dashboard"
                  className="px-3 py-1.5 text-xs font-medium text-textSecondary hover:text-textPrimary transition"
                >
                  Upgrade to Pro
                </Link>
              )}
              <button
                className="h-9 w-9 rounded-full bg-card border border-border text-textPrimary font-semibold text-sm flex items-center justify-center hover:border-accent transition"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Account menu"
              >
                {initials || "AC"}
              </button>
              {menuOpen && (
                <div className="absolute right-6 top-14 w-56 bg-card border border-border rounded-lg shadow-hover overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-textPrimary">
                      {user.name}
                    </p>
                    <p className="text-xs text-textSecondary">{user.email}</p>
                  </div>
                  <div className="flex flex-col py-1">
                    {accountLinks(user.id).map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className="px-4 py-2 text-sm text-textSecondary hover:bg-surface transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                    <button
                      className="px-4 py-2 text-left text-sm text-danger hover:bg-surface transition"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold bg-accent text-background rounded-md hover:bg-accentHover transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
