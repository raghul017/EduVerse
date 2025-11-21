import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";

function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col animate-fade-in">
      <Navbar />
      <div className="flex-1 pt-20 pb-12">
        <div className="max-w-layout mx-auto px-6">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;

