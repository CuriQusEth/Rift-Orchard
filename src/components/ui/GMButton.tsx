import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Sun, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export function GMButton() {
  const { isConnected } = useAccount()
  const { data: hash, sendTransaction, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Only visible if user is connected
  if (!isConnected) return null;

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      // Sending 0 ETH, just a transaction. Often GM contracts might need data, 
      // but without ABI we just send an empty tx or a small amount if required.
      // The prompt just says "sends a transaction to the contract".
      value: parseEther('0'), 
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={sendGMTransaction}
        disabled={isPending || isConfirming}
        className={cn(
          "px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-serif text-xs font-bold",
          (isPending || isConfirming) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isPending || isConfirming ? <Loader2 className="w-4 h-4 animate-spin leading-none" /> : <Sun className="w-4 h-4 leading-none" />}
        Say GM
      </button>
      {isSuccess && <span className="text-[10px] text-[#E8A020] font-sans">GM recorded on-chain!</span>}
      {hash && !isSuccess && <span className="text-[10px] text-slate-400 font-sans">Confirming...</span>}
    </div>
  )
}
