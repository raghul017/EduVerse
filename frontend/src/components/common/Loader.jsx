import { Loader2 } from 'lucide-react';

function Loader ({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-[#666]">
      <Loader2 size={16} className="text-[#A1FF62] animate-spin" />
      <p className="text-[13px]">{label}</p>
    </div>
  );
}

export default Loader;
