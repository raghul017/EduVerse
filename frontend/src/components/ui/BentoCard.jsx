import PropTypes from 'prop-types';

/**
 * BentoCard - Specialized card for bento grid layouts with enter animations
 * Supports variable column spans and 3D transforms
 */
export const BentoCard = ({
  children,
  className = '',
  colSpan = 1,
  delay = 0,
  gradient = 'blue',
  onClick
}) => {
  const colSpanClasses = {
    1: '',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  };

  const gradients = {
    blue: 'linear-gradient(315deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.2))',
    purple: 'linear-gradient(315deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0), rgba(139, 92, 246, 0.2))',
    emerald: 'linear-gradient(315deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.2))',
  };

  return (
    <>
      <style>{`
        @keyframes enterUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-enter {
          animation: enterUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        /* 3D Transform utilities */
        .perspective-none { perspective: none !important; }
        .perspective-dramatic { perspective: 100px !important; }
        .perspective-near { perspective: 300px !important; }
        .perspective-normal { perspective: 500px !important; }
        .perspective-midrange { perspective: 800px !important; }
        .perspective-distant { perspective: 1200px !important; }
        .transform-style-preserve-3d { transform-style: preserve-3d !important; }
        .transform-style-flat { transform-style: flat !important; }
      `}</style>
      
      <div
        onClick={onClick}
        className={`
          group flex flex-col overflow-hidden rounded-3xl p-6 
          bg-slate-900/40 backdrop-blur-md
          transition-all duration-300 
          hover:-translate-y-1 hover:shadow-2xl hover:bg-slate-900/80
          hover:shadow-blue-500/10 hover:border-blue-500/30
          animate-enter
          ${colSpanClasses[colSpan]}
          ${className}
        `}
        style={{
          position: 'relative',
          '--border-gradient': gradients[gradient],
          '--border-radius-before': '24px',
          animationDelay: `${delay}s`
        }}
      >
        {/* Gradient Border Effect */}
        <div
          className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none"
          style={{
            background: gradients[gradient],
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px'
          }}
        />
        
        {children}
      </div>
    </>
  );
};

BentoCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  colSpan: PropTypes.oneOf([1, 2, 3]),
  delay: PropTypes.number,
  gradient: PropTypes.oneOf(['blue', 'purple', 'emerald']),
  onClick: PropTypes.func,
};

export default BentoCard;
