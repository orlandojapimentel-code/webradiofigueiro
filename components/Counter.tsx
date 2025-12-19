
import React, { useState, useEffect } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(10150);

  useEffect(() => {
    // Get stored count or initialize
    const storedCount = localStorage.getItem('radio_visitor_count');
    let currentCount = storedCount ? parseInt(storedCount) : 10150;
    
    // Increment for this new session/entry
    const newCount = currentCount + 1;
    setCount(newCount);
    localStorage.setItem('radio_visitor_count', newCount.toString());
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Visitas</span>
        <span className="text-lg font-mono font-bold text-white tracking-widest">
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default Counter;
