import React, { useState, useRef, useEffect } from 'react';

// URL limpo da stream. Para servidores Icecast/Centova via Proxy, o ponto e vírgula pode atrapalhar os parâmetros.
// Vamos usar um formato mais robusto.
const STREAM_URL_BASE = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream";
const METADATA_URL = "https://rs2.ptservidor.com/proxy/orlando?mp=/status-json.xsl";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(80);
  const [metadata, setMetadata] = useState({ artist: 'Web Rádio', title: 'Figueiró • Portugal' });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Busca de metadados
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
        console.warn("Metadata fetch failed", e);
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
      // Limpar o SRC é vital em streams para não continuar a consumir dados e para dar "reset" na ligação
      audioRef.current.src = "";
      audioRef.current.load();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Adicionamos um parâmetro aleatório para evitar que o browser use uma ligação em cache que expirou
        const finalUrl = `${STREAM_URL_BASE}&nocache=${Date.now()}`;
        
        audioRef.current.src = finalUrl;
        audioRef.current.volume = volume / 100;
        
        // Tentativa de reprodução
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(error => {
              console.error("Playback failed:", error);
              setHasError(true);
              setIsLoading(false);
            });
        }
      } catch (error) {
        console.error("Critical player error:", error);
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
      {/* 
          Nota: O atributo crossOrigin é omitido pois o servidor de stream 
          pode não enviar os headers necessários, causando erro de CORS.
      */}
      <audio 
        ref={audioRef} 
        preload="none"
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
          setHasError(false);
        }}
        onError={(e) => {
          console.error("Audio element reported error", e);
          setHasError(true);
          setIsPlaying(false);
          setIsLoading(false);
        }}
      />

      {/* Visual Disco */}
      <div className="flex justify-center mb-10 relative">
        <div className={`absolute inset-0 m-auto w-52 h-52 rounded-full blur-[80px] transition-all duration-1000 ${isPlaying ? 'bg-indigo-600/30 opacity-100' : 'opacity-0'}`}></div>
        
        <div className={`relative w-48 h-48 rounded-full border-[8px] border-slate-800 p-2 bg-slate-950 shadow-2xl transition-all duration-700 ${isPlaying ? 'scale-105 shadow-indigo-500/20' : 'scale-100'}`}>
          <div className={`w-full h-full rounded-full overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <img 
              src="./logo.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=WRF';
              }}
            />
          </div>
          <div className="absolute inset-0 m-auto w-10 h-10 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-indigo-500 animate-ping' : 'bg-slate-700'}`}></div>
          </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="flex items-end justify-center gap-1.5 h-12 mb-8">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-indigo-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-1'}`}
            style={{
              height: isPlaying ? `${20 + Math.random() * 80}%` : '4px',
              animationDelay: `${i * 0.05}s`,
              opacity: isPlaying ? 0.7 : 0.2
            }}
          ></div>
        ))}
      </div>

      {/* Títulos */}
      <div className="text-center mb-10 min-h-[5rem]">
        <h3 className="text-2xl font-black text-white mb-2 truncate px-4 leading-tight">
          {hasError ? "Erro na Ligação" : metadata.title}
        </h3>
        <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] opacity-80">
          {hasError ? "Tente novamente mais tarde" : metadata.artist}
        </p>
      </div>

      {/* Controlos */}
      <div className="flex flex-col items-center gap-10">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 ${
            isPlaying 
            ? 'bg-slate-800 text-indigo-400 border-2 border-indigo-500/40 hover:bg-slate-700' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/40'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <i className="fas fa-pause text-4xl"></i>
          ) : (
            <i className="fas fa-play text-4xl ml-2"></i>
          )}
        </button>

        {/* Volume */}
        <div className="w-full flex items-center gap-5 px-4">
          <button 
            onClick={() => {
              const newVol = volume > 0 ? 0 : 80;
              setVolume(newVol);
              if(audioRef.current) audioRef.current.volume = newVol / 100;
            }}
            className="text-slate-500 hover:text-white transition-colors"
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

      {/* Badge de Status */}
      <div className="mt-10 flex justify-center">
        <div className="px-4 py-2 rounded-full bg-slate-950/50 border border-white/5 flex items-center gap-3 shadow-inner">
          <span className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            {hasError ? 'Falha na Ligação' : isPlaying ? 'Em Direto' : isLoading ? 'A ligar...' : 'Pronto'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Player;