
import React from 'react';

const Schedule: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Daily Programming */}
      <div className="p-8 rounded-3xl glass-effect border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-6">
          <i className="fas fa-calendar-day text-indigo-500 text-2xl"></i>
          <h3 className="text-2xl font-bold text-white">Programação Diária</h3>
        </div>
        <div className="space-y-4">
          {[
            { time: "08:00 - 10:00", name: "Café com Música", desc: "Comece o dia com a melhor energia." },
            { time: "10:00 - 13:00", name: "Manhãs Figueiró", desc: "Sucessos do momento e clássicos." },
            { time: "13:00 - 15:00", name: "Almoço Musical", desc: "Acompanhamento perfeito para a sua refeição." },
            { time: "15:00 - 19:00", name: "Tarde Dinâmica", desc: "Entretenimento e as melhores faixas." },
            { time: "19:00 - 00:00", name: "Figueiró Night", desc: "O melhor som para as suas noites." },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
              <span className="text-indigo-400 font-bold whitespace-nowrap">{item.time}</span>
              <div>
                <h4 className="font-bold text-slate-100 group-hover:text-indigo-300">{item.name}</h4>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Programming */}
      <div className="p-8 rounded-3xl glass-effect border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-6">
          <i className="fas fa-calendar-week text-indigo-500 text-2xl"></i>
          <h3 className="text-2xl font-bold text-white">Programação Especial</h3>
        </div>
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-500/10 border-l-4 border-indigo-500 group">
            <h4 className="text-xl font-bold text-white mb-1">Night Grooves</h4>
            <p className="text-indigo-400 font-semibold mb-2">Domingos | 22:00 - 00:00</p>
            <p className="text-sm text-slate-400">
              <span className="text-indigo-200">22:00:</span> Primeira hora com DJ Durval<br/>
              <span className="text-indigo-200">23:00:</span> Segunda hora com DJ Convidado
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border-l-4 border-purple-500 group">
            <h4 className="text-xl font-bold text-white mb-1">Prazeres Interrompidos</h4>
            <p className="text-purple-400 font-semibold mb-2">Quartas e Sextas | Podcast</p>
            <p className="text-sm text-slate-400">
              Estreia às <span className="text-indigo-200 font-bold">13:00</span> com repetição às <span className="text-indigo-200 font-bold">20:00</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
