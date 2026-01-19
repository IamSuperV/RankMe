'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/api';

export default function NumberMemoryGame() {
    const { gameState, score, startGame, endGame, resetGame, setScore } = useGameEngine();
    const [level, setLevel] = useState(1);
    const [number, setNumber] = useState('');
    const [userInput, setUserInput] = useState('');
    const [phase, setPhase] = useState<'memorize' | 'input'>('memorize');
    const [timeLeft, setTimeLeft] = useState(0);

    // Using refs for interval to clear it properly
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startNewGame = () => {
        startGame();
        setLevel(1);
        setScore(0);
        startLevel(1);
    };

    const startLevel = (lvl: number) => {
        const newNumber = generateNumber(lvl);
        setNumber(newNumber);
        setPhase('memorize');
        setUserInput('');

        const displayTime = 2000 + (lvl * 500); // More time for longer numbers
        setTimeLeft(100);

        // Progress bar countdown
        const interval = 100;
        const step = 100 / (displayTime / interval);

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setPhase('input');
                    return 0;
                }
                return prev - step;
            });
        }, interval);
    };

    const generateNumber = (length: number) => {
        let num = '';
        for (let i = 0; i < length; i++) {
            num += Math.floor(Math.random() * 10);
        }
        return num;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInput === number) {
            setScore(level);
            setLevel(l => l + 1);
            startLevel(level + 1);
        } else {
            endGame();
            submitScore(level);
        }
    };

    const submitScore = async (finalLevel: number) => {
        try {
            await apiRequest('/benchmarks', {
                method: 'POST',
                body: JSON.stringify({
                    category: 'NUMBER_MEMORY',
                    score: finalLevel,
                    rawStats: { level: finalLevel }
                })
            });
        } catch (e) { console.error(e) }
    };

    return (
        <GameContainer
            title="Number Memory"
            description="Memorize the number shown."
            gameState={gameState}
            score={score}
            onStart={startNewGame}
            onReset={resetGame}
            scoreLabel="Digits"
        >
            <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md">
                {phase === 'memorize' && (
                    <div className="w-full text-center space-y-8">
                        <div className="text-6xl font-black tracking-widest animate-in zoom-in duration-300">
                            {number}
                        </div>
                        <Progress value={timeLeft} className="h-2" />
                    </div>
                )}

                {phase === 'input' && (
                    <form onSubmit={handleSubmit} className="w-full space-y-4 animate-in slide-in-from-bottom-4">
                        <p className="text-center text-muted-foreground">What was the number?</p>
                        <Input
                            autoFocus
                            type="text"
                            pattern="\d*"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            className="text-center text-3xl tracking-widest h-14"
                            autoComplete="off"
                        />
                        <Button type="submit" className="w-full" size="lg">Submit</Button>
                    </form>
                )}
            </div>
        </GameContainer>
    );
}
