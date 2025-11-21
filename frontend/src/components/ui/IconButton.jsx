import { motion } from 'framer-motion';
import classNames from 'classnames';

const IconButton = ({ 
  children, 
  variant = 'ghost', 
  size = 'md', 
  className, 
  disabled,
  onClick,
  'aria-label': ariaLabel,
  ...props 
}) => {
  const base = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accentHover shadow-sm hover:shadow-md focus:ring-accent',
    secondary: 'bg-surface border border-border text-textPrimary hover:bg-card hover:border-accent/50 shadow-sm focus:ring-accent',
    ghost: 'bg-transparent text-textSecondary hover:text-textPrimary hover:bg-surface',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm focus:ring-danger'
  };
  
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={classNames(base, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default IconButton;
