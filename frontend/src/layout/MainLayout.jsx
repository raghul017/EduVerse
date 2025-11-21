import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import { motion, AnimatePresence } from "framer-motion";

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background relative">
      <div className="bg-noise" />
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="ml-[240px]">
        <Navbar />
        
        <main className="p-6">
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
    </div>
  );
}

export default MainLayout;

