import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils.js";
import { ArrowRight, Terminal } from "lucide-react";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  disabled = false,
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const newDataRef = useRef([]);
  const intervalRef = useRef(null);

  // Placeholder cycling animation
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  // Canvas drawing for vanish effect
  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);
    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (pixelData[e] !== 0 && pixelData[e + 1] !== 0 && pixelData[e + 2] !== 0) {
          newData.push({
            x: n, y: t,
            color: [pixelData[e], pixelData[e + 1], pixelData[e + 2], pixelData[e + 3]],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x, y, r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  // Vanish animation
  const animate = (start, callback) => {
    const animateFrame = (pos = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) continue;
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
          callback && callback();
        }
      });
    };
    animateFrame(start);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value && !animating) {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!value || animating) return;

    setAnimating(true);
    draw();

    const submittedValue = value;
    const maxX = newDataRef.current.reduce(
      (prev, current) => (current.x > prev ? current.x : prev), 0
    );

    // Start animation and call onSubmit when done
    animate(maxX, () => {
      onSubmit && onSubmit(e, submittedValue);
    });
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto h-12 transition-all duration-300",
        "bg-[#111] border-l-4 border-l-[#FF6B35] border-y border-r border-y-[#2a2a2a] border-r-[#2a2a2a]",
        "hover:bg-[#1a1a1a]",
        value && "bg-[#161616]"
      )}
      onSubmit={handleSubmit}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B35] font-mono font-bold text-lg pointer-events-none z-50">
        &gt;
      </div>

      <canvas
        className={cn(
          "absolute pointer-events-none text-sm transform scale-50 top-[20%] left-10 origin-top-left pr-20 font-mono",
          !animating ? "opacity-0" : "opacity-100"
        )}
        ref={canvasRef}
      />
      <input
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange && onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        disabled={disabled || animating}
        className={cn(
          "w-full relative text-sm font-mono z-50 border-none text-white bg-transparent h-full focus:outline-none focus:ring-0 pl-10 pr-12",
          "placeholder:text-white/30",
          animating && "text-transparent"
        )}
      />
      
      {/* Submit button - terminal style */}
      <button
        onClick={value && !animating ? handleSubmit : undefined}
        type="submit"
        disabled={!value || animating}
        className={cn(
          "absolute right-4 top-1/2 z-50 -translate-y-1/2 h-10 px-4 flex items-center gap-2 transition-all duration-300 font-mono text-[13px] font-bold uppercase",
          value && !animating 
            ? "bg-[#FF6B35] text-black hover:bg-[#ff7a4a]" 
            : "bg-[#2a2a2a] text-[#555] cursor-not-allowed"
        )}
      >
        <span className="hidden sm:inline">Run</span>
        <ArrowRight size={16} />
      </button>

      {/* Animated placeholder */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              key={`placeholder-${currentPlaceholder}`}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="text-[#555] text-[18px] font-mono pl-14 text-left w-[calc(100%-6rem)] truncate"
            >
              {placeholders[currentPlaceholder]}_
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

export default PlaceholdersAndVanishInput;
