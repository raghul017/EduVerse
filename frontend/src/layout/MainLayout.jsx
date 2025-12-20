import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import { motion, AnimatePresence } from "framer-motion";

function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={`min-h-screen relative font-sans flex flex-col bg-[#0a0a0a] text-white ${
      isHomePage ? 'pt-0' : 'pt-[60px]'
    }`}>
      {/* Only show Navbar on non-home pages */}
      {!isHomePage && <Navbar />}
      
      {/* Main Content Area */}
      <main className={isHomePage || location.pathname.includes('roadmap') ? "w-full flex-grow" : "p-6 max-w-[1400px] mx-auto w-full flex-grow"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default MainLayout;
