'use client';

import React, { useState } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { apiRequest } from '@/lib/api';

interface ChimpTile {
    id: number;
    val: number;
    x: number;
    y: number;
    visible: boolean;
}

export default function ChimpTestGame() {
    const { gameState, score, setScore, startGame, endGame, resetGame } = useGameEngine();
    const [tiles, setTiles] = useState<ChimpTile[]>([]);
    const [nextExpected, setNextExpected] = useState(1);
    const [strikes, setStrikes] = useState(0);
    const [infoMode, setInfoMode] = useState(false); // Numbers hidden?

    const startNewGame = () => {
        startGame();
        setScore(4); // Start at 4 numbers
        setStrikes(0);
        setupLevel(4);
    };

    const setupLevel = (count: number) => {
        setNextExpected(1);
        setInfoMode(false);
        const newTiles: ChimpTile[] = [];
        const positions = new Set<string>();

        for (let i = 1; i <= count; i++) {
            let x, y, key;
            do {
                x = Math.floor(Math.random() * 8); // Grid 8x5 (approx)
                y = Math.floor(Math.random() * 5);
                key = `${x},${y}`;
            } while (positions.has(key));
            positions.add(key);
            newTiles.push({ id: i, val: i, x, y, visible: true });
        }
        setTiles(newTiles);
    };

    const handleTileClick = (tile: ChimpTile) => {
        if (!tile.visible) return;

        if (tile.val === 1) {
            setInfoMode(true); // Hide remaining numbers after first click
        }

        if (tile.val === nextExpected) {
            const updatedTiles = tiles.map(t => t.id === tile.id ? { ...t, visible: false } : t);
            setTiles(updatedTiles);

            if (nextExpected === score) {
                // Level complete
                setScore(s => s + 1);
                setInfoMode(false);
                setTimeout(() => setupLevel(score + 1), 500);
            } else {
                setNextExpected(n => n + 1);
            }
        } else {
            // Wrong click
            if (strikes < 2) {
                alert("Strike! Try same level again.");
                setStrikes(s => s + 1);
                setInfoMode(false);
                setTiles(tiles.map(t => ({ ...t, visible: true }))); // Reset visibility
                setNextExpected(1);
            } else {
                endGame();
                submitScore(score);
            }
        }
    };

    const submitScore = async (finalScore: number) => {
        try {
            await apiRequest('/benchmarks', {
                method: 'POST',
                body: JSON.stringify({
                    category: 'CHIMP_TEST',
                    score: finalScore,
                    rawStats: { count: finalScore }
                })
            });
        } catch (e) { console.error(e) }
    };

    return (
        <GameContainer
            title="Chimp Test"
            description="Click numbers in order. They hide after the first click."
            gameState={gameState}
            score={score}
            onStart={startNewGame}
            onReset={resetGame}
            scoreLabel="Numbers"
        >
            <div className="relative w-[320px] h-[350px] sm:w-[500px] border border-muted bg-background/50 rounded-xl">
                {tiles.map(tile => (
                    tile.visible && (
                        <div
                            key={tile.id}
                            className={`absolute w-12 h-12 flex items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm hover:bg-primary/10 cursor-pointer font-bold text-xl select-none transition-all
                            ${infoMode && tile.val > 1 ? 'text-transparent bg-white border-white dark:bg-white' : 'text-foreground'}`}
                            style={{
                                left: `${tile.x * 12.5}%`,
                                top: `${tile.y * 20}%`,
                                transform: 'translate(25%, 25%)'
                            }}
                            onMouseDown={() => handleTileClick(tile)}
                        >
                            <span className={infoMode && tile.val > 1 ? 'invisible' : 'visible'}>{tile.val}</span>
                        </div>
                    )
                ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">Strikes: {strikes}/3</div>
        </GameContainer>
    );
}
