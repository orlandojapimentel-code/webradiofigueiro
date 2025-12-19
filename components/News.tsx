
import React from 'react';

const News: React.FC = () => {
  const news = [
    {
      date: "Novidades",
      title: "Nova programação",
      content: "Actualizamos os nossos horários e programas para lhe trazer a melhor experiência auditiva. Confira a nova grelha semanal!"
    },
    {
      date: "Evento Local",
      title: "Emissão Especial Amarante",
      content: "A Web Rádio Figueiró estará em directo nos principais pontos da cidade. Fique ligado na nossa emissão!"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black flex items-center gap-3">
          <i className="fas fa-fire-alt text-orange-500"></i> Novidades
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {news.map((item, idx) => (
          <div key={idx} className="p-6 rounded-[2rem] bg-slate-800/30 border border-slate-700/50 hover:border-indigo-500/40 transition-all cursor-default shadow-lg group">
            <span className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.2em]">{item.date}</span>
            <h4 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-indigo-200 transition-colors">{item.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
