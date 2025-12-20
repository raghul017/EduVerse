import classNames from 'classnames';

function Input ({ label, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-2">
      {label && <span className="text-[11px] uppercase tracking-[0.15em] text-[#555] font-mono">{label}</span>}
      <input
        className={classNames(
          'bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35] transition',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-red-400 text-[12px]">{error}</span>}
    </label>
  );
}

export default Input;
