
import React, { useState, useRef, useEffect } from 'react';

const STREAM_URL = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream?type=.mp3";
// Nota: O endpoint de metadados pode variar dependendo da configuração do servidor Icecast/Shoutcast
const METADATA_URL = "https://rs2.ptservidor.com/proxy/orlando?mp=/status-json.xsl";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [metadata, setMetadata] = useState({ artist: 'Web Rádio', title: 'Figueiró • Portugal' });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        const data = await response.json();
        // Ajuste conforme a estrutura específica do seu servidor
        if (data && data.icestats && data.icestats.source) {
          const source = Array.isArray(data.icestats.source) ? data.icestats.source[0] : data.icestats.source;
          if (source.title) {
            const parts = source.title.split(' - ');
            setMetadata({
              artist: parts[0] || 'Web Rádio Figueiró',
              title: parts[1] || source.title
            });
          }
        }
      } catch (e) {
        // Se falhar (por CORS ou formato), mantém o padrão
        console.log("Metadata poll skipped or failed");
      }
    };

    const interval = setInterval(fetchMetadata, 10000);
    fetchMetadata();
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Recarregar a stream para evitar delay acumulado
        audioRef.current.src = STREAM_URL;
        audioRef.current.load();
        audioRef.current.play().catch(e => console.error("Play error:", e));
      }
      setIsPlaying(!isPlaying);
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
    <div className="p-10 rounded-[3rem] bg-slate-900/60 backdrop-blur-3xl border border-indigo-500/20 shadow-2xl overflow-hidden group">
      <audio ref={audioRef} preload="none" crossOrigin="anonymous">
        <source src={STREAM_URL} type="audio/mpeg" />
      </audio>

      <div className="flex justify-center mb-10 relative">
        <div className={`absolute inset-0 m-auto w-52 h-52 rounded-full blur-3xl transition-opacity duration-1000 ${isPlaying ? 'bg-indigo-500/20 opacity-100' : 'opacity-0'}`}></div>
        
        <div className={`relative w-48 h-48 rounded-full border-[6px] border-slate-800 p-1.5 bg-slate-950 shadow-[0_0_50px_rgba(79,70,229,0.2)] overflow-hidden transition-all duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}>
          <div className={`w-full h-full rounded-full overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <img 
              src="./logo.png" 
              alt="Radio Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=WRF';
              }}
            />
          </div>
        </div>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-indigo-600/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-white shadow-xl border border-indigo-500/50">
              OUVIR AGORA
            </div>
          </div>
        )}
      </div>

      <div className="flex items-end justify-center gap-1.5 h-16 mb-8 px-4">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 bg-gradient-to-t from-indigo-600 via-indigo-400 to-cyan-300 rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-pulse' : 'h-2'
            }`}
            style={{
              height: isPlaying ? `${Math.random() * 80 + 20}%` : '6px',
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.6 + Math.random()}s`,
              opacity: isPlaying ? 1 : 0.3
            }}
          ></div>
        ))}
      </div>

      <div className="text-center mb-10">
        <h3 className="text-2xl font-black text-white tracking-tight mb-2 truncate px-2" title={metadata.title}>
          {metadata.title}
        </h3>
        <p className="text-indigo-400 text-sm font-bold uppercase tracking-[0.2em]">{metadata.artist}</p>
      </div>

      <div className="flex flex-col items-center gap-10">
        <button
          onClick={togglePlay}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 group-hover:scale-110 ${
            isPlaying 
            ? 'bg-slate-800 text-indigo-400 border-2 border-indigo-500/50 hover:bg-slate-700' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/40'
          }`}
        >
          {isPlaying ? (
            <i className="fas fa-pause text-4xl"></i>
          ) : (
            <i className="fas fa-play text-4xl ml-2"></i>
          )}
        </button>

        <div className="w-full flex items-center gap-6 px-4">
          <i className="fas fa-volume-down text-slate-500 text-lg"></i>
          <div className="relative flex-grow h-2 bg-slate-800 rounded-full group/vol">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
              style={{ width: `${volume}%` }}
            ></div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-indigo-500 transition-all opacity-0 group-hover/vol:opacity-100"
              style={{ left: `calc(${volume}% - 8px)` }}
            ></div>
          </div>
          <i className="fas fa-volume-up text-slate-500 text-lg"></i>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-950 rounded-full border border-slate-800">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
            {isPlaying ? 'Em Direto' : 'Pronto para ouvir'}
           </span>
        </div>
      </div>
    </div>
  );
};

export default Player;
