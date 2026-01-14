import classNames from 'classnames';
import Magnetic from './Magnetic';

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
  const base = `inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed rounded-full`; // Enforce Pill Shape
  
  const variants = {
    primary: 'bg-[#BDFF6B] text-black hover:bg-[#a6e65c] shadow-[0_4px_12px_rgba(189,255,107,0.2)]', // Acid Lime
    secondary: 'bg-[#161616] border border-[#333] text-white hover:bg-[#222] hover:border-[#444]', // Surface
    ghost: 'bg-transparent text-[#999] hover:text-white hover:bg-[#161616]',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
    outline: 'border border-[#BDFF6B] text-[#BDFF6B] bg-transparent hover:bg-[#BDFF6B] hover:text-black'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-[12px] gap-1.5',
    md: 'px-5 py-2.5 text-[13px] gap-2',
    lg: 'px-6 py-3 text-[14px] gap-2',
    icon: 'p-2'
  };

  const buttonElement = (
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

  // Apply Magnetic effect only to primary buttons for that "heavy" feel
  if (variant === 'primary' && !disabled) {
    return <Magnetic strength={40}>{buttonElement}</Magnetic>;
  }

  return buttonElement;
};

export default Button;
