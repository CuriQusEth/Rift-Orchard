import { create } from 'zustand';
import { GameState, INITIAL_STATE, Tree, Dimension } from './types';

interface GameStore extends GameState {
    plantSeed: (x: number, y: number) => void;
    tendTree: (id: string) => void;
    harvestFruit: (treeId: string, fruitId: string) => void;
    switchDimension: (dim: Dimension) => void;
    setConnection: (isConnected: boolean, address?: `0x${string}`) => void;
    addPassiveResource: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useGameStore = create<GameStore>((set) => ({
    ...INITIAL_STATE,

    plantSeed: (x, y) => set((state) => {
        if (state.resources[state.currentDimension] < 5) return state; // Cost 5
        const newTree: Tree = {
            id: generateId(),
            x,
            y,
            dimension: state.currentDimension,
            stage: 0,
            health: 100,
            lastTended: Date.now(),
            fruits: []
        };
        return {
            ...state,
            trees: [...state.trees, newTree],
            resources: {
                ...state.resources,
                [state.currentDimension]: state.resources[state.currentDimension] - 5
            }
        };
    }),

    tendTree: (id) => set((state) => {
        const trees = state.trees.map(tree => {
            if (tree.id === id) {
                // Growth logic
                const newStage = Math.min(tree.stage + 1, 4);
                // Add fruit randomly if mature enough
                const fruits = [...tree.fruits];
                if (newStage >= 2 && Math.random() > 0.5 && fruits.length < 3) {
                    fruits.push({
                        id: generateId(),
                        type: tree.dimension === 'Light' ? 'Time Fruit' : 
                              tree.dimension === 'Shadow' ? 'Shadow Berry' : 
                              tree.dimension === 'Aether' ? 'Star Apple' : 'Void Plum',
                        value: 10 * newStage,
                        x: tree.x + (Math.random() - 0.5) * 50,
                        y: tree.y - 50 - Math.random() * 50,
                        dimension: tree.dimension,
                        readyToHarvest: true,
                        growth: 1
                    })
                }
                return { ...tree, stage: newStage, health: 100, lastTended: Date.now(), fruits };
            }
            return tree;
        });
        return { ...state, trees };
    }),

    harvestFruit: (treeId, fruitId) => set((state) => {
        let harvestedValue = 0;
        let dim: Dimension = 'Light';
        const trees = state.trees.map(tree => {
            if (tree.id === treeId) {
                dim = tree.dimension;
                const fruits = tree.fruits.filter(f => {
                    if (f.id === fruitId && f.readyToHarvest) {
                        harvestedValue += f.value;
                        return false;
                    }
                    return true;
                });
                return { ...tree, fruits };
            }
            return tree;
        });

        if (harvestedValue > 0) {
            return {
                ...state,
                trees,
                score: state.score + harvestedValue,
                resources: {
                    ...state.resources,
                    [dim]: state.resources[dim] + harvestedValue
                }
            };
        }
        return state;
    }),

    switchDimension: (dim) => set({ currentDimension: dim }),
    setConnection: (isConnected, address) => set({ isConnected, address }),
    
    addPassiveResource: () => set((state) => ({
        resources: {
            ...state.resources,
            [state.currentDimension]: state.resources[state.currentDimension] + 1
        }
    }))
}));
