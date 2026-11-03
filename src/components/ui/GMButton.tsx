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
import { parseEther } from 'viem'
import { base, baseSepolia } from 'wagmi/chains'
import { Sun, Loader2, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useWalletCapabilities } from '../../hooks/useWalletCapabilities'
import { DENIM_BLOCK_TIME_MS, isDenimChain } from '../../lib/denim'

const GM_CONTRACT = '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3'
// ERC-8021 Suffix encoding
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
    pollingInterval: DENIM_BLOCK_TIME_MS,
  })

  const targetChainId = isDenimChain(chainId) ? chainId : base.id

  const handleSend = () => {
    if (!isDenimChain(chainId)) {
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
    <div className="flex flex-col items-center gap-1.5">
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
      {isSuccess && (
        <span className="text-[10px] text-[#E8A020] font-sans flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          Confirmed in 200ms Denim block!
        </span>
      )}
      {data && !isSuccess && (
        <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
          <Loader2 className="w-2.5 h-2.5 animate-spin text-purple-400" />
          Denim 200ms confirmation...
        </span>
      )}
    </div>
  )
}

function SequentialGMFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: hash, sendTransaction, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    pollingInterval: DENIM_BLOCK_TIME_MS,
  })

  const handleSend = () => {
    if (!isDenimChain(chainId)) {
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
    <div className="flex flex-col items-center gap-1.5">
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
      {isSuccess && (
        <span className="text-[10px] text-[#E8A020] font-sans flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          Confirmed in 200ms Denim block!
        </span>
      )}
      {hash && !isSuccess && (
        <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
          <Loader2 className="w-2.5 h-2.5 animate-spin text-purple-400" />
          Denim 200ms confirmation...
        </span>
      )}
    </div>
  )
}

