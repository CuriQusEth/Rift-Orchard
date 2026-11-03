/**
 * Base Denim Upgrade - 200ms Native Canonical Blocks
 * 
 * Replaces Flashblocks preconfirmations with canonical 200ms blocks.
 * - Flashblocks subscriptions (newFlashblocks, pendingLogs, newFlashblockTransactions) are deprecated/removed.
 * - "pending" block tags are removed in favor of canonical latest state ("latest").
 * - Sub-second block times (200ms) enable instant on-chain finality and responsive game states.
 */

import { base, baseSepolia } from 'wagmi/chains'

export const DENIM_BLOCK_TIME_MS = 200;

export const DENIM_CONFIG = {
  name: 'Base Denim',
  version: 'Denim 200ms Native Blocks',
  blockTimeMs: DENIM_BLOCK_TIME_MS,
  supportedChains: [base.id, baseSepolia.id] as const,
  activation: {
    baseSepolia: '2026-10-21T18:00:00Z',
    baseMainnet: 'November 2026',
  },
  rpcGuidelines: {
    blockTag: 'latest', // Never use 'pending' after Denim
    headSubscription: 'newHeads', // Replaces 'newFlashblocks'
    logSubscription: 'logs', // Replaces 'pendingLogs'
  }
} as const;

/**
 * Validates and sanitizes block tags to ensure Denim compliance.
 * Throws or replaces 'pending' with 'latest' as required by Denim specifications.
 */
export function sanitizeBlockTagForDenim(tag?: string): 'latest' | 'earliest' | 'safe' | 'finalized' | `0x${string}` | bigint {
  if (tag === 'pending') {
    console.warn('[Denim Migration] "pending" block tag has no equivalent after Denim activation. Falling back to canonical "latest".');
    return 'latest';
  }
  return (tag as any) || 'latest';
}

/**
 * Check if the current chain is Denim-enabled (Base or Base Sepolia).
 */
export function isDenimChain(chainId?: number): boolean {
  if (!chainId) return false;
  return chainId === base.id || chainId === baseSepolia.id;
}
