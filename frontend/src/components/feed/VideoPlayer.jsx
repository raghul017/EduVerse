import { useEffect, useRef, useState } from "react";

const formatTime = (seconds = 0) => {
  if (Number.isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

function VideoPlayer({ source, thumbnail, title }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setDuration(video.duration || 0);
      setReady(true);
    };
    const handleTime = () => {
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };
    const handleEnded = () => {
      setPlaying(false);
      setProgress(0);
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("timeupdate", handleTime);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("timeupdate", handleTime);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play();
      setPlaying(true);
    }
  };

  const handleSeek = (event) => {
    const video = videoRef.current;
    if (!video) return;
    const value = Number(event.target.value);
    setProgress(value);
    video.currentTime = (value / 100) * video.duration;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative w-full aspect-video bg-black  overflow-hidden">
      {source ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          poster={thumbnail}
          src={source}
          preload="metadata"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text/40 text-sm">
          Video unavailable
        </div>
      )}

      {source && (
        <>
          {!playing && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center text-white"
            >
              <span className="h-16 w-16 rounded-full bg-white/20  flex items-center justify-center border border-white/30">
                <span className="ml-1 text-3xl">▶</span>
              </span>
            </button>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-3 pt-4">
            <div className="flex items-center gap-3 text-white text-xs mb-2">
              <button
                type="button"
                onClick={togglePlay}
                className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
              >
                {playing ? "❚❚" : "▶"}
              </button>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[11px] text-white/70">
                  {ready ? "Playing lesson" : "Loading video metadata..."}
                </p>
                <p className="truncate text-sm font-medium">{title}</p>
              </div>
              <button
                type="button"
                onClick={toggleMute}
                className="text-white/80 text-lg px-1"
              >
                {muted ? "🔇" : "🔊"}
              </button>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/70">
              <span className="tabular-nums w-10 text-right">
                {formatTime((progress / 100) * duration)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="flex-1 accent-primary cursor-pointer"
              />
              <span className="tabular-nums w-10">{formatTime(duration)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VideoPlayer;
