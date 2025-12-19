
import React from 'react';
import Player from './components/Player';
import Schedule from './components/Schedule';
import Socials from './components/Socials';
import Partners from './components/Partners';
import Counter from './components/Counter';
import News from './components/News';
import Contact from './components/Contact';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 selection:bg-indigo-500/30">
      {/* Header / Logo */}
      <header className="sticky top-0 z-50 glass-effect p-4 shadow-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 group">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300 bg-slate-800">
              <img src="./logo.png" alt="Web Rádio Figueiró" className="w-full h-full object-cover" onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=WRF';
              }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
                Web Rádio Figueiró
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-indigo-400 font-bold tracking-[0.2em] uppercase">Amarante • Portugal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Counter />
            <div className="hidden lg:block h-8 w-[1px] bg-slate-700"></div>
            <Socials />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 space-y-12">
        {/* Hero Section with Player */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 md:p-12 rounded-3xl glass-effect shadow-2xl relative overflow-hidden group border border-indigo-500/20">
              <div className="absolute top-0 right-0 p-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-white mr-2"></span> EM DIRECTO
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
                Bem vindo à <br/>
                <span className="text-indigo-400">Web Rádio Figueiró</span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg max-w-2xl">
                A sua rádio online favorita, trazendo a melhor seleção musical, notícias locais e programas temáticos diretamente de Figueiró para o mundo. Sinta a batida, acompanhe a nossa programação e faça parte da nossa comunidade.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a 
                  href="mailto:webradiofigueiro@gmail.com" 
                  className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-indigo-500/30 active:scale-95"
                >
                  Saber Mais <i className="fas fa-envelope ml-3 opacity-70"></i>
                </a>
                <a 
                  href="https://www.webradiofigueiro.pt" 
                  target="_blank"
                  className="inline-flex items-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 active:scale-95"
                >
                  Ver Site Oficial <i className="fas fa-external-link-alt ml-3 text-xs opacity-50"></i>
                </a>
              </div>
            </div>

            <News />
          </div>

          <div className="lg:col-span-5 sticky top-28">
            <Player />
          </div>
        </section>

        {/* Schedule Section */}
        <section id="programacao">
          <Schedule />
        </section>

        {/* Partners & Promo Area */}
        <section id="parcerias">
          <Partners />
        </section>

        {/* Contact Section */}
        <section id="contacto">
          <Contact />
        </section>
      </main>

      <footer className="glass-effect py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center gap-6 items-center">
             <div className="h-[1px] w-12 bg-slate-800"></div>
             <img src="./logo.png" alt="Logo Footer" className="w-16 h-16 opacity-80" onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=WRF';
              }} />
             <div className="h-[1px] w-12 bg-slate-800"></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-300 font-bold uppercase tracking-widest">Web Rádio Figueiró</p>
            <p className="text-slate-500 text-sm">Amarante • Portugal</p>
          </div>
          <div className="pt-4">
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} Web Rádio Figueiró. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
