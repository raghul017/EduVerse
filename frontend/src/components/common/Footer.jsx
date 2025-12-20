import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] py-16 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="text-[11px] text-[#444] tracking-[0.15em] mb-4">DOCUMENTATION</h4>
            <div className="space-y-2 text-[12px]">
              <Link to="/" className="block text-[#666] hover:text-white transition-colors">HOME</Link>
              <a href="#" className="block text-[#666] hover:text-white transition-colors">DOCS</a>
              <a href="#" className="block text-[#666] hover:text-white transition-colors">GITHUB</a>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] text-[#444] tracking-[0.15em] mb-4">CAREERS</h4>
            <div className="space-y-2 text-[12px]">
              <a href="#" className="block text-[#666] hover:text-white transition-colors">PRESS</a>
              <a href="#" className="block text-[#666] hover:text-white transition-colors">MARKETPLACE</a>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] text-[#444] tracking-[0.15em] mb-4">TERMS OF SERVICE</h4>
            <div className="space-y-2 text-[12px]">
              <a href="#" className="block text-[#666] hover:text-white transition-colors">PRIVACY</a>
              <a href="#" className="block text-[#666] hover:text-white transition-colors">CHANGELOG</a>
              <a href="#" className="block text-[#666] hover:text-white transition-colors">CONTACT US</a>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] text-[#444] tracking-[0.15em] mb-4">SOCIAL</h4>
            <div className="space-y-2 text-[12px]">
              <a href="#" className="block text-[#666] hover:text-white transition-colors">TWITTER</a>
              <a href="#" className="block text-[#666] hover:text-white transition-colors">LINKEDIN</a>
              <a href="#" className="block text-[#666] hover:text-white transition-colors">DISCORD</a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1a1a1a]">
          <p className="text-[11px] text-[#444]">© 2024 EDUVERSE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-2 text-[11px] text-[#444] mt-4 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-[#27ca40]"></span>
            BUILT BY RAGHUL A R
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
