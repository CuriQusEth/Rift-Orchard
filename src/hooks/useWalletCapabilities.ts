import { useCapabilities, useChainId } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { useMemo } from 'react'

export function useWalletCapabilities() {
  const chainId = useChainId()
  const targetChainId = chainId === baseSepolia.id ? baseSepolia.id : base.id
  const { data: capabilities } = useCapabilities()

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.[targetChainId]?.atomic
    return atomic?.status === 'ready' || atomic?.status === 'supported'
  }, [capabilities, targetChainId])

  const supportsPaymaster = useMemo(() => {
    return capabilities?.[targetChainId]?.paymasterService?.supported === true
  }, [capabilities, targetChainId])

  return { supportsBatching, supportsPaymaster, targetChainId }
}

