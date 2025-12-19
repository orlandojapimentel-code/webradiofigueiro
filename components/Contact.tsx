
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="p-10 rounded-[2.5rem] bg-indigo-950/30 border border-indigo-500/20">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="text-4xl font-extrabold text-white">Contactos</h3>
          <p className="text-slate-400">
            Estamos aqui para o ouvir. Seja para pedir uma música, sugerir um tema ou propor uma parceria, entre em contacto connosco.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
                <a href="mailto:webradiofigueiro@gmail.com" className="hover:text-indigo-400 transition-colors">webradiofigueiro@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Telefone</p>
                <a href="tel:+351910270085" className="hover:text-indigo-400 transition-colors">+351 910 270 085</a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400">
                <i className="fas fa-globe"></i>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Website</p>
                <a href="https://www.webradiofigueiro.pt" target="_blank" className="hover:text-indigo-400 transition-colors">www.webradiofigueiro.pt</a>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect p-8 rounded-3xl space-y-4">
          <h4 className="text-xl font-bold text-white mb-4">Envie-nos uma mensagem</h4>
          <p className="text-sm text-slate-400 mb-6 italic">Clique abaixo para nos enviar um email directamente.</p>
          <a 
            href="mailto:webradiofigueiro@gmail.com" 
            className="block w-full text-center py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            Enviar Email <i className="fas fa-paper-plane ml-2"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
