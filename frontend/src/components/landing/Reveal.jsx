import { useRef } from "react";
import PropTypes from "prop-types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// NOTE: ScrollTrigger is registered once in pages/Landing.jsx. Do not register
// it again here; repeated registration is the pattern the GSAP docs warn about.

/**
 * Reveal -- the page-wide scroll-in primitive.
 *
 * Retuned from the pre-redesign Home.jsx toolkit animation, which used
 * stagger 0.2 and back.out(1.2). The overshoot of back.out reads as bouncy
 * rather than confident, and 0.2 was slow enough that the last item in a row
 * arrived long after the first. Now 0.7s / power3.out / stagger 0.08.
 *
 * MOTION IS MOTIVATED (skill 5): this exists to establish reading order.
 * Items arrive in the sequence they should be read, which is why the stagger
 * is small enough to feel like one gesture rather than a queue.
 *
 * Animates opacity and y only, both compositor-friendly. Never width/height.
 *
 * REDUCED MOTION: y-translation is dropped and only the opacity fade remains,
 * per the brief. The element must never be left invisible.
 */
function Reveal({
  children,
  as: Tag = "div",
  stagger = 0.08,
  delay = 0,
  y = 24,
  start = "top 85%",
  className = "",
  ...rest
}) {
  const scope = useRef(null);

  useGSAP(
    () => {
      const targets = scope.current.children;
      if (!targets.length) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: reduced ? 0 : y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.current,
            start,
            // once: the reveal is an entrance, not a state. Replaying it on
            // scroll-back is the kind of motion that reads as decoration.
            once: true,
          },
        }
      );
    },
    { scope }
  );

  return (
    <Tag ref={scope} className={className} {...rest}>
      {children}
    </Tag>
  );
}

Reveal.propTypes = {
  children: PropTypes.node,
  as: PropTypes.elementType,
  stagger: PropTypes.number,
  delay: PropTypes.number,
  y: PropTypes.number,
  start: PropTypes.string,
  className: PropTypes.string,
};

export default Reveal;
