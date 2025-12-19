import React, { useState, useRef, useEffect } from 'react';

const BASE_STREAM_URL = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream";
const METADATA_URL = "https://rs2.ptservidor.com/proxy/orlando?mp=/status-json.xsl";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(80);
  const [metadata, setMetadata] = useState({ artist: 'Web Rádio', title: 'Figueiró • Portugal' });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        if (!response.ok) return;
        const data = await response.json();
        
        if (data?.icestats?.source) {
          const source = Array.isArray(data.icestats.source) ? data.icestats.source[0] : data.icestats.source;
          if (source?.title) {
            const parts = source.title.split(' - ');
            setMetadata({
              artist: parts[0]?.trim() || 'Web Rádio Figueiró',
              title: parts[1]?.trim() || source.title.trim()
            });
          }
        }
      } catch (e) {
        // Erro silencioso nos metadados para manter foco no áudio
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 20000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const finalUrl = `${BASE_STREAM_URL}&nocache=${Date.now()}`;
        audioRef.current.src = finalUrl;
        audioRef.current.volume = volume / 100;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(error => {
              console.error("Erro ao iniciar áudio:", error);
              setHasError(true);
              setIsLoading(false);
            });
        }
      } catch (error) {
        setHasError(true);
        setIsLoading(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
    }
  };

  return (
    <div className="p-8 md:p-10 rounded-[3rem] bg-slate-900/40 backdrop-blur-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden group">
      <audio 
        ref={audioRef} 
        preload="none"
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
          setHasError(false);
        }}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
          setIsLoading(false);
        }}
      />

      {/* Glow Effect Background */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] transition-all duration-1000 ${isPlaying ? 'bg-indigo-600/30 opacity-100' : 'bg-transparent opacity-0'}`}></div>

      {/* Vinyl/Logo Animation */}
      <div className="flex justify-center mb-10 relative z-10">
        <div className={`relative w-56 h-56 rounded-full border-[10px] border-slate-800/80 p-2 bg-slate-950 shadow-2xl transition-all duration-700 ${isPlaying ? 'scale-105 shadow-indigo-500/30' : 'scale-100'}`}>
          <div className={`w-full h-full rounded-full overflow-hidden transition-all duration-1000 ${isPlaying ? 'animate-spin-slow' : 'opacity-60 grayscale-[50%]'}`}>
            <img 
              src="./logo.png" 
              alt="WRF Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=WRF';
              }}
            />
          </div>
          {/* Record Pin */}
          <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center shadow-inner">
            <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></div>
          </div>
        </div>
      </div>

      {/* Visualizer Bars */}
      <div className="flex items-end justify-center gap-1.5 h-14 mb-8 relative z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-indigo-500/80' : 'bg-slate-700/30'}`}
            style={{
              height: isPlaying ? `${15 + Math.random() * 85}%` : '4px',
              animation: isPlaying ? `pulse 1s ease-in-out infinite` : 'none',
              animationDelay: `${i * 0.05}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Title & Artist */}
      <div className="text-center mb-10 min-h-[5rem] relative z-10">
        <div className="overflow-hidden px-4">
           <h3 className={`text-2xl font-black text-white mb-2 leading-tight ${metadata.title.length > 25 ? 'whitespace-nowrap animate-marquee' : ''}`}>
             {hasError ? "Ligar Novamente" : metadata.title}
           </h3>
        </div>
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-70">
          {hasError ? "Stream Indisponível" : metadata.artist}
        </p>
      </div>

      {/* Play/Pause Button */}
      <div className="flex flex-col items-center gap-10 relative z-10">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-90 group/btn ${
            isPlaying 
            ? 'bg-slate-800 text-indigo-400 border-2 border-indigo-500/40 hover:border-indigo-400 hover:shadow-indigo-500/20' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <i className="fas fa-pause text-3xl"></i>
          ) : (
            <i className="fas fa-play text-3xl ml-1.5 transition-transform group-hover/btn:scale-110"></i>
          )}
        </button>

        {/* Volume Slider */}
        <div className="w-full flex items-center gap-5 px-6">
          <button 
            onClick={() => {
              const newVol = volume > 0 ? 0 : 80;
              setVolume(newVol);
              if(audioRef.current) audioRef.current.volume = newVol / 100;
            }}
            className="text-slate-500 hover:text-indigo-400 transition-colors"
          >
            <i className={`fas ${volume === 0 ? 'fa-volume-mute text-red-500' : 'fa-volume-down'} text-xl`}></i>
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-grow cursor-pointer"
          />
          
          <i className="fas fa-volume-up text-slate-500 text-xl"></i>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-10 flex justify-center relative z-10">
        <div className="px-5 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-3 shadow-2xl">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${hasError ? 'bg-red-400' : isPlaying ? 'bg-green-400' : 'bg-slate-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${hasError ? 'bg-red-500' : isPlaying ? 'bg-green-500' : 'bg-slate-600'}`}></span>
          </div>
          <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            {hasError ? 'Servidor Offline' : isPlaying ? 'Ao Vivo' : isLoading ? 'Conectando...' : 'Standby'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Player;