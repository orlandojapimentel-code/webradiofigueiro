import React, { useState, useEffect } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const START_OFFSET = 10160;
  const NAMESPACE = "webradiofigueiro_v2";
  const KEY = "visitas_totais";

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        // Incrementa (+1) e obtém o valor atual da API
        const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`);
        if (!response.ok) throw new Error('API offline');
        const data = await response.json();
        
        // O valor final é o que a API tem + o nosso ponto de partida (10160)
        if (data && typeof data.count === 'number') {
          setCount(data.count + START_OFFSET);
        }
      } catch (error) {
        console.error("Erro no contador:", error);
        // Fallback apenas para não ficar vazio em caso de erro de rede
        setCount(START_OFFSET);
      }
    };

    fetchCounter();
  }, []);

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Acessos Totais</span>
        </div>
        <span className="text-xl font-mono font-bold text-white tracking-wider tabular-nums">
          {count !== null ? count.toLocaleString('pt-PT') : "------"}
        </span>
      </div>
    </div>
  );
};

export default Counter;