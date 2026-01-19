'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

type ReactionState = 'waiting-to-start' | 'waiting-for-green' | 'click-now' | 'too-early' | 'result';

export default function ReactionGame() {
    const { gameState, score, startGame, endGame, resetGame, setGameState: setEngineState } = useGameEngine();

    const [reactionState, setReactionState] = useState<ReactionState>('waiting-to-start');
    const [startTime, setStartTime] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleStart = () => {
        startGame();
        setReactionState('waiting-for-green');
        setMessage('Wait for green...');

        const randomDelay = Math.floor(Math.random() * 2000) + 2000; // 2-4 seconds

        timerRef.current = setTimeout(() => {
            setReactionState('click-now');
            setStartTime(performance.now());
            setMessage('CLICK!');
        }, randomDelay);
    };

    const handleInteract = () => {
        if (reactionState === 'waiting-for-green') {
            // Too early
            if (timerRef.current) clearTimeout(timerRef.current);
            setReactionState('too-early');
            setMessage('Too Early!');
            return;
        }

        if (reactionState === 'click-now') {
            // Success
            const endTime = performance.now();
            const reactionTime = Math.round(endTime - startTime);
            endGame(reactionTime);
            setReactionState('result');
            setMessage(`${reactionTime} ms`);
        }

        if (reactionState === 'too-early' || reactionState === 'result') {
            // Retry logic handled by GameContainer Restart usually, but if clicking main area:
            // We'll let the user use the restart button on the end screen.
        }
    };

    const handleRestart = () => {
        resetGame();
        setReactionState('waiting-to-start');
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, []);

    const getBackgroundColor = () => {
        switch (reactionState) {
            case 'waiting-for-green': return 'bg-destructive/80 hover:bg-destructive/80 cursor-wait';
            case 'click-now': return 'bg-green-500 hover:bg-green-500 cursor-pointer';
            case 'too-early': return 'bg-blue-500 hover:bg-blue-500 cursor-default'; // Blue for informational failure
            case 'result': return 'bg-background hover:bg-background cursor-default';
            default: return 'bg-secondary/20';
        }
    };

    return (
        <GameContainer
            title="Reaction Time"
            description="Test your visual reflexes. Click as soon as the red turns green."
            gameState={gameState}
            score={score}
            scoreLabel="Reaction Time (ms)"
            onStart={handleStart}
            onRestart={handleRestart}
        >
            <div
                className={cn(
                    "w-full h-full flex flex-col items-center justify-center transition-colors duration-100 select-none",
                    getBackgroundColor(),
                    gameState === 'playing' ? "cursor-pointer" : ""
                )}
                onMouseDown={gameState === 'playing' ? handleInteract : undefined}
            >
                {gameState === 'playing' && (
                    <div className="text-center">
                        <h2 className="text-5xl font-black text-white drop-shadow-md">
                            {reactionState === 'waiting-for-green' && "Wait for Green..."}
                            {reactionState === 'click-now' && "CLICK!"}
                            {reactionState === 'too-early' && "Too Early!"}
                        </h2>
                        {reactionState === 'too-early' && (
                            <p className="text-white/80 mt-4 text-xl">Click to try again</p>
                        )}
                    </div>
                )}
                {reactionState === 'too-early' && (
                    <div className="absolute inset-0 z-10" onClick={handleStart}></div>
                )}
            </div>
        </GameContainer>
    );
}
