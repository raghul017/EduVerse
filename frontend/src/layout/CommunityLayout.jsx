import { Outlet } from "react-router-dom";
import CommunityNavbar from "../components/community/CommunityNavbar.jsx";

function CommunityLayout() {
  return (
    <div className="min-h-screen bg-[#fbf7f1] font-sans text-stone-900">
      <CommunityNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default CommunityLayout;
