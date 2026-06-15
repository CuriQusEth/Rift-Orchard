import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEffect } from 'react'
import { useGameStore } from '../../lib/game/store'
import { Wallet } from 'lucide-react'
import { cn } from '../../lib/utils'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const setConnection = useGameStore(state => state.setConnection)

  useEffect(() => {
    setConnection(isConnected, address)
  }, [isConnected, address, setConnection])

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono tracking-tighter uppercase opacity-80 transition-all",
            "bg-white/5 hover:bg-white/10 backdrop-blur-md",
            "text-slate-200"
        )}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono tracking-tighter uppercase transition-all",
            "bg-white/5 hover:bg-white/10 backdrop-blur-md",
            "text-slate-200 shadow-lg shadow-purple-900/10"
      )}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 shadow-[0_0_8px_#64748b]"></div>
      Connect Wallet
    </button>
  )
}
