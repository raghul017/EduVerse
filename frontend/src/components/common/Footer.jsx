import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-border bg-background relative z-[100]">
      <div className="max-w-layout mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                <span className="text-background font-bold text-sm">EV</span>
              </div>
              <span className="text-textPrimary font-semibold text-lg">EduVerse</span>
            </div>
            <p className="text-textSecondary text-sm max-w-md">
              EduVerse is a community-driven platform to learn, grow, and build your future using AI-powered learning.
            </p>
          </div>
          
          <div>
            <h3 className="text-textPrimary font-semibold mb-4 text-sm">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-textSecondary hover:text-textPrimary transition">
                  Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/feed" className="text-textSecondary hover:text-textPrimary transition">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/ai-course" className="text-textSecondary hover:text-textPrimary transition">
                  AI Tutor
                </Link>
              </li>
              <li>
                <Link to="/communities" className="text-textSecondary hover:text-textPrimary transition">
                  Communities
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-textPrimary font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-textSecondary hover:text-textPrimary transition">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-textSecondary hover:text-textPrimary transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-textSecondary hover:text-textPrimary transition">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-textSecondary text-sm">
            EduVerse by the community · Made with ❤️ for learners worldwide
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-textSecondary hover:text-textPrimary transition">
              Terms
            </a>
            <a href="#" className="text-textSecondary hover:text-textPrimary transition">
              Privacy
            </a>
            <button className="text-textSecondary hover:text-textPrimary transition">
              🍪 Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

