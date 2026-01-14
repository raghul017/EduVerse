import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { motion, AnimatePresence } from "framer-motion";

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen relative font-sans flex flex-col bg-background text-textPrimary transition-colors duration-500">
      {/* Navbar represents the global navigation - Hidden on AI Tutor for full immersion */}
      {location.pathname !== '/ai-tutor' && <Navbar />}
      
      {/* Main Content Area */}
      <main className="w-full flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {location.pathname === '/' && <Footer />}
    </div>
  );
}

export default MainLayout;
