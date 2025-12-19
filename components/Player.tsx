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

  // Integração com o sistema do Telemóvel (Media Session)
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: metadata.title,
        artist: metadata.artist,
        album: 'Web Rádio Figueiró',
        artwork: [
          { src: './logo.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('stop', () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      });
    }
  }, [metadata]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        if (!response.ok) return;
        const data = await response.json();
        if (data?.icestats?.source) {
          const sources = data.icestats.source;
          const source = Array.isArray(sources) ? sources[0] : sources;
          if (source?.title) {
            const parts = source.title.split(' - ');
            setMetadata({
              artist: parts[0]?.trim() || 'Web Rádio Figueiró',
              title: parts[1]?.trim() || source.title.trim()
            });
          }
        }
      } catch (e) {
        console.error("Erro ao carregar metadados");
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
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      setIsPlaying(false);
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    } else {
      try {
        setIsLoading(true);
        setHasError(false);
        
        audioRef.current.src = BASE_STREAM_URL;
        audioRef.current.volume = volume / 100;
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
              if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
            })
            .catch((error) => {
              console.error("Erro na reprodução:", error);
              setHasError(true);
              setIsLoading(false);
              setIsPlaying(false);
            });
        }
      } catch (error) {
        console.error("Erro ao configurar áudio:", error);
        setHasError(true);
        setIsLoading(false);
      }
    }
  };

  // Função para recuperar de falhas de buffer (comum em telemóveis)
  const handleStall = () => {
    if (isPlaying && !isLoading) {
      console.log("Stall detetado, a tentar recuperar...");
      setIsLoading(true);
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().then(() => setIsLoading(false)).catch(() => {});
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
        onPlaying={() => setIsLoading(false)}
        onStalled={handleStall}
        onSuspend={() => console.log("Sistema suspendeu áudio")}
      />
      
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] transition-all duration-1000 ${isPlaying ? 'bg-indigo-600/30 opacity-100' : 'bg-transparent opacity-0'}`}></div>
      
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

      <div className="text-center mb-10 min-h-[5rem] relative z-10">
        <h3 className="text-xl font-black text-white mb-2 leading-tight line-clamp-2">
          {hasError ? "Emissão Indisponível" : metadata.title}
        </h3>
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
          {hasError ? "Erro de Conexão" : metadata.artist}
        </p>
      </div>

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