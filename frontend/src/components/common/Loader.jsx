function Loader ({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-text/70">
      <span className="inline-block h-3 w-3 rounded-full bg-primary animate-ping" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default Loader;

