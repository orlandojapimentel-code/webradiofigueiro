import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Sparkles, MessageSquare, Music, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RADIO_PHONE } from '../constants';

const getAIInstance = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export const AIService: React.FC = () => {
  const [input, setInput] = useState('');
  const [song, setSong] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'dedication' | 'mood' | 'request'>('request');

  const handleGenerate = async () => {
    if (!input.trim() && mode !== 'request') return;
    if (mode === 'request' && (!input.trim() || !song.trim())) return;

    setIsLoading(true);
    setResponse('');

    try {
      const ai = getAIInstance();
      let prompt = "";
      
      if (mode === 'request') {
        prompt = `Transforma este pedido de música numa dedicatória profissional para rádio. 
        Música: "${song}"
        Dedicatória original: "${input}"
        A resposta deve ser o texto final que o locutor diria na Web Rádio Figueiró, de forma calorosa e profissional.`;
      } else if (mode === 'dedication') {
        prompt = `Transforma esta mensagem numa dedicatória profissional de locutor de rádio para a Web Rádio Figueiró: "${input}". A resposta deve ser curta, calorosa e pronta para ser lida no ar.`;
      } else {
        prompt = `Baseado no meu humor "${input}", sugere 3 tipos de música ou temas musicais ideais para eu ouvir agora na Web Rádio Figueiró. Sê inspirador e breve.`;
      }

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
      });

      setResponse(result.text || "Desculpa, não consegui gerar uma resposta agora.");
    } catch (error) {
      console.error('AI Error:', error);
      if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
        setResponse("O assistente de IA está temporariamente indisponível (Chave API não configurada). Por favor, contacte o administrador.");
      } else {
        setResponse("Erro ao conectar com a inteligência artificial. Tenta novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = RADIO_PHONE.replace(/\s+/g, '').replace('+', '');
    const text = mode === 'request' 
      ? `*Pedido de Música - Web Rádio Figueiró*\n\n*Música:* ${song}\n*Dedicatória:* ${response || input}`
      : `*Dedicatória - Web Rádio Figueiró*\n\n${response || input}`;
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="ai-assistant" className="py-12 px-4">
      <div className="max-w-4xl mx-auto glass rounded-3xl p-8 shadow-xl border-2 border-radio-primary/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-radio-primary/20 rounded-2xl text-radio-primary">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Assistente Inteligente WRF</h2>
            <p className="text-zinc-500 text-sm">Alimentado por Gemini 3.1 Flash</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={() => setMode('request')}
            className={`flex-1 min-w-[140px] py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold ${mode === 'request' ? 'bg-radio-primary text-white shadow-lg scale-105' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200'}`}
          >
            <Music size={18} />
            Pedido de Música
          </button>
          <button 
            onClick={() => setMode('dedication')}
            className={`flex-1 min-w-[140px] py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold ${mode === 'dedication' ? 'bg-radio-primary text-white shadow-lg scale-105' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200'}`}
          >
            <MessageSquare size={18} />
            Dedicatórias
          </button>
          <button 
            onClick={() => setMode('mood')}
            className={`flex-1 min-w-[140px] py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold ${mode === 'mood' ? 'bg-radio-primary text-white shadow-lg scale-105' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200'}`}
          >
            <Sparkles size={18} />
            Sugestão
          </button>
        </div>

        <div className="space-y-4">
          {mode === 'request' && (
            <input 
              type="text"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              placeholder="Qual é a música que queres ouvir?"
              className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-radio-primary outline-none transition-all"
            />
          )}
          
          <div className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'request' ? "Para quem é a música e qual o motivo?" :
                mode === 'dedication' ? "Escreve para quem é a mensagem..." : 
                "Como te sentes hoje? (ex: feliz, nostálgico, com energia...)"
              }
              className="w-full h-32 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-radio-primary outline-none resize-none transition-all"
            />
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !input.trim() || (mode === 'request' && !song.trim())}
              className="absolute bottom-4 right-4 p-3 bg-radio-primary text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-radio-primary/5 border border-radio-primary/20 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-radio-primary" />
              <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed italic">
                "{response}"
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Sugestão da IA para o Locutor</p>
                <button 
                  onClick={handleWhatsApp}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg w-full sm:w-auto justify-center"
                >
                  <MessageCircle size={20} />
                  Enviar para o WhatsApp do Estúdio
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
