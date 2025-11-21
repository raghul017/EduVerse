import { motion } from 'framer-motion';
import classNames from 'classnames';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  onClick,
  type = 'button',
  ...props 
}) => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accentHover shadow-sm hover:shadow-md active:scale-[0.98] focus:ring-accent',
    secondary: 'bg-surface border border-border text-textPrimary hover:bg-card hover:border-accent/50 shadow-sm hover:shadow-md active:scale-[0.98] focus:ring-accent',
    ghost: 'bg-transparent text-textSecondary hover:text-textPrimary hover:bg-surface active:scale-[0.98]',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm hover:shadow-md active:scale-[0.98] focus:ring-danger',
    outline: 'border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white active:scale-[0.98] focus:ring-accent'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2',
    icon: 'p-2 rounded-lg'
  };

  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={classNames(base, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
