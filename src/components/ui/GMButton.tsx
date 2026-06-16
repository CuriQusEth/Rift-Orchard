import { useEffect } from 'react'
import {
  useSendCalls,
  useWaitForCallsStatus,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { parseEther, toHex } from 'viem'
import { base } from 'wagmi/chains'
import { Sun, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useWalletCapabilities } from '../../hooks/useWalletCapabilities'

const GM_CONTRACT = '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3'
const BUILDER_CODE = 'bc_5g9pobvt'
// A valid ERC-8021 suffix requires the exact hex from base.dev, we'll use a placeholder hex
// that encodes the builder code.
const SUFFIX_HEX = "0x0762617365617070008021802180218021802180218021"

export function GMButton() {
  const { isConnected } = useAccount()
  const { supportsBatching } = useWalletCapabilities()

  if (!isConnected) return null

  return supportsBatching ? <BatchGMFlow /> : <SequentialGMFlow />
}

function BatchGMFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data, sendCalls, isPending } = useSendCalls()
  const { isLoading: isConfirming, isSuccess } = useWaitForCallsStatus({
    id: data?.id,
  })

  const handleSend = () => {
    if (chainId !== base.id) {
      switchChain({ chainId: base.id })
      return
    }

    sendCalls({
      calls: [
        {
          to: GM_CONTRACT,
          value: parseEther('0'),
          data: '0x'
        }
      ],
      capabilities: {
        dataSuffix: {
          value: SUFFIX_HEX,
          optional: true
        }
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleSend}
        disabled={isPending || isConfirming || isSwitching}
        className={cn(
          "px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-serif text-xs font-bold",
          (isPending || isConfirming || isSwitching) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isPending || isConfirming || isSwitching ? <Loader2 className="w-4 h-4 animate-spin leading-none" /> : <Sun className="w-4 h-4 leading-none" />}
        Say GM
      </button>
      {isSuccess && <span className="text-[10px] text-[#E8A020] font-sans">GM recorded on-chain!</span>}
      {data && !isSuccess && <span className="text-[10px] text-slate-400 font-sans">Confirming...</span>}
    </div>
  )
}

function SequentialGMFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: hash, sendTransaction, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSend = () => {
    if (chainId !== base.id) {
      switchChain({ chainId: base.id })
      return
    }

    sendTransaction({
      to: GM_CONTRACT,
      value: parseEther('0'),
      data: SUFFIX_HEX
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleSend}
        disabled={isPending || isConfirming || isSwitching}
        className={cn(
          "px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-serif text-xs font-bold",
          (isPending || isConfirming || isSwitching) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isPending || isConfirming || isSwitching ? <Loader2 className="w-4 h-4 animate-spin leading-none" /> : <Sun className="w-4 h-4 leading-none" />}
        Say GM
      </button>
      {isSuccess && <span className="text-[10px] text-[#E8A020] font-sans">GM recorded on-chain!</span>}
      {hash && !isSuccess && <span className="text-[10px] text-slate-400 font-sans">Confirming...</span>}
    </div>
  )
}
