'use client';

import React, { useState, useEffect } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { Target } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AimTrainerGame() {
    const { gameState, score, setScore, startGame, endGame, resetGame } = useGameEngine();
    const [targetsLeft, setTargetsLeft] = useState(30);
    const [startTime, setStartTime] = useState(0);
    const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });

    const TOTAL_TARGETS = 30;

    const startNewGame = () => {
        startGame();
        setTargetsLeft(TOTAL_TARGETS);
        setStartTime(Date.now());
        moveTarget();
    };

    const moveTarget = () => {
        const top = Math.random() * 80 + 10 + '%';
        const left = Math.random() * 80 + 10 + '%';
        setTargetPos({ top, left });
    };

    const hitTarget = () => {
        if (targetsLeft <= 1) {
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            const avgTime = Math.round(totalTime / TOTAL_TARGETS);
            setScore(avgTime);
            endGame();
            submitScore(avgTime);
        } else {
            setTargetsLeft(t => t - 1);
            moveTarget();
        }
    };

    const submitScore = async (finalScore: number) => {
        try {
            await apiRequest('/benchmarks', {
                method: 'POST',
                body: JSON.stringify({
                    category: 'AIM_TRAINER',
                    score: finalScore,
                    rawStats: { avgTimeMs: finalScore, targets: TOTAL_TARGETS }
                })
            });
        } catch (err) { console.error(err); }
    };

    return (
        <GameContainer
            title="Aim Trainer"
            description={`Hit ${TOTAL_TARGETS} targets as fast as you can.`}
            gameState={gameState}
            score={score}
            onStart={startNewGame}
            onReset={resetGame}
            scoreLabel="Avg Time"
            unit="ms"
        >
            <div className="w-full h-[400px] bg-secondary/20 relative rounded-lg border-2 border-dashed border-muted overflow-hidden cursor-crosshair">
                <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer text-red-500 hover:text-red-400 transition-colors"
                    style={{ top: targetPos.top, left: targetPos.left }}
                    onMouseDown={(e) => { e.preventDefault(); hitTarget(); }}
                >
                    <Target size={64} />
                </div>
                <div className="absolute top-2 right-2 font-mono text-muted-foreground">
                    Remaining: {targetsLeft}
                </div>
            </div>
        </GameContainer>
    );
}
