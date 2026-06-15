import { useState, useEffect } from 'react';
import { useGameStore } from '../../lib/game/store';
import { Dimension } from '../../lib/game/types';
import { WalletConnectButton } from '../ui/WalletConnectButton';
import { GMButton } from '../ui/GMButton';
import { Leaf, Moon, Sun, Wind, Flame, Sprout, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useSignMessage } from 'wagmi';
import { getAttributionData } from '../../lib/erc8021';

export function HUD() {
    const { resources, currentDimension, switchDimension, score, trees } = useGameStore();
    const dimensions: Dimension[] = ['Light', 'Shadow', 'Aether', 'Entropy'];
    const { isConnected, address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);

    const handleRecordOnChain = async () => {
        if (!address) return;
        try {
            setIsSubmitting(true);
            const attribution = getAttributionData();
            const message = `Rift Orchard Record\n\nHarmony Score: ${score}\nTrees Grown: ${trees.length}\nDimension: ${currentDimension}\n\nPlatform: ${attribution.platform}\nBuilder: ${attribution.builder}\n\nSign this message to record your orchard flourishing state on-chain via SIWE.`;
            const sig = await signMessageAsync({ message, account: address });
            setSignature(sig);
        } catch (error) {
            console.error("Signing failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
                
                {/* Resources */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                    <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/5 flex flex-col gap-4 shadow-lg">
                        <div className="flex flex-col">
                            <h2 className="text-base font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-200 uppercase font-bold italic">RIFT ORCHARD</h2>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-slate-500">Dimensional Gardener</span>
                        </div>
                        <div className="flex gap-4 text-xs font-mono">
                            <div className="flex flex-col"><span className="text-[9px] text-purple-400 uppercase font-bold mb-0.5">Aether</span> <span className="text-sm leading-none">{resources.Aether}</span></div>
                            <div className="flex flex-col border-l border-white/10 pl-3 sm:pl-4"><span className="text-[9px] text-orange-400 uppercase font-bold mb-0.5">Light</span> <span className="text-sm leading-none">{resources.Light}</span></div>
                            <div className="flex flex-col border-l border-white/10 pl-3 sm:pl-4"><span className="text-[9px] text-blue-400 uppercase font-bold mb-0.5">Entropy</span> <span className="text-sm leading-none">{resources.Entropy}</span></div>
                            <div className="flex flex-col border-l border-white/10 pl-3 sm:pl-4"><span className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Shadow</span> <span className="text-sm leading-none">{resources.Shadow}</span></div>
                        </div>
                    </div>
                </div>

                {/* Score & Wallet */}
                <div className="flex flex-col items-end gap-3 pointer-events-auto">
                    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-lg">
                        <div className="flex flex-col items-end mr-2">
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest leading-none mb-1">Harmony Score</div>
                            <div className="font-serif italic text-lg font-bold text-slate-200 leading-none">{score}</div>
                        </div>
                        <div className="h-6 w-px bg-white/10 mx-1"></div>
                        <WalletConnectButton />
                    </div>
                    
                    {isConnected && score > 0 && (
                        <div className="flex flex-col items-end gap-2 mt-1">
                            <button
                                onClick={handleRecordOnChain}
                                disabled={isSubmitting || !!signature}
                                className={cn(
                                    "px-4 py-2 rounded-full font-sans text-[10px] uppercase tracking-widest font-bold transition-all shadow-xl flex items-center gap-2",
                                    !signature ? "bg-gradient-to-r from-purple-600 to-blue-700 text-white shadow-purple-900/20" : "bg-emerald-900/50 text-emerald-400 border border-emerald-500/50 cursor-pointer"
                                )}
                            >
                                {isSubmitting ? "Signing..." : signature ? <><ShieldCheck className="w-3 h-3" /> Recorded</> : "Record On-Chain"}
                            </button>
                            <GMButton />
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar: Dimensions & Actions */}
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center justify-end gap-6 z-10 pointer-events-none">
                
                <div className="flex flex-col items-center gap-2 pointer-events-auto bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="flex gap-8 px-4">
                        {dimensions.map(dim => (
                            <button
                                key={dim}
                                onClick={() => switchDimension(dim)}
                                className={cn(
                                    "flex flex-col items-center gap-2 cursor-pointer transition-opacity",
                                    currentDimension === dim ? "opacity-100" : "opacity-40 hover:opacity-80"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                    dim === 'Light' ? "bg-orange-900/20 border border-orange-400/30" :
                                    dim === 'Shadow' ? "bg-slate-900/40 border border-slate-500/30" :
                                    dim === 'Aether' ? "bg-purple-600/30 border-2 border-purple-400/60" : 
                                    "bg-blue-900/20 border border-blue-400/30",
                                    currentDimension === dim && dim === 'Aether' && "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
                                    currentDimension === dim && dim === 'Light' && "shadow-[0_0_15px_rgba(251,146,60,0.4)]",
                                    currentDimension === dim && dim === 'Entropy' && "shadow-[0_0_15px_rgba(96,165,250,0.4)]",
                                    currentDimension === dim && dim === 'Shadow' && "shadow-[0_0_15px_rgba(148,163,184,0.4)]"
                                )}>
                                    <div className={cn(
                                        "rounded-full transition-all duration-300",
                                        currentDimension === dim ? "w-4 h-4" : "w-2 h-2",
                                        dim === 'Light' ? "bg-orange-400" + (currentDimension !== dim ? "/50" : "") :
                                        dim === 'Shadow' ? "bg-slate-400" + (currentDimension !== dim ? "/50" : "") :
                                        dim === 'Aether' ? "bg-purple-400" + (currentDimension !== dim ? "/50" : "") :
                                        "bg-blue-400" + (currentDimension !== dim ? "/50" : "")
                                    )}></div>
                                </div>
                                <span className={cn(
                                    "text-[9px] uppercase font-bold tracking-tighter",
                                    currentDimension === dim ? "text-slate-200" : "text-slate-400"
                                )}>{dim}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Instruction */}
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-center max-w-xs mx-auto drop-shadow-md">
                    Tap ground to plant. Tap trees to tend. Tap glowing fruit to harvest.
                </div>
            </div>
        </>
    );
}
