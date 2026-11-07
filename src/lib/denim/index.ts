/**
 * Base Denim Upgrade - 200ms Native Canonical Blocks
 * 
 * Denim replaced Flashblocks with a complete canonical block every 200ms.
 * - Base Sepolia Activation: October 21, 2026 at 18:00 UTC
 * - Base Mainnet Activation: November 5, 2026 at 18:00 UTC
 * 
 * Key Integration Rules:
 * - Flashblocks subscriptions (newFlashblocks, pendingLogs, newFlashblockTransactions) are permanently retired.
 * - The "pending" block tag resolves to the latest canonical block. Preconfirmation state no longer exists.
 * - Real-time subscriptions use eth_subscribe("newHeads") or eth_subscribe("logs").
 * - 200ms block intervals provide instantaneous on-chain confirmation.
 */

import { base, baseSepolia } from 'wagmi/chains'

export const DENIM_BLOCK_TIME_MS = 200;

export const DENIM_CONFIG = {
  name: 'Base Denim',
  version: '200ms Native Canonical Blocks',
  blockTimeMs: DENIM_BLOCK_TIME_MS,
  defaultChainId: base.id, // Base Mainnet (Chain ID 8453)
  supportedChains: [base.id, baseSepolia.id] as const,
  activation: {
    baseSepolia: '2026-10-21T18:00:00Z',
    baseMainnet: '2026-11-05T18:00:00Z',
    isMainnetLive: true,
  },
  rpcGuidelines: {
    blockTag: 'latest', // Canonical latest block
    headSubscription: 'newHeads', // Replaces newFlashblocks
    logSubscription: 'logs', // Replaces pendingLogs
  }
} as const;

/**
 * Validates and sanitizes block tags to ensure Denim compliance.
 * Throws or replaces 'pending' with 'latest' as required by Denim specifications.
 */
export function sanitizeBlockTagForDenim(tag?: string): 'latest' | 'earliest' | 'safe' | 'finalized' | `0x${string}` | bigint {
  if (tag === 'pending') {
    return 'latest';
  }
  return (tag as any) || 'latest';
}

/**
 * Check if the current chain is Denim-enabled (Base Mainnet or Base Sepolia).
 */
export function isDenimChain(chainId?: number): boolean {
  if (!chainId) return false;
  return chainId === base.id || chainId === baseSepolia.id;
}

/**
 * Returns human-readable Denim status label for given chain
 */
export function getDenimChainLabel(chainId?: number): string {
  if (chainId === base.id) return 'Base Mainnet (Denim Live)';
  if (chainId === baseSepolia.id) return 'Base Sepolia (Denim Live)';
  return 'Base Mainnet (Denim)';
}
