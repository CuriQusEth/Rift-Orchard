import { useState } from 'react'
import { useBlockNumber, useChainId, useSwitchChain } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { Zap, ShieldCheck, Info, ChevronDown, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { DENIM_CONFIG, isDenimChain } from '../../lib/denim'

export function DenimStatusBadge() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [showDetails, setShowDetails] = useState(false)

  // Watch canonical blocks via Wagmi (using Denim 200ms canonical blocks)
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: isDenimChain(chainId) ? chainId : base.id,
  })

  const isSepolia = chainId === baseSepolia.id
  const isMainnet = chainId === base.id
  const isDenim = isDenimChain(chainId)

  return (
    <div className="relative pointer-events-auto">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-tight transition-all",
          "bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 backdrop-blur-md text-blue-200 shadow-sm shadow-blue-950/50"
        )}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping absolute opacity-75"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></div>
        </div>
        <span className="font-bold text-white flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-blue-300" />
          DENIM 200ms
        </span>
        <span className="text-blue-300/80 hidden sm:inline">
          {isSepolia ? 'Sepolia' : 'Base'}
        </span>
        {blockNumber && (
          <span className="text-slate-400 font-mono text-[9px]">
            #{blockNumber.toString()}
          </span>
        )}
        <ChevronDown className={cn("w-3 h-3 text-blue-400 transition-transform", showDetails && "rotate-180")} />
      </button>

      {/* Info Popover */}
      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-slate-950/95 border border-blue-500/30 shadow-2xl backdrop-blur-xl z-50 text-left font-sans animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Base Denim Migration
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Migrated
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            Flashblocks preconfirmations and <code className="text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded">"pending"</code> state tags are replaced with canonical <strong>200ms native blocks</strong>.
          </p>

          <div className="space-y-1.5 text-[10px] text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5 mb-3">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Native 200ms canonical block time</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Zero pending block lag — instantaneous finality</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Subscribed to canonical <code className="text-blue-300">newHeads</code></span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400 font-mono">Network:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => switchChain?.({ chainId: base.id })}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono border transition-all",
                  isMainnet
                    ? "bg-blue-600/40 border-blue-400 text-white font-bold"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                )}
              >
                Base
              </button>
              <button
                onClick={() => switchChain?.({ chainId: baseSepolia.id })}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono border transition-all",
                  isSepolia
                    ? "bg-blue-600/40 border-blue-400 text-white font-bold"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                )}
              >
                Sepolia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
