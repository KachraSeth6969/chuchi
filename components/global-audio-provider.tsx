"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

// Define the playlist
const playlist = [
  { id: 1, title: "I Think They Call This Love", src: "/music/background-music.mp3" },
  { id: 2, title: "2002", src: "/music/2002.mp3" },
  { id: 3, title: "Achcha Lagta Hai * Masakali", src: "/music/ALH.mp3" },
  { id: 4, title: "Chaar Kadam", src: "/music/CK.mp3" },
  { id: 5, title: "Photograph", src: "/music/Photograph.mp3" },
  { id: 6, title: "Senorita", src: "/music/Senorita.mp3" },
  { id: 7, title: "Thinking Out Loud", src: "/music/TOL.mp3" },
  { id: 8, title: "We Dont Talk Anymore", src: "/music/WDTAM.mp3" },
  { id: 9, title: "Khuda Jaane", src: "/music/KhudaJAane.mp3" },
  { id: 10, title: "Manwa Laage", src: "/music/ML.mp3" },
  { id: 11, title: "Perfect", src: "/music/Perfect.mp3" },
  { id: 12, title: "Pretty Little Baby", src: "/music/plb.mp3" },
  { id: 13, title: "Pehli Mohabbat", src: "/music/PM.mp3" },

  

   // Replace with your actual file
  
  // 📝 HOW TO ADD MORE SONGS:
  // 1. Add your .mp3 files to the /public/music/ folder
  // 2. Add new entries below like this:
  // { id: 4, title: "Song Title Here", src: "/music/your-song-name.mp3" },
  // { id: 5, title: "Another Song", src: "/music/another-song.mp3" },
  
  // Example with actual song names:
  // { id: 4, title: "Perfect by Ed Sheeran", src: "/music/perfect.mp3" },
  // { id: 5, title: "Thinking Out Loud", src: "/music/thinking-out-loud.mp3" },
];

// 🎵 SHUFFLE ALGORITHM: Fisher-Yates shuffle for random order
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  currentTrack: number;
  currentSong: { id: number; title: string; src: string };
  showTitle: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

interface AudioProviderProps {
  children: ReactNode;
}

export function GlobalAudioProvider({ children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  
  // 🎵 RANDOM PLAYLIST STATE
  const [shuffledPlaylist, setShuffledPlaylist] = useState<typeof playlist>([]);
  const [playlistIndex, setPlaylistIndex] = useState(0);

  // Initialize shuffled playlist on mount
  useEffect(() => {
    const shuffled = shuffleArray(playlist);
    setShuffledPlaylist(shuffled);
    console.log("🎵 New shuffled playlist created:", shuffled.map(s => s.title));
  }, []);

  const currentSong = shuffledPlaylist.length > 0 ? shuffledPlaylist[playlistIndex] : playlist[0];

  const nextTrack = () => {
    if (shuffledPlaylist.length === 0) return;
    
    let nextIndex = playlistIndex + 1;
    
    // If we've reached the end of the shuffled playlist, create a new shuffle
    if (nextIndex >= shuffledPlaylist.length) {
      const newShuffled = shuffleArray(playlist);
      setShuffledPlaylist(newShuffled);
      nextIndex = 0;
      console.log("🔄 Playlist completed! New shuffle:", newShuffled.map(s => s.title));
    }
    
    setPlaylistIndex(nextIndex);
    setShowTitle(true);
    console.log("⏭️ Next track:", shuffledPlaylist[nextIndex]?.title || "Loading...");
    
    // Hide title after 3 seconds
    setTimeout(() => {
      setShowTitle(false);
    }, 3000);
  };

  const previousTrack = () => {
    if (shuffledPlaylist.length === 0) return;
    
    let prevIndex = playlistIndex - 1;
    
    // If we're at the beginning, go to the end of current shuffled playlist
    if (prevIndex < 0) {
      prevIndex = shuffledPlaylist.length - 1;
    }
    
    setPlaylistIndex(prevIndex);
    setShowTitle(true);
    console.log("⏮️ Previous track:", shuffledPlaylist[prevIndex]?.title || "Loading...");
    
    // Hide title after 3 seconds
    setTimeout(() => {
      setShowTitle(false);
    }, 3000);
  };

  useEffect(() => {
    // Create audio element only on client side
    if (typeof window !== 'undefined' && !audioRef.current) {
      console.log("Creating audio element with song:", currentSong);
      const audio = new Audio(currentSong.src);
      audio.preload = 'auto';
      audio.volume = volume;
      audioRef.current = audio;

      const handlePlay = () => {
        console.log("Audio started playing");
        setIsPlaying(true);
      };
      const handlePause = () => {
        console.log("Audio paused");
        setIsPlaying(false);
      };
      const handleEnded = () => {
        console.log("🎵 Song ended, auto-advancing to next random track");
        // Auto advance to next track when song ends (WITHOUT showing title)
        if (shuffledPlaylist.length > 0) {
          let nextIndex = playlistIndex + 1;
          
          // If we've reached the end of the shuffled playlist, create a new shuffle
          if (nextIndex >= shuffledPlaylist.length) {
            const newShuffled = shuffleArray(playlist);
            setShuffledPlaylist(newShuffled);
            nextIndex = 0;
            console.log("🔄 Auto-shuffle: New playlist order:", newShuffled.map(s => s.title));
          }
          
          setPlaylistIndex(nextIndex);
        }
        // Keep showTitle as false for auto-advance
      };
      const handleError = (e: any) => {
        console.error("Audio error:", e);
        setIsPlaying(false);
      };

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);

      // Try to autoplay when component mounts
      const handleCanPlay = () => {
        console.log("Audio can play, attempting autoplay");
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Autoplay successful");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log("Auto-play was prevented by the browser:", error);
              setIsPlaying(false);
            });
        }
      };

      audio.addEventListener("canplay", handleCanPlay);

      return () => {
        console.log("Cleaning up audio element");
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("canplay", handleCanPlay);
        audio.pause();
        audio.src = '';
      };
    }
  }, []); // Remove nextTrack from dependencies

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      console.log("🎵 Updating audio source to:", currentSong.title, "-", currentSong.src);
      const wasPlaying = isPlaying;
      audioRef.current.src = currentSong.src;
      audioRef.current.load();
      
      if (wasPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("✅ Successfully switched and playing new track");
            })
            .catch((error) => {
              console.log("❌ Play was prevented by the browser:", error);
              setIsPlaying(false);
            });
        }
      }
    }
  }, [playlistIndex, currentSong.src]); // Use playlistIndex instead of currentTrack

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      console.log("Volume set to:", volume);
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.log("No audio element found");
      return;
    }

    console.log("Toggle play - current state:", isPlaying);
    
    if (isPlaying) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Play successful");
          })
          .catch((error) => {
            console.log("Play was prevented by the browser:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const contextValue: AudioContextType = {
    isPlaying,
    volume,
    currentTrack,
    currentSong,
    showTitle,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}