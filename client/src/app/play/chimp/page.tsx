'use client';

import React, { useState, useEffect } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { cn } from '@/lib/utils';

export default function ChimpGame() {
    const { gameState, score, startGame, endGame, resetGame } = useGameEngine();

    const [level, setLevel] = useState(4); // Start with 4 numbers
    const [positions, setPositions] = useState<{ id: number, top: number, left: number }[]>([]);
    const [nextNumber, setNextNumber] = useState(1);
    const [hidden, setHidden] = useState(false);
    const [strikes, setStrikes] = useState(0);

    const GRID_ROWS = 5;
    const GRID_COLS = 8;

    const generatePositions = (count: number) => {
        const used = new Set<string>();
        const newPositions = [];

        for (let i = 1; i <= count; i++) {
            let r, c, key;
            do {
                r = Math.floor(Math.random() * GRID_ROWS);
                c = Math.floor(Math.random() * GRID_COLS);
                key = `${r},${c}`;
            } while (used.has(key));

            used.add(key);
            // Convert grid to %
            newPositions.push({
                id: i,
                top: (r / GRID_ROWS) * 100 + (100 / GRID_ROWS / 2), // Center in cell
                left: (c / GRID_COLS) * 100 + (100 / GRID_COLS / 2)
            });
        }
        return newPositions;
    };

    const startLevel = (numCount: number) => {
        setNextNumber(1);
        setHidden(false);
        setPositions(generatePositions(numCount));
    };

    const handleStart = () => {
        setLevel(4);
        setStrikes(0);
        startGame();
        startLevel(4);
    };

    const handleTileClick = (number: number) => {
        if (gameState !== 'playing') return;

        if (number === nextNumber) {
            // Correct
            if (number === 1) {
                setHidden(true); // Hide all after first click
            }

            if (number === level) {
                // Level Complete
                setLevel(l => l + 1);
                startLevel(level + 1);
            } else {
                setNextNumber(n => n + 1);
            }
        } else {
            // Wrong
            setStrikes(s => s + 1);
            if (strikes >= 2) {
                endGame(level); // 3 strikes? Or just 1? Let's be harsh: 1 strike end game logic usually, but let's do 3 strikes rule or just end.
                // Chimp test usually ends immediately on fail.
            } else {
                // Reset to same level or end? Competitive usually ends.
                endGame(level);
            }
        }
    };

    return (
        <GameContainer
            title="Chimp Test"
            description="Click the numbers in order (1, 2, 3...). The numbers will disappear after you click 1."
            gameState={gameState}
            score={score}
            scoreLabel="Numbers Memorized"
            onStart={handleStart}
            onRestart={() => { resetGame(); handleStart(); }}
        >
            <div className="w-full h-full relative" style={{ padding: '20px' }}>
                {gameState === 'playing' && positions.map((pos) => {
                    // If number is already clicked (< nextNumber), don't show it.
                    if (pos.id < nextNumber) return null;

                    return (
                        <div
                            key={pos.id}
                            onClick={() => handleTileClick(pos.id)}
                            className={cn(
                                "absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center rounded-full border-2 border-white/20 font-bold text-xl cursor-pointer select-none transition-transform active:scale-95 bg-background shadow-sm hover:border-primary",
                                hidden ? "text-transparent bg-white hover:bg-white/90" : "text-foreground"
                            )}
                            style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                        >
                            {/* If hidden, show nothing text-wise, but keep div for clicking. */}
                            {!hidden && pos.id}
                        </div>
                    );
                })}

                <div className="absolute top-4 left-4 text-sm text-muted-foreground pointer-events-none">
                    Count: {level}
                </div>
            </div>
        </GameContainer>
    );
}
