import classNames from 'classnames';

function Button ({ variant = 'primary', size = 'md', className, ...props }) {
  const base =
    'rounded font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed hover-lift';
  const variants = {
    primary: 'bg-accent text-background hover:bg-accentHover',
    secondary: 'bg-surface border border-border text-textPrimary hover:bg-card',
    ghost: 'bg-transparent text-textSecondary hover:text-textPrimary hover:bg-surface'
  };
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  return (
    <button
      className={classNames(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export default Button;

