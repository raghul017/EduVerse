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
  const base = `inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed`;
  
  const variants = {
    primary: 'bg-[#FF6B35] text-black hover:bg-[#ff7a4a]',
    secondary: 'bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-[#FF6B35]',
    ghost: 'bg-transparent text-[#999] hover:text-white hover:bg-[#1a1a1a]',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
    outline: 'border border-[#FF6B35] text-[#FF6B35] bg-transparent hover:bg-[#FF6B35] hover:text-black'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-[12px] gap-1.5',
    md: 'px-5 py-2.5 text-[13px] gap-2',
    lg: 'px-6 py-3 text-[14px] gap-2',
    icon: 'p-2'
  };

  return (
    <button
      type={type}
      className={classNames(base, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
