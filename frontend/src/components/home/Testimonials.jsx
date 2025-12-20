import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 0,
    name: "Sarah Nguyen",
    role: "Frontend Developer",
    quote: "EduVerse completely <span class='text-[#FF6B35] tracking-tighter'>transformed the way</span> I learn React. It keeps me focused, efficient, and aligned — <span class='text-[#FF6B35] tracking-tighter'>without endless tutorials</span> or context switching.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 1,
    name: "Michael Chen",
    role: "Data Scientist",
    quote: "The AI roadmaps in EduVerse have <span class='text-[#FF6B35] tracking-tighter'>saved me countless hours</span>. My learning path is optimized, and I can finally focus on what really matters — <span class='text-[#FF6B35] tracking-tighter'>mastering the concepts</span>.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 2,
    name: "Emily Rodriguez",
    role: "UX Designer",
    quote: "Switching to EduVerse was the <span class='text-[#FF6B35] tracking-tighter'>best decision</span> I made this year. The resources are curated perfectly, and my progress has <span class='text-[#FF6B35] tracking-tighter'>never been faster</span>.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 3,
    name: "David Kim",
    role: "Backend Engineer",
    quote: "EduVerse's intelligent tracking helps me <span class='text-[#FF6B35] tracking-tighter'>stay on track</span> with confidence. The real-time feedback from the AI tutor is a <span class='text-[#FF6B35] tracking-tighter'>game-changer</span>.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 4,
    name: "Jessica Park",
    role: "Product Manager",
    quote: "From basics to advanced topics, EduVerse makes everything <span class='text-[#FF6B35] tracking-tighter'>effortless and efficient</span>. I've reduced learning time by 40% and my skills have <span class='text-[#FF6B35] tracking-tighter'>skyrocketed</span>.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
  }
];

export function Testimonials() {
  const [activeId, setActiveId] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeTestimonial = testimonials.find(t => t.id === activeId);

  const handleTestimonialClick = (id) => {
    if (id === activeId || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveId(id);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative">
      <div className="overflow-hidden  ring-white/10 ring-1 p-6 sm:p-8 relative  border-gradient" style={{ background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)' }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#FF6B35]/10 blur-3xl"></div>

        {/* Header */}
        <div className="animate-on-scroll text-center mb-12 animate">
          <div className="mb-6">
            <div className="flex items-center justify-between text-[13px] sm:text-sm font-medium uppercase tracking-tight text-[#FF6B35]">
              <span>TESTIMONIALS</span>
              <span>(05)</span>
            </div>
            <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:items-center sm:justify-between mb-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white text-left mt-0 tracking-tighter">
              What our learners say
            </h2>
            <p className="text-sm sm:text-base text-slate-300 text-left max-w-[42ch]">Real feedback from students using EduVerse to master new skills faster.</p>
          </div>
        </div>

        {/* Testimonial */}
        <section className="relative animate-on-scroll animate delay-100">
          <div className="overflow-hidden ring-white/10 ring-1  p-6 sm:p-10 relative  border-gradient" style={{ minHeight: '540px', background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)' }}>
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[size:64px_64px]" style={{ backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.12) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.12) 1px,transparent 1px)' }}></div>
            <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FF6B35]/10 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#FF6B35]/10 blur-3xl"></div>

            <div className="absolute top-6 left-6 opacity-10 text-white">
              <Quote size={64} />
            </div>

            <div className="flex flex-col justify-between" style={{ minHeight: '420px' }}>
              <blockquote className={`relative text-center max-w-5xl mx-auto transition-opacity duration-300 flex-1 flex items-center justify-center ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <p 
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-white tracking-tighter"
                  dangerouslySetInnerHTML={{ __html: activeTestimonial.quote }}
                />
              </blockquote>

              <div className={`mt-8 text-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-sm sm:text-base text-slate-200 font-medium">
                  {activeTestimonial.name} <span className="text-slate-400 font-normal">{activeTestimonial.role}</span>
                </p>
              </div>

              <div className="mt-10 flex items-end justify-center gap-3 sm:gap-4 flex-wrap">
                {testimonials.map((t) => (
                  <img 
                    key={t.id}
                    className={` object-cover cursor-pointer transition-all duration-200 hover:opacity-80 ${
                      activeId === t.id 
                        ? 'h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-white/20 shadow-lg opacity-100' 
                        : 'h-12 w-12 sm:h-14 sm:w-14 ring-1 ring-white/10 opacity-40 grayscale'
                    }`}
                    src={t.image}
                    alt={t.name}
                    onClick={() => handleTestimonialClick(t.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
