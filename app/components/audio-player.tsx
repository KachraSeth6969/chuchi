"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume
    audio.volume = volume;

    const handleCanPlay = () => {
      // Automatically try to play when the page loads
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Auto-play was prevented by the browser
            console.log("Auto-play was prevented by the browser");
            setIsPlaying(false);
          });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
      <audio ref={audioRef} loop preload="auto">
        <source src="/music/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <button
        onClick={togglePlay}
        className="text-white hover:text-purple-300 transition-colors duration-200 touch-manipulation p-1"
        title={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>

      <button
        onClick={toggleMute}
        className="text-white hover:text-purple-300 transition-colors duration-200 touch-manipulation p-1"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>
    </div>
  );
}
