function Loader ({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <span className="inline-block h-3 w-3 rounded-full bg-blue-500 animate-ping" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default Loader;

