import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ children, delay = 0, stagger = 0.1 }) {
  const ref = useRef(null);

  useGSAP(() => {
    const elements = ref.current.children;
    
    gsap.fromTo(
      elements,
      { 
        y: 50, 
        opacity: 0,
        filter: "blur(10px)" 
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%", // Trigger when top of element hits 85% of viewport
          toggleActions: "play none none reverse",
        },
        delay: delay,
      }
    );
  }, { scope: ref });

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}
