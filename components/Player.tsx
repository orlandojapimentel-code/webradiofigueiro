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
      } catch (e) { /* Silencioso */ }
    };
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 20000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
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
          playPromise.then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          }).catch(() => {
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
    if (audioRef.current) audioRef.current.volume = val / 100;
  };

  return (
    <div className="p-8 md:p-10 rounded-[3rem] bg-slate-900/40 backdrop-blur-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden group">
      <audio ref={audioRef} preload="none" />
      
      {/* Glow Effect */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] transition-all duration-1000 ${isPlaying ? 'bg-indigo-600/30 opacity-100' : 'bg-transparent opacity-0'}`}></div>
      
      {/* Disco Animado */}
      <div className="flex justify-center mb-10 relative z-10">
        <div className={`relative w-56 h-56 rounded-full border-[10px] border-slate-800/80 p-2 bg-slate-950 shadow-2xl transition-all duration-700 ${isPlaying ? 'scale-105 shadow-indigo-500/30' : 'scale-100'}`}>
          <div className={`w-full h-full rounded-full overflow-hidden transition-all duration-1000 ${isPlaying ? 'animate-spin-slow' : 'opacity-60 grayscale-[50%]'}`}>
            <img src="./logo.png" alt="WRF" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=WRF'} />
          </div>
          <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center">
            <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></div>
          </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="flex items-end justify-center gap-1.5 h-14 mb-8 relative z-10">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-indigo-500/80' : 'bg-slate-700/30'}`} 
            style={{ 
              height: isPlaying ? `${20 + Math.random() * 80}%` : '4px', 
              transitionDuration: isPlaying ? '150ms' : '300ms'
            }} 
          ></div>
        ))}
      </div>

      {/* Informação da Música */}
      <div className="text-center mb-10 min-h-[5rem] relative z-10">
        <h3 className="text-xl font-black text-white mb-2 leading-tight line-clamp-2">
          {hasError ? "Ligação Perdida" : metadata.title}
        </h3>
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
          {hasError ? "Tente novamente" : metadata.artist}
        </p>
      </div>

      {/* Controlos */}
      <div className="flex flex-col items-center gap-10 relative z-10">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-95 ${
            isPlaying 
            ? 'bg-slate-800 text-indigo-400 border-2 border-indigo-500/40' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/40'
          } ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? (
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <i className="fas fa-pause text-3xl"></i>
          ) : (
            <i className="fas fa-play text-3xl ml-1.5"></i>
          )}
        </button>

        <div className="w-full flex items-center gap-5 px-6">
          <i className={`fas ${volume === 0 ? 'fa-volume-mute text-red-500' : 'fa-volume-down'} text-slate-500`}></i>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-grow cursor-pointer"
          />
          <i className="fas fa-volume-up text-slate-500"></i>
        </div>
      </div>
    </div>
  );
};

export default Player;