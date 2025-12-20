import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Video, Users, Map, Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';

const LearningOrbit = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 147; // 2:27 in seconds

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalDuration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const progress = (currentTime / totalDuration) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const newTime = Math.floor((percentage / 100) * totalDuration);
    setCurrentTime(newTime);
  };

  const skills = [
    { icon: Sparkles, label: 'AI Playlist', color: 'cyan' },
    { icon: Video, label: 'Lo-fi Focus', color: 'blue' },
    { icon: Users, label: 'Game Mode', color: 'purple' },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Outer Glow Background */}
      <div className="absolute -top-16 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[140px] bg-cyan-400/15" />
      
      {/* Main Container - Removed box styling */}
      <div className="relative">
        
        <div className="relative p-6 pt-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="text-xs font-semibold text-slate-200 tracking-wide flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-cyan-400" />
              Session Orbit
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 ">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span className="text-[10px] text-cyan-300 font-medium">Live trends</span>
            </div>
          </div>

          {/* Central Orbit Visualization */}
          <div className="relative mx-auto h-64 w-full max-w-md">
            {/* Enhanced Central Glow */}
            <div className="absolute inset-x-10 top-6 bottom-6 rounded-[180px] bg-gradient-to-b from-cyan-500/15 via-[#ff7a4a]/10 to-transparent blur-[60px]" />

            <div className="flex flex-col h-full relative items-center justify-center">
              {/* Central Circle */}
              <div className="relative mb-6">
                {/* Main Circle */}
                <div className="relative h-44 w-44 rounded-full flex items-center justify-center">
                  {/* Outer Glow Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/30 via-[#ff7a4a]/20 to-purple-500/10 blur-xl" />
                  
                  {/* Rotating Border Animation */}
                  <div className="absolute inset-0 rounded-full animate-[spin_15s_linear_infinite]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                  </div>
                  
                  {/* Main Circle Border */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 shadow-[0_0_60px_rgba(6,182,212,0.4),inset_0_0_60px_rgba(6,182,212,0.05)]" />
                  
                  {/* Inner Background */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#0f1f3a] via-[#0a1525] to-black" />

                  {/* Center Content */}
                  <div className="flex flex-col gap-1.5 items-center justify-center z-10">
                    <div className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-300">
                      Trending Mix
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <span className="text-slate-300">128 BPM</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-cyan-400">AI Learning</span>
                    </div>
                  </div>

                  {/* Orbiting Skill Badges */}
                  <div className="absolute inset-0">
                    {skills.map((skill, index) => {
                      let position = {};
                      
                      if (index === 0) position = { top: '-16px', left: '50%', transform: 'translateX(-50%)' };
                      else if (index === 1) position = { left: '-20px', top: '50%', transform: 'translateY(-50%)' };
                      else position = { right: '-20px', top: '50%', transform: 'translateY(-50%)' };

                      return (
                        <div
                          key={index}
                          className="absolute"
                          style={position}
                        >
                          <div className="group flex gap-2.5 text-xs font-semibold text-slate-100 bg-gradient-to-br from-slate-900/95 to-slate-950/95 rounded-full px-4 py-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all hover:scale-110 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] cursor-pointer items-center border border-cyan-400/30 ">
                            <skill.icon className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                            <span className="hidden sm:inline">{skill.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Prompt Text */}
              <div className="relative mb-3 w-full text-center">
                <div className="text-xs text-slate-400">
                  Prompt: <span className="text-slate-300 font-medium">"master web development"</span>
                </div>
              </div>

              {/* Controls */}
              <div className="relative mb-3 flex w-full items-center justify-center gap-3">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-600/60 transition-all  group">
                  <SkipBack className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
                </button>
                
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg hover:scale-105 transition-all active:scale-95 bg-gradient-to-br from-cyan-500 to-[#ff7a4a] shadow-cyan-500/60 hover:shadow-cyan-500/80"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  )}
                </button>

                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-600/60 transition-all  group">
                  <SkipForward className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto">
                <div
                  onClick={handleSeek}
                  className="h-1 w-full overflow-hidden rounded-full bg-slate-800/60 cursor-pointer hover:h-1.5 transition-all relative group"
                >
                  <div
                    className="h-full bg-gradient-to-r transition-all duration-100 ease-linear from-cyan-500 via-cyan-400 to-[#ff7a4a] shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Progress Handle */}
                  <div 
                    className="absolute top-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-cyan-400/50"
                    style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LearningOrbit.propTypes = {
  className: PropTypes.string,
};

export default LearningOrbit;
