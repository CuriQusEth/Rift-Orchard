import { useState } from 'react'
import { useBlockNumber, useChainId, useSwitchChain } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { Zap, ShieldCheck, ChevronDown, CheckCircle2, Globe } from 'lucide-react'
import { cn } from '../../lib/utils'
import { DENIM_CONFIG, isDenimChain } from '../../lib/denim'

export function DenimStatusBadge() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [showDetails, setShowDetails] = useState(false)

  // Watch canonical blocks via Wagmi (using Denim 200ms canonical blocks)
  const activeChainId = isDenimChain(chainId) ? chainId : base.id
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: activeChainId,
  })

  const isMainnet = !chainId || chainId === base.id
  const isSepolia = chainId === baseSepolia.id

  return (
    <div className="relative pointer-events-auto">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-tight transition-all",
          "bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/40 backdrop-blur-md text-blue-200 shadow-md shadow-blue-950/60"
        )}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping absolute opacity-75"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></div>
        </div>
        <span className="font-bold text-white flex items-center gap-1">
          <Zap className="w-3 h-3 text-blue-300" />
          DENIM 200ms
        </span>
        <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
          {isMainnet ? 'Mainnet' : 'Sepolia'}
        </span>
        {blockNumber && (
          <span className="text-slate-400 font-mono text-[9px] hidden sm:inline">
            #{blockNumber.toString()}
          </span>
        )}
        <ChevronDown className={cn("w-3 h-3 text-blue-400 transition-transform", showDetails && "rotate-180")} />
      </button>

      {/* Info Popover */}
      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-xl bg-slate-950/95 border border-blue-500/40 shadow-2xl backdrop-blur-xl z-50 text-left font-sans animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Base Mainnet · Denim Live
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            Denim is <strong>LIVE on Base Mainnet</strong> (activated Nov 5, 2026) and Base Sepolia. Flashblocks and <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded">"pending"</code> tags are retired in favor of native <strong>200ms canonical blocks</strong>.
          </p>

          <div className="space-y-1.5 text-[10px] text-slate-400 bg-white/5 p-2.5 rounded-lg border border-white/5 mb-3">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Base Mainnet 200ms native block finality</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>No preconfirmation lag — canonical state</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Canonical block subscriptions via <code className="text-blue-300 font-mono">newHeads</code></span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-[10px] text-slate-400 font-mono">Active Network:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => switchChain?.({ chainId: base.id })}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-mono border transition-all flex items-center gap-1",
                  isMainnet
                    ? "bg-blue-600 border-blue-400 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                )}
              >
                Base Mainnet
              </button>
              <button
                onClick={() => switchChain?.({ chainId: baseSepolia.id })}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-mono border transition-all",
                  isSepolia
                    ? "bg-blue-600 border-blue-400 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.4)]"
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
