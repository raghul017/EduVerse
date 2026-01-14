import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * SpotlightCard
 * A premium card component that reveals a radial gradient glow around the cursor
 * when interacting with the card. Uses GSAP for high-performance physics-based tracking.
 */
function SpotlightCard({ 
  children, 
  className = "", 
  spotlightColor = "rgba(161, 255, 98, 0.15)",
  as: Component = "div",
  variant = "default", // default | solid
  ...props 
}) {
  const divRef = useRef(null);
  const spotlightRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  useGSAP(() => {
    if (!spotlightRef.current) return;

    const xTo = gsap.quickTo(spotlightRef.current, "x", { duration: 0.5, ease: "power3", unit: "px" });
    const yTo = gsap.quickTo(spotlightRef.current, "y", { duration: 0.5, ease: "power3", unit: "px" });

    const handleMouseMove = (e) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };

    divRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (divRef.current) divRef.current.removeEventListener("mousemove", handleMouseMove);
    };
  }, { scope: divRef });

  const handleFocus = () => setOpacity(1);
  const handleBlur = () => setOpacity(0);
  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  // Variant Styles
  const baseStyles = "relative overflow-hidden rounded-[20px] transition-colors duration-300 p-[40px]";
  const variantStyles = {
    default: "bg-surface border border-border group",
    solid: "bg-[#F84131] border border-[#F84131] text-white group"
  };

  return (
    <Component
      ref={divRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {/* Spotlight for Default Variant */}
      {variant === 'default' && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute -top-0 -left-0 h-0 w-0 transition-opacity duration-300 z-10"
          style={{ opacity }}
        >
          <div 
             className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px]"
             style={{ background: `radial-gradient(circle closest-side, ${spotlightColor}, transparent)` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full z-20">{children}</div>
    </Component>
  );
}

SpotlightCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  spotlightColor: PropTypes.string,
  as: PropTypes.elementType,
  variant: PropTypes.oneOf(['default', 'solid']),
};

export default SpotlightCard;
