import { Address } from "viem";

export type FruitType = 'Time Fruit' | 'Shadow Berry' | 'Star Apple' | 'Void Plum';
export type Dimension = 'Light' | 'Shadow' | 'Aether' | 'Entropy';

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

export interface Fruit {
    id: string;
    type: FruitType;
    value: number;
    x: number;
    y: number;
    dimension: Dimension;
    readyToHarvest: boolean;
    growth: number; // 0 to 1
}

export interface Tree {
    id: string;
    x: number;
    y: number;
    dimension: Dimension;
    stage: number; // 0 to maxStage
    health: number; // 0 to 100
    lastTended: number;
    fruits: Fruit[];
}

export interface GameState {
    trees: Tree[];
    resources: Record<Dimension, number>;
    currentDimension: Dimension;
    score: number;
    isConnected: boolean;
    address: Address | undefined;
}

export const INITIAL_STATE: GameState = {
    trees: [],
    resources: {
        Light: 10,
        Shadow: 0,
        Aether: 0,
        Entropy: 0,
    },
    currentDimension: 'Light',
    score: 0,
    isConnected: false,
    address: undefined,
};
