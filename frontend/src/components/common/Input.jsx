import classNames from 'classnames';

function Input ({ label, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-400">
      {label && <span>{label}</span>}
      <input
        className={classNames(
          'bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </label>
  );
}

export default Input;

