
import React from 'react';

const Partners: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-4xl font-black text-white">Área de Promoção & Parcerias</h3>
        <p className="text-slate-400 text-lg">
          Junte-se à Web Rádio Figueiró. Divulgue o seu negócio com quem comunica para toda a região.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Main Partner Card - Highlighted */}
        <a 
          href="https://fm-bicycle.pt/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="md:col-span-2 lg:col-span-1 group relative h-80 rounded-[2.5rem] overflow-hidden border border-indigo-500/30 bg-slate-800/50 hover:border-indigo-500/60 transition-all shadow-2xl block"
        >
          <img 
            src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200" 
            alt="FM - Rent a car & Bicycle House" 
            className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-700 scale-105 group-hover:scale-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-10">
            <h4 className="text-3xl font-black text-white leading-tight mb-4 group-hover:text-indigo-300 transition-colors">
              FM - Rent a car & <br/>Bicycle House
            </h4>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-full shadow-lg group-hover:bg-indigo-500 transition-colors">
                VISITAR WEBSITE
              </span>
              <span className="text-slate-400 group-hover:translate-x-2 transition-transform">
                <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </a>

        {/* Promo Card 1 - Partner */}
        <div className="group p-10 rounded-[2.5rem] glass-effect border border-white/5 flex flex-col justify-center text-center space-y-8 hover:bg-white/10 transition-all shadow-xl">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto text-indigo-400 text-4xl shadow-inner">
            <i className="fas fa-handshake"></i>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white mb-3">Seja nosso parceiro</h4>
            <p className="text-slate-400 leading-relaxed">
              Aumente a visibilidade da sua marca na rádio que mais cresce na região.
            </p>
          </div>
          <a 
            href="mailto:webradiofigueiro@gmail.com" 
            className="w-full py-4 bg-indigo-600 rounded-2xl text-base font-black hover:bg-indigo-500 transition-all text-white shadow-xl hover:shadow-indigo-500/40 active:scale-95 flex items-center justify-center gap-2"
          >
            Seja Parceiro <i className="fas fa-paper-plane text-xs opacity-60"></i>
          </a>
        </div>

        {/* Promo Card 2 - Info */}
        <div className="group p-10 rounded-[2.5rem] glass-effect border border-white/5 flex flex-col justify-center text-center space-y-8 hover:bg-white/10 transition-all shadow-xl">
          <div className="w-20 h-20 bg-purple-500/20 rounded-3xl flex items-center justify-center mx-auto text-purple-400 text-4xl shadow-inner">
            <i className="fas fa-bullhorn"></i>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white mb-3">Divulgação de Eventos</h4>
            <p className="text-slate-400 leading-relaxed">
              Tem um evento? Nós ajudamos a espalhar a palavra com spots dedicados e locução profissional.
            </p>
          </div>
          <a 
            href="mailto:webradiofigueiro@gmail.com" 
            className="w-full py-4 bg-purple-600 rounded-2xl text-base font-black hover:bg-purple-500 transition-all text-white shadow-xl hover:shadow-purple-500/40 active:scale-95 flex items-center justify-center gap-2"
          >
            Saber Mais <i className="fas fa-info-circle text-xs opacity-60"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Partners;
