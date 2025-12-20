import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../lib/utils.js";

const CheckFilled = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("w-6 h-6", className)}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd"/>
  </svg>
);

const CheckEmpty = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cn("w-6 h-6", className)}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const LoaderCore = ({ loadingStates, value = 0 }) => (
  <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
    {loadingStates.map((loadingState, index) => {
      const distance = Math.abs(index - value);
      const opacity = Math.max(1 - distance * 0.3, 0);

      return (
        <motion.div
          key={index}
          className="text-left flex gap-3 mb-5"
          initial={{ opacity: 0, y: -(value * 40) }}
          animate={{ opacity, y: -(value * 40) }}
          transition={{ duration: 0.5 }}
        >
          <div>
            {index <= value ? (
              <CheckFilled className={cn(
                "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]",
                value === index ? "text-white" : "text-white/70"
              )} />
            ) : (
              <CheckEmpty className="text-white/20" />
            )}
          </div>
          <span className={cn(
            "text-lg tracking-wide",
            value === index && "text-white font-medium",
            index < value && "text-white/50",
            index > value && "text-white/20"
          )}>
            {loadingState.text}
          </span>
        </motion.div>
      );
    })}
  </div>
);

export function MultiStepLoader({
  loadingStates,
  loading,
  duration = 2000,
  loop = false,
}) {
  const [currentState, setCurrentState] = React.useState(0);

  React.useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prev) =>
        loop
          ? prev === loadingStates.length - 1 ? 0 : prev + 1
          : Math.min(prev + 1, loadingStates.length - 1)
      );
    }, duration);
    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          {/* Subtle gradient glow in center */}
          <div className="absolute inset-0 bg-gradient-radial from-white/[0.03] via-transparent to-transparent pointer-events-none" />
          
          <div className="h-96 relative z-10">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>
          
          {/* Top fade */}
          <div className="bg-gradient-to-b from-black via-transparent to-transparent inset-x-0 top-0 h-32 absolute pointer-events-none" />
          {/* Bottom fade */}
          <div className="bg-gradient-to-t from-black via-transparent to-transparent inset-x-0 bottom-0 h-32 absolute pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MultiStepLoader;
