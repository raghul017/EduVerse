import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AnimatedButton - Premium button variants extracted from NovaPulse template
 * Variants: border-spin, glow, pulse
 */
export const AnimatedButton = ({ 
  variant = 'border-spin', 
  to, 
  onClick,
  children, 
  icon: Icon,
  className = '',
  disabled = false 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 relative overflow-hidden tracking-wide";
  
  const Component = to ? Link : 'button';
  const componentProps = to ? { to } : { onClick, disabled };

  if (variant === 'border-spin') {
    return (
      <div className="inline-block bg-transparent">
        <Component
          {...componentProps}
          className={`${baseClasses} text-white ${className}`}
          style={{
            background: 'linear-gradient(#000000, #000000) padding-box, conic-gradient(from 0deg, transparent 0%, #3b82f6 5%, #8b5cf6 15%, #3b82f6 30%, transparent 40%, transparent 100%) border-box',
            boxShadow: 'inset 0 0 0 1px #1a1818',
            border: '1px solid transparent',
            animation: 'border-spin 2.5s linear infinite',
          }}
        >
          <style>{`
            @keyframes border-spin {
              to { 
                background: linear-gradient(#000000, #000000) padding-box, conic-gradient(from 360deg, transparent 0%, #3b82f6 5%, #8b5cf6 15%, #3b82f6 30%, transparent 40%, transparent 100%) border-box;
              }
            }
            @keyframes dot-spin {
              to { 
                mask-image: conic-gradient(from 405deg, black, transparent 10% 90%, black);
              }
            }
            @keyframes shimmer {
              to { 
                transform: translate(-50%, -50%) rotate(360deg);
              }
            }
          `}</style>
          
          {/* Dot Matrix Overlay */}
          <span 
            className="absolute inset-[2px] z-0 rounded-full" 
            style={{
              background: 'radial-gradient(circle at 2px 2px, white 0.5px, transparent 0) padding-box',
              backgroundSize: '4px 4px',
              backgroundRepeat: 'space',
              maskImage: 'conic-gradient(from 45deg, black, transparent 10% 90%, black)',
              opacity: 0.4,
              animation: 'dot-spin 2.5s linear infinite'
            }}
          />
          
          {/* Shimmer Effect */}
          <span 
            className="z-[1] aspect-square -translate-x-1/2 -translate-y-1/2 w-full absolute top-1/2 left-1/2"
            style={{
              background: 'linear-gradient(-50deg, transparent, #3b82f6, transparent)',
              opacity: 0.6,
              animation: 'shimmer 4s linear infinite'
            }}
          />
          
          {Icon && <Icon className="w-5 h-5 z-10 relative" />}
          <span className="z-10 relative">{children}</span>
        </Component>
      </div>
    );
  }

  if (variant === 'glow') {
    return (
      <div className="inline-block group relative">
        <Component
          {...componentProps}
          className={`${baseClasses} text-white/80 hover:text-white bg-white/5  border border-white/10 hover:-translate-y-1 hover:scale-105 ${className}`}
        >
          {Icon && <Icon className="w-5 h-5" />}
          <span className="relative">{children}</span>
          
          {/* Bottom Glow Line */}
          <span 
            aria-hidden="true" 
            className="transition-all duration-300 group-hover:opacity-80 opacity-20 w-[70%] h-[1px] rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)'
            }}
          />
        </Component>
        
        {/* Bottom Glow */}
        <span 
          className="pointer-events-none absolute -bottom-3 left-1/2 z-0 h-6 w-44 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" 
          style={{
            background: 'radial-gradient(60% 100% at 50% 50%, rgba(59,130,246,.55), rgba(59,130,246,.28) 35%, transparent 70%)',
            filter: 'blur(10px) saturate(120%)'
          }} 
          aria-hidden="true"
        />
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <Component
        {...componentProps}
        className={`${baseClasses} text-white bg-[#FF6B35] hover:bg-[#ff7a4a] hover:scale-105 hover:shadow-lg hover:shadow-[#ff7a4a]/50 ${className}`}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </Component>
    );
  }

  return null;
};

AnimatedButton.propTypes = {
  variant: PropTypes.oneOf(['border-spin', 'glow', 'pulse']),
  to: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default AnimatedButton;
