import classNames from 'classnames';

function Input ({ label, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-text/70">
      {label && <span>{label}</span>}
      <input
        className={classNames(
          'bg-surface border border-white/10 rounded px-3 py-2 text-text placeholder:text-text/40 focus:outline-none focus:border-primary transition',
          error && 'border-error',
          className
        )}
        {...props}
      />
      {error && <span className="text-error text-xs">{error}</span>}
    </label>
  );
}

export default Input;

