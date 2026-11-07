# Rift Orchard 🌌🌱

> **Dimensional Gardener** — A serene yet mystical on-chain cultivation and exploration game set across fractured ethereal planes, supercharged by **Base Denim** 200ms native canonical blocks.

---

## 📖 Overview

**Rift Orchard** invites you to become a Dimensional Gardener. Cultivate otherworldly trees across four interwoven planes of reality, balance volatile cosmic energies, and harvest rare celestial fruit to elevate your **Harmony Score**. 

Integrated with the **Base** ecosystem, Rift Orchard leverages the **Denim upgrade** (200ms native canonical blocks) for near-instant on-chain confirmations, batch transaction execution via EIP-5792, and ERC-8021 transaction attribution.

---

## 🔮 The Four Dimensions

Each plane possesses unique visual atmospheres, natural properties, and resonant flora:

| Dimension | Element | Primary Color | Resonant Fruit | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Aether** | Star Essence | Deep Violet (`#c084fc`) | **Star Apple** | High-energy realm of primordial cosmic light. |
| **Light** | Solar / Time | Radiant Amber (`#fb923c`) | **Time Fruit** | Accelerated lifecycles and chronal warmth. |
| **Shadow** | Ethereal Void | Obsidian Slate (`#94a3b8`) | **Shadow Berry** | Deep contemplation, resilience, and slow-maturing yields. |
| **Entropy** | Quantum Flux | Cobalt Blue (`#60a5fa`) | **Void Plum** | Unpredictable, dynamic energies that surge and transform. |

---

## 🎮 How to Play

1. **Enter the Rift:** Start your journey from the title portal.
2. **Plant Seeds:** Click or tap on the floating island surface in your active dimension. Planting costs **5 units** of that dimension's resource.
3. **Tend Trees:** Click on growing saplings to nurture them through 4 maturation stages.
4. **Harvest Fruit:** Once mature, trees sprout radiant fruits. Click them to collect and boost your **Harmony Score** while replenishing your elemental stock.
5. **Shift Planes:** Switch between **Aether**, **Light**, **Shadow**, and **Entropy** at the bottom navigation dock to tend your orchard across dimensions.
6. **Passive Accumulation:** Resonance accumulates passively over time as your grove flourishes.

---

## ⚡ On-Chain Features & Base Denim Integration

### 1. Base Denim 200ms Native Blocks (Mainnet Live)
- Fully migrated from Flashblocks to **Base Denim**, activated on **Base Mainnet on November 5, 2026 at 18:00 UTC** (and Base Sepolia on October 21, 2026).
- Sub-second **200ms canonical block finality** across Base Mainnet without relying on deprecated `pending` block tags or preconfirmations.
- Zero-latency feedback on transactions with 200ms polling intervals.
- Live block tracking badge in the HUD displaying real-time canonical block heights directly on Base Mainnet.

### 2. Smart Wallet & Batch Transactions (EIP-5792)
- Seamless wallet connectivity via **Coinbase Smart Wallet** and standard injected providers.
- Automatic capability detection: executes batched calls (`useSendCalls`) when supported, with automatic fallback to sequential transactions for standard EOAs.

### 3. ERC-8021 Transaction Attribution
- Includes ERC-8021 calldata suffix (`dataSuffix`) targeting builder attribution (`bc_5g9pobvt`) to credit on-chain interactions.

### 4. On-Chain Orchard Records
- Cryptographically sign orchard snapshots (SIWE message format) to immortalize your Harmony Score, tree population, and dominant dimension state on-chain.

### 5. On-Chain "Say GM"
- Transmit instantaneous 200ms on-chain GM greetings directly to the Base contract.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling & Motion:** Tailwind CSS v4, Motion (`motion/react`), Lucide React
- **Graphics:** HTML5 2D Canvas rendering engine with custom particles and depth layers
- **State Management:** Zustand
- **Web3 & Blockchain:** Wagmi v2, Viem v2, `@base-org/account`, `@tanstack/react-query`
- **Networks:** Base Mainnet & Base Sepolia (Denim 200ms Canonical Blocks)

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm` / `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd rift-orchard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to `http://localhost:3000` to enter the Rift.

### Available Scripts

- `npm run dev` — Launch the development server with Hot Module Replacement.
- `npm run build` — Compile TypeScript and generate the production bundle with Vite.
- `npm run preview` — Locally preview the production build.
- `npm run lint` — Validate TypeScript typings and syntax (`tsc --noEmit`).

---

## 📜 License

Distributed under the MIT License. Cultivate freely in the on-chain orchard.
