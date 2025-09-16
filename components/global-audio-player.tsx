"use client";

import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useAudio } from "./global-audio-provider";

export function GlobalAudioPlayer() {
  const { isPlaying, currentSong, togglePlay, nextTrack, previousTrack } = useAudio();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-neutral-200 max-w-[280px] sm:max-w-none">
      {/* Song title - optimized for mobile */}
      <div className="flex-1 min-w-0 mr-1">
        <span 
          className="text-xs text-neutral-600 block truncate leading-tight"
          title={currentSong.title} // Shows full title on hover
        >
          {currentSong.title}
        </span>
      </div>
      
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={previousTrack}
          className="text-neutral-700 hover:text-neutral-900 transition-colors duration-200 p-1"
          title="Previous song"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlay}
          className="text-neutral-700 hover:text-neutral-900 transition-colors duration-200 p-1"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={nextTrack}
          className="text-neutral-700 hover:text-neutral-900 transition-colors duration-200 p-1"
          title="Next song"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}