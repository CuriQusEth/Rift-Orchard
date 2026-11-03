import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Rift Orchard',
    }),
  ],
  transports: {
    [base.id]: http(undefined, { batch: true }),
    [baseSepolia.id]: http(undefined, { batch: true }),
  },
})

