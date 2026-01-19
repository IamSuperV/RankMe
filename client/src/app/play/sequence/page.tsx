'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { cn } from '@/lib/utils';

export default function SequenceGame() {
    const { gameState, score, startGame, endGame, resetGame } = useGameEngine();

    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [level, setLevel] = useState(1);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [activeTile, setActiveTile] = useState<number | null>(null);

    const GRID_SIZE = 9; // 3x3

    const startNextLevel = () => {
        setUserSequence([]);
        setIsShowingSequence(true);
        const nextTile = Math.floor(Math.random() * GRID_SIZE);

        // Use functional update to ensure we have latest state if called rapidly (though mainly controlled by effect)
        setSequence(prev => [...prev, nextTile]);
    };

    const handleStart = () => {
        setSequence([]);
        setLevel(1);
        startGame();
        // Delay slightly to start first level
        setTimeout(() => {
            startNextLevel();
        }, 500);
    };

    // Show sequence effect
    useEffect(() => {
        if (isShowingSequence && sequence.length > 0) {
            let i = 0;
            const interval = setInterval(() => {
                if (i >= sequence.length) {
                    clearInterval(interval);
                    setActiveTile(null);
                    setIsShowingSequence(false);
                    return;
                }

                setActiveTile(sequence[i]);

                // Turn off tile quickly to allow double flashes on same tile
                setTimeout(() => {
                    setActiveTile(null);
                }, 400); // 400ms flash

                i++;
            }, 700); // 700ms gap

            return () => clearInterval(interval);
        }
    }, [sequence, isShowingSequence]);

    const handleTileClick = (index: number) => {
        if (gameState !== 'playing' || isShowingSequence) return;

        // Visual feedback for click
        setActiveTile(index);
        setTimeout(() => setActiveTile(null), 200);

        const checkSequence = [...userSequence, index];
        setUserSequence(checkSequence);

        // Validate click
        if (checkSequence[checkSequence.length - 1] !== sequence[checkSequence.length - 1]) {
            // Wrong tile
            endGame(level - 1); // Score is levels completed
            return;
        }

        // Level complete?
        if (checkSequence.length === sequence.length) {
            setLevel(l => l + 1);
            setTimeout(startNextLevel, 1000);
        }
    };

    const tiles = Array.from({ length: GRID_SIZE }, (_, i) => i);

    return (
        <GameContainer
            title="Sequence Memory"
            description="Memorize the pattern. Repeat the sequence by clicking the tiles."
            gameState={gameState}
            score={score}
            scoreLabel="Level Reached"
            onStart={handleStart}
            onRestart={() => { resetGame(); handleStart(); }} // Restart immediately
        >
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <div className="grid grid-cols-3 gap-4 w-full max-w-[300px] aspect-square">
                    {tiles.map((i) => (
                        <div
                            key={i}
                            onClick={() => handleTileClick(i)}
                            className={cn(
                                "rounded-lg transition-all duration-200 cursor-pointer shadow-sm border-2 border-transparent",
                                activeTile === i ? "bg-white shadow-[0_0_25px_rgba(255,255,255,0.6)] scale-95" : "bg-white/10 hover:bg-white/20",
                                gameState !== 'playing' && "pointer-events-none opacity-50"
                            )}
                        />
                    ))}
                </div>
                <div className="mt-8 text-2xl font-bold font-mono">
                    Level: {gameState === 'playing' ? level : 1}
                </div>
            </div>
        </GameContainer>
    );
}
