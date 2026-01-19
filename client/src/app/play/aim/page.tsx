'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { Target } from 'lucide-react';

export default function AimGame() {
    const { gameState, score, startGame, endGame, resetGame } = useGameEngine();

    const [targetsLeft, setTargetsLeft] = useState(30);
    const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });
    const [startTime, setStartTime] = useState(0);

    const TOTAL_TARGETS = 30;

    const moveTarget = () => {
        // Keep within 10% - 90% range to avoid edge clipping
        const top = Math.floor(Math.random() * 80) + 10;
        const left = Math.floor(Math.random() * 80) + 10;
        setTargetPosition({ top: `${top}%`, left: `${left}%` });
    };

    const handleStart = () => {
        setTargetsLeft(TOTAL_TARGETS);
        setStartTime(performance.now());
        moveTarget();
        startGame();
    };

    const handleTargetClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent background clicks if we add miss-tracking later

        if (gameState !== 'playing') return;

        const remaining = targetsLeft - 1;
        setTargetsLeft(remaining);

        if (remaining <= 0) {
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            const averageTimePerTarget = Math.round(timeTaken / TOTAL_TARGETS);
            endGame(averageTimePerTarget); // Score is avg ms per target (lower is better)
        } else {
            moveTarget();
        }
    };

    return (
        <GameContainer
            title="Aim Trainer"
            description={`Hit ${TOTAL_TARGETS} targets as fast as you can.`}
            gameState={gameState}
            score={score}
            scoreLabel="Avg Time per Target (ms)"
            onStart={handleStart}
            onRestart={() => { resetGame(); handleStart(); }}
        >
            <div className="w-full h-full relative bg-secondary/10 cursor-crosshair select-none">

                {gameState === 'playing' && (
                    <>
                        <div className="absolute top-4 left-4 text-xl font-bold text-muted-foreground pointer-events-none">
                            Remaining: {targetsLeft}
                        </div>

                        <div
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-none"
                            style={{ top: targetPosition.top, left: targetPosition.left }}
                            onMouseDown={handleTargetClick}
                        >
                            <Target className="w-16 h-16 text-destructive fill-destructive/20 hover:scale-110 active:scale-90 transition-transform duration-75" />
                        </div>
                    </>
                )}

            </div>
        </GameContainer>
    );
}
