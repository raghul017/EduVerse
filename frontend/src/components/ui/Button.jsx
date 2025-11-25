import { motion } from 'framer-motion';
import classNames from 'classnames';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  beamVariant = 'golden', // 'golden' or 'silver'
  className, 
  disabled,
  onClick,
  type = 'button',
  ...props 
}) => {
  const beamClass = beamVariant === 'silver' ? 'btn-beam-silver' : 'btn-beam';
  const base = `inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${beamClass}`;
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-[0.98] focus:ring-blue-500',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-blue-500/50 shadow-sm hover:shadow-md active:scale-[0.98] focus:ring-blue-500',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 active:scale-[0.98]',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md active:scale-[0.98] focus:ring-red-500',
    outline: 'border-2 border-blue-500 text-blue-400 bg-transparent hover:bg-blue-600 hover:text-white active:scale-[0.98] focus:ring-blue-500'
  };
  
  const sizes = {
    sm: 'px-4 py-1.5 text-sm rounded-full gap-1.5',
    md: 'px-6 py-2 text-sm rounded-full gap-2',
    lg: 'px-8 py-3 text-base rounded-full gap-2',
    icon: 'p-2 rounded-full'
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
