import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect } from 'react'
import { useGameStore } from '../../lib/game/store'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export function WalletConnectButton() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const setConnection = useGameStore(state => state.setConnection)

  useEffect(() => {
    setConnection(isConnected, address)
  }, [isConnected, address, setConnection])

  if (isReconnecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono tracking-tighter uppercase opacity-80 transition-all bg-white/5 backdrop-blur-md text-slate-200">
        <Loader2 className="w-3 h-3 animate-spin"/>
        Reconnecting...
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isConnecting}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono tracking-tighter uppercase transition-all",
              "bg-white/5 hover:bg-white/10 backdrop-blur-md",
              "text-slate-200 shadow-lg shadow-purple-900/10 whitespace-nowrap",
              isConnecting && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full shadow-[0_0_8px]",
              connector.id === 'coinbaseWallet' ? "bg-blue-500 text-blue-500" : "bg-slate-500 text-slate-500"
            )}></div>
            Connect {connector.name.replace(' Wallet', '')}
          </button>
        ))}
      </div>
    )
  }

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
