import { useState } from 'react';
import { CanvasRenderer } from './components/game/CanvasRenderer';
import { HUD } from './components/game/HUD';
import { motion, AnimatePresence } from 'motion/react';
import { TreePine } from 'lucide-react';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="relative w-full h-[100dvh] bg-[#0a0512] overflow-hidden font-sans text-slate-200 select-none">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-orange-900/10 blur-[100px]"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div 
            key="title"
            className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6"
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Ambient Title Glows */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-900/20 rounded-full blur-[100px]" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="relative flex flex-col items-center text-center z-10"
            >
                <div className="w-16 h-16 rounded-full bg-purple-600/30 border-2 border-purple-400/60 flex items-center justify-center mb-8 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <TreePine className="w-8 h-8 text-purple-400" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-200 uppercase font-bold italic mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    RIFT<br/>ORCHARD
                </h1>
                
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-12">
                    Dimensional Gardener Portfolio
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGameStarted(true)}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-700 text-sm font-bold uppercase tracking-widest shadow-xl shadow-purple-900/20 border-t border-white/20 text-white"
                >
                    ENTER THE RIFT
                </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <CanvasRenderer />
            <HUD />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
