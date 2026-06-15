import { useEffect, useRef, MouseEvent } from 'react'
import { useGameStore } from '../../lib/game/store'
import { Dimension, Tree, Fruit } from '../../lib/game/types'

const DIMENSION_COLORS: Record<Dimension, { bg: string, tree: string, leaf: string, particle: string }> = {
    Light: { bg: '#431407', tree: '#78350f', leaf: '#fb923c', particle: '#fdba74' }, // Orange styling from design
    Shadow: { bg: '#020617', tree: '#1e293b', leaf: '#64748b', particle: '#94a3b8' }, // Slate
    Aether: { bg: '#3b0764', tree: '#581c87', leaf: '#c084fc', particle: '#d8b4fe' }, // Purple
    Entropy: { bg: '#172554', tree: '#1e3a8a', leaf: '#60a5fa', particle: '#93c5fd' }  // Blue
};

export function CanvasRenderer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { trees, currentDimension, tendTree, plantSeed, harvestFruit, addPassiveResource } = useGameStore()
    
    // Passive Resource Generation
    useEffect(() => {
        const interval = setInterval(() => {
            addPassiveResource();
        }, 3000);
        return () => clearInterval(interval);
    }, [addPassiveResource]);

    // We want the canvas to adapt to the container
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number;
        
        const render = () => {
             // Handle resizing
            const rect = canvas.getBoundingClientRect()
            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                canvas.width = rect.width
                canvas.height = rect.height
            }

            const colors = DIMENSION_COLORS[currentDimension];

            // Clear background completely transparent
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            // Draw dimension aura overlay
            const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height))
            grad.addColorStop(0, colors.bg + '40') // subtle tint overlay
            grad.addColorStop(1, 'transparent')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw Ground Edge (floating island style)
            ctx.fillStyle = 'rgba(255,255,255,0.03)'
            ctx.beginPath()
            ctx.moveTo(0, canvas.height - 100)
            ctx.quadraticCurveTo(canvas.width / 2, canvas.height - 150, canvas.width, canvas.height - 100)
            ctx.lineTo(canvas.width, canvas.height)
            ctx.lineTo(0, canvas.height)
            ctx.fill()
            
            ctx.strokeStyle = 'rgba(255,255,255,0.08)'
            ctx.lineWidth = 1
            ctx.stroke()

            // Draw Trees
            trees.forEach(tree => {
                const isCurrentDim = tree.dimension === currentDimension;
                ctx.save()
                // If it's a seed
                if (tree.stage === 0) {
                     ctx.fillStyle = isCurrentDim ? colors.leaf : '#475569';
                     ctx.beginPath()
                     ctx.arc(tree.x, canvas.height - 120, 5, 0, Math.PI * 2)
                     ctx.fill()
                     // Glow
                     if (isCurrentDim) {
                        ctx.shadowColor = colors.particle
                        ctx.shadowBlur = 10
                        ctx.fill()
                     }
                } else {
                    // Tree Trunk
                    ctx.fillStyle = isCurrentDim ? colors.tree : '#334155';
                    const height = tree.stage * 40;
                    ctx.fillRect(tree.x - 5, canvas.height - 120 - height, 10, height)
                    
                    // Leaves
                    ctx.fillStyle = isCurrentDim ? colors.leaf : '#475569';
                    ctx.beginPath()
                    ctx.arc(tree.x, canvas.height - 120 - height, 10 + tree.stage * 15, 0, Math.PI * 2)
                    ctx.fill()
                    
                    if (isCurrentDim) {
                       ctx.shadowColor = colors.particle
                       ctx.shadowBlur = 20
                       ctx.fill()
                    }

                    // Fruits
                    if (isCurrentDim) {
                        tree.fruits.forEach(fruit => {
                            ctx.fillStyle = fruit.type === 'Time Fruit' ? '#fde047' : 
                                            fruit.type === 'Shadow Berry' ? '#a855f7' :
                                            fruit.type === 'Star Apple' ? '#38bdf8' : '#fb7185';
                            ctx.beginPath()
                            ctx.arc(fruit.x, canvas.height - 120 - height + fruit.y, 6, 0, Math.PI * 2)
                            ctx.fill()
                            ctx.shadowColor = ctx.fillStyle
                            ctx.shadowBlur = 10
                            ctx.fill()
                        })
                    }
                }
                ctx.restore()
            })

            animationFrameId = window.requestAnimationFrame(render)
        }

        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [trees, currentDimension])

    const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Check fruits
        for (const tree of trees) {
             if (tree.dimension !== currentDimension) continue;
             const height = tree.stage * 40;
             for (const fruit of tree.fruits) {
                 const fx = fruit.x;
                 const fy = canvas.height - 120 - height + fruit.y;
                 const dist = Math.hypot(x - fx, y - fy)
                 if (dist < 20 && fruit.readyToHarvest) {
                     harvestFruit(tree.id, fruit.id)
                     if (navigator.vibrate) navigator.vibrate(50)
                     return;
                 }
             }
        }

        // Check trees to tend
        for (const tree of trees) {
            // Can tend across dimensions? Prompt says "trees exist in multiple realms - care for them in one affects others"
            // For now, if clicking near a tree x, we tend it
            const treeRootY = canvas.height - 120;
            const dist = Math.hypot(x - tree.x, y - treeRootY)
            if (dist < 40) {
                tendTree(tree.id)
                if (navigator.vibrate) navigator.vibrate(20)
                return;
            }
        }

        // Plant seed if clicking ground
        if (y > canvas.height - 150) {
            plantSeed(x, canvas.height - 120)
            if (navigator.vibrate) navigator.vibrate(10)
        }
    }

    return (
        <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-pointer"
            onClick={handleClick}
        />
    )
}
