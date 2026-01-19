'use client';

import React, { useState, useRef } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { apiRequest } from '@/lib/api';

export default function ReactionTimeGame() {
    const { gameState, setGameState, score, setScore, startGame, endGame, resetGame } = useGameEngine();
    const [status, setStatus] = useState<'waiting' | 'ready' | 'clicked'>('waiting');
    const [startTime, setStartTime] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleStart = () => {
        startGame();
        setStatus('waiting');
        prepareRound();
    };

    const prepareRound = () => {
        setStatus('waiting');
        const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5s
        timeoutRef.current = setTimeout(() => {
            setStatus('ready');
            setStartTime(Date.now());
        }, delay);
    };

    const handleClick = () => {
        if (status === 'waiting') {
            // Early click
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            alert("Too early! Try again.");
            prepareRound();
            return;
        }

        if (status === 'ready') {
            const reactionTime = Date.now() - startTime;
            setScore(reactionTime);
            setStatus('clicked');
            setGameState('ended');
            submitScore(reactionTime);
        }
    };

    const submitScore = async (finalScore: number) => {
        try {
            await apiRequest('/benchmarks', {
                method: 'POST',
                body: JSON.stringify({
                    category: 'REACTION_TIME',
                    score: finalScore,
                    rawStats: { reactionTimeMs: finalScore }
                })
            });
        } catch (err) {
            console.error("Failed to submit score", err);
        }
    };

    return (
        <GameContainer
            title="Reaction Time"
            description="Click as soon as the box turns green."
            gameState={gameState}
            score={score}
            onStart={handleStart}
            onReset={resetGame}
            scoreLabel="Time"
            unit="ms"
        >
            <div
                className={`w-full h-[300px] rounded-lg cursor-pointer flex items-center justify-center text-3xl font-bold select-none transition-colors duration-100 ${status === 'waiting' ? 'bg-destructive text-white' :
                        status === 'ready' ? 'bg-green-500 text-white' :
                            'bg-primary text-white'
                    }`}
                onMouseDown={handleClick}
            >
                {status === 'waiting' && "Wait for Green..."}
                {status === 'ready' && "CLICK!"}
                {status === 'clicked' && `${score} ms`}
            </div>
        </GameContainer>
    );
}
