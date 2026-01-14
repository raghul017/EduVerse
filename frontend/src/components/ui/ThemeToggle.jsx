import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 bg-surface border border-border rounded-full flex items-center px-1 cursor-pointer hover:border-accent-action/50 transition-colors group"
      aria-label="Toggle Theme"
    >
      <motion.div
        className="w-6 h-6 bg-accent-action rounded-full flex items-center justify-center text-black shadow-lg"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{
          marginLeft: theme === "dark" ? "0px" : "24px",
        }}
      >
        {theme === "dark" ? <Moon size={14} fill="currentColor" /> : <Sun size={14} fill="none" strokeWidth={3} />}
      </motion.div>
    </button>
  );
}
