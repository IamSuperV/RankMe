'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export default function NumberMemoryGame() {
    const { gameState, score, startGame, endGame, resetGame } = useGameEngine();

    const [level, setLevel] = useState(1);
    const [number, setNumber] = useState('');
    const [userInput, setUserInput] = useState('');
    const [phase, setPhase] = useState<'memorize' | 'input'>('memorize');
    const [timeLeft, setTimeLeft] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const generateNumber = (length: number) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10).toString();
        }
        return result;
    };

    const startLevel = (lvl: number) => {
        setLevel(lvl);
        setPhase('memorize');
        setUserInput('');
        const newNumber = generateNumber(lvl); // Level 1 = 1 digit, Level 2 = 2 digits... actually maybe start harder? 
        // Usually starts at 1 digit and ramps up.
        setNumber(newNumber);

        // Time to memorize: e.g., 2s + 0.5s per digit
        const timeToMemorize = 1000 + (lvl * 600);
        setTimeLeft(100);

        // Initial delay before hiding
        setTimeout(() => {
            setPhase('input');
        }, timeToMemorize);
    };

    const handleStart = () => {
        startGame();
        startLevel(1);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (userInput === number) {
            // Correct
            const nextLevel = level + 1;
            startLevel(nextLevel);
        } else {
            // Wrong
            endGame(level); // Score is the level reached (or last completed level)
        }
    };

    // Focus input when phase changes
    useEffect(() => {
        if (phase === 'input' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [phase]);

    // Visual timer effect (optional, simplified here)
    useEffect(() => {
        if (phase === 'memorize' && gameState === 'playing') {
            // Could animate progress bar here
        }
    }, [phase, gameState]);

    return (
        <GameContainer
            title="Number Memory"
            description="Memorize the number shown, then type it back. It gets longer every time."
            gameState={gameState}
            score={score}
            scoreLabel="Level Reached"
            onStart={handleStart}
            onRestart={() => { resetGame(); handleStart(); }}
        >
            <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">

                {phase === 'memorize' && gameState === 'playing' && (
                    <div className="text-center animate-in fade-in zoom-in spin-in-3">
                        <h2 className="text-8xl font-black tracking-widest text-primary">{number}</h2>
                        <div className="mt-8 h-2 w-64 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-pulse w-full origin-left" style={{ animationDuration: `${1000 + (level * 600)}ms`, animationName: 'shrinkWidth' }} />
                            {/* CSS animation needed for shrinkWidth, simplified for now: just a pulse */}
                        </div>
                    </div>
                )}

                {phase === 'input' && gameState === 'playing' && (
                    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center mb-4">
                            <h3 className="text-2xl font-bold">What was the number?</h3>
                        </div>
                        <Input
                            ref={inputRef}
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="text-center text-3xl tracking-widest h-16 font-mono"
                            placeholder="Type here..."
                            autoComplete="off"
                        />
                        <Button type="submit" size="lg" className="w-full">Submit</Button>
                    </form>
                )}

            </div>
        </GameContainer>
    );
}
