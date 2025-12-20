import PropTypes from 'prop-types';

/**
 * PremiumCard - Reusable card with gradient border and glassmorphism
 * Extracted from NovaPulse template
 */
export const PremiumCard = ({
  children,
  className = '',
  gradient = 'blue',
  hover = true,
  onClick
}) => {
  const gradients = {
    blue: 'linear-gradient(135deg, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0))',
    purple: 'linear-gradient(135deg, rgba(139, 92, 246, 0), rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0))',
    emerald: 'linear-gradient(135deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0))',
    cyan: 'linear-gradient(135deg, rgba(6, 182, 212, 0), rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0))',
  };

  const hoverClasses = hover 
    ? 'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden  p-6 
        bg-gradient-to-br from-[#FF6B35]/0 via-[#ff7a4a]/10 to-[#ff7a4a]/0
        ${hoverClasses}
        ${className}
      `}
      style={{
        position: 'relative',
        '--border-gradient': gradients[gradient],
        '--border-radius-before': '24px'
      }}
    >
      {/* Gradient Border Effect */}
      <style>{`
        [style*="--border-gradient"]::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: var(--border-radius-before, inherit);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          background: var(--border-gradient);
          pointer-events: none;
        }
      `}</style>
      
      {children}
    </div>
  );
};

PremiumCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  gradient: PropTypes.oneOf(['blue', 'purple', 'emerald', 'cyan']),
  hover: PropTypes.bool,
  onClick: PropTypes.func,
};

export default PremiumCard;
