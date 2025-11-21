import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePathStore } from "../store/pathStore.js";
import { useCommunityStore } from "../store/communityStore.js";
import Footer from "../components/common/Footer.jsx";

// Role-based roadmaps (using your existing paths data)
const roleBasedRoadmaps = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Analyst",
  "AI Engineer",
  "Data Scientist",
  "Data Engineer",
  "Android Developer",
  "Machine Learning Engineer",
  "iOS Developer",
  "Blockchain Developer",
  "QA Engineer",
  "Software Architect",
  "Cyber Security",
  "UX Designer",
  "Technical Writer",
  "Game Developer",
  "Product Manager",
  "Engineering Manager",
];

// Skill-based roadmaps
const skillBasedRoadmaps = [
  "SQL",
  "Computer Science",
  "React",
  "Vue",
  "Angular",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Python",
  "System Design",
  "Java",
  "ASP.NET Core",
  "API Design",
  "Spring Boot",
  "Flutter",
  "C++",
  "Rust",
  "Go",
  "Design and Architecture",
  "GraphQL",
  "React Native",
  "Design System",
  "Prompt Engineering",
  "MongoDB",
  "Linux",
  "Kubernetes",
  "Docker",
  "AWS",
  "Terraform",
  "Data Structures & Algorithms",
  "Redis",
  "Git and GitHub",
  "PHP",
  "Next.js",
  "Kotlin",
  "HTML",
  "CSS",
  "Swift & Swift UI",
];

// Guides (placeholder - you can fetch from your API)
const guides = [
  { title: "10 DevOps Deployment Tools for 2025", type: "Textual" },
  { title: "30 C++ Interview Questions and Answers (+ Quiz)", type: "Question" },
  { title: "Top 14 DevOps Testing Tools: My Best Recommendations", type: "Textual" },
  { title: "Top 30 System Design Interview Questions (+ Quiz)", type: "Question" },
  { title: "Top 37 REST API Interview Questions (and Answers)", type: "Question" },
  { title: "Top 20 Python Interview Questions and Answers", type: "Question" },
  { title: "Is Python Hard to Learn? Our Experts Say...", type: "Textual" },
  { title: "What Does a Data Analyst Do?", type: "Textual" },
  { title: "Go vs. Rust Compared: Which is right for you?", type: "Textual" },
  { title: "Python vs JavaScript: The Ultimate Guide for 2025", type: "Textual" },
];

function Homepage() {
  const { paths, fetchPaths } = usePathStore();
  const { communities, fetchCommunities } = useCommunityStore();
  
  // Add fade-in animation to homepage

  useEffect(() => {
    fetchPaths();
    fetchCommunities();
  }, []);

  const RoadmapCard = ({ title, isNew = false, index = 0 }) => (
    <Link
      to={`/ai-roadmap?role=${encodeURIComponent(title)}`}
      className="group relative flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-accent hover:shadow-hover transition-smooth hover-lift animate-slide-up cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-textPrimary font-medium text-sm group-hover:text-accent transition">
            {title}
          </span>
          {isNew && (
            <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-[10px] font-semibold rounded uppercase">
              New
            </span>
          )}
        </div>
      </div>
      <div className="w-5 h-5 border border-border rounded flex items-center justify-center group-hover:border-accent transition">
        <svg
          className="w-3 h-3 text-textSecondary group-hover:text-accent transition"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="max-w-layout mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-textPrimary mb-4">
            EduVerse Roadmaps
          </h1>
          <p className="text-xl text-textSecondary max-w-2xl mx-auto">
            A community-driven platform to learn, grow, and build your future using AI-powered learning.
          </p>
        </div>

        {/* Role-Based Learning Roadmaps */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-textPrimary">
              Role-Based Learning Roadmaps
            </h2>
            <Link
              to="/paths"
              className="text-sm text-textSecondary hover:text-accent transition"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {roleBasedRoadmaps.map((role, index) => (
              <RoadmapCard key={role} title={role} index={index} />
            ))}
            <Link
              to="/paths"
              className="group flex items-center justify-center gap-2 p-4 bg-card border-2 border-dashed border-border rounded-lg hover:border-accent hover:bg-surface transition cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-textSecondary group-hover:text-accent transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm font-medium text-textSecondary group-hover:text-accent transition">
                Create your own roadmap
              </span>
            </Link>
          </div>
        </section>

        {/* Skill-Based Learning Roadmaps */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-textPrimary">
              Skill-Based Learning Roadmaps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skillBasedRoadmaps.map((skill, index) => (
              <RoadmapCard
                key={skill}
                title={skill}
                index={index}
                isNew={skill === "Shell / Bash" || skill === "Laravel"}
              />
            ))}
            <Link
              to="/paths"
              className="group flex items-center justify-center gap-2 p-4 bg-card border-2 border-dashed border-border rounded-lg hover:border-accent hover:bg-surface transition cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-textSecondary group-hover:text-accent transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm font-medium text-textSecondary group-hover:text-accent transition">
                Create your own roadmap
              </span>
            </Link>
          </div>
        </section>

        {/* Project Ideas */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-textPrimary mb-6">
            Project Ideas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Frontend", "Backend", "DevOps"].map((project) => (
              <Link
                key={project}
                to={`/feed?subject=${project}`}
                className="group p-6 bg-card border border-border rounded-lg hover:border-accent hover:shadow-hover transition"
              >
                <h3 className="text-lg font-semibold text-textPrimary mb-2 group-hover:text-accent transition">
                  {project}
                </h3>
                <p className="text-sm text-textSecondary">
                  Explore {project.toLowerCase()} project ideas and tutorials
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-textPrimary mb-6">
            Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {["AWS", "API Security", "Backend Performance", "Frontend Performance", "Code Review"].map(
              (practice) => (
                <Link
                  key={practice}
                  to={`/feed?tag=${practice}`}
                  className="group p-4 bg-card border border-border rounded-lg hover:border-accent hover:shadow-hover transition text-center"
                >
                  <span className="text-sm font-medium text-textPrimary group-hover:text-accent transition">
                    {practice}
                  </span>
                </Link>
              )
            )}
          </div>
        </section>

        {/* Guides */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-textPrimary">Guides</h2>
            <Link
              to="/feed"
              className="text-sm text-textSecondary hover:text-accent transition"
            >
              View All Guides →
            </Link>
          </div>
          <div className="space-y-3">
            {guides.map((guide, idx) => (
              <Link
                key={idx}
                to="/feed"
                className="group flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-accent hover:shadow-hover transition"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-textPrimary group-hover:text-accent transition">
                    {guide.title}
                  </span>
                </div>
                <span className="ml-4 px-2 py-1 text-xs font-medium text-textSecondary bg-surface rounded">
                  {guide.type}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Actively Maintained */}
        <section className="mb-16">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚀</span>
              <h2 className="text-2xl font-semibold text-textPrimary">
                Actively Maintained
              </h2>
            </div>
            <p className="text-textSecondary mb-6">
              We continuously improve our content based on community feedback and industry trends.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary bg-surface border border-border rounded-md hover:border-accent transition">
                View Full Changelog
              </button>
              <button className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary bg-surface border border-border rounded-md hover:border-accent transition">
                🔔 Subscribe for Notifications
              </button>
            </div>
          </div>
        </section>

        {/* Join the Community */}
        <section className="mb-16">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-textPrimary mb-4">
              Join the Community
            </h2>
            <p className="text-textSecondary mb-8 max-w-2xl mx-auto">
              EduVerse is visited by thousands of learners every month. Join our growing community of students, creators, and educators.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-textPrimary mb-2">
                  {communities.reduce((sum, c) => sum + (c.member_count || 0), 0).toLocaleString()}
                </div>
                <p className="text-sm text-textSecondary mb-3">Community Members</p>
                <Link
                  to="/communities"
                  className="inline-block px-4 py-2 text-sm font-medium bg-accent text-background rounded-md hover:bg-accentHover transition"
                >
                  🤝 Join Communities
                </Link>
              </div>
              <div>
                <div className="text-3xl font-bold text-textPrimary mb-2">
                  {paths.length}+
                </div>
                <p className="text-sm text-textSecondary mb-3">Learning Paths</p>
                <Link
                  to="/paths"
                  className="inline-block px-4 py-2 text-sm font-medium bg-accent text-background rounded-md hover:bg-accentHover transition"
                >
                  📚 Explore Paths
                </Link>
              </div>
              <div>
                <div className="text-3xl font-bold text-textPrimary mb-2">AI</div>
                <p className="text-sm text-textSecondary mb-3">Powered Learning</p>
                <Link
                  to="/ai-course"
                  className="inline-block px-4 py-2 text-sm font-medium bg-accent text-background rounded-md hover:bg-accentHover transition"
                >
                  ✨ Try AI Tutor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </div>
  );
}

export default Homepage;

