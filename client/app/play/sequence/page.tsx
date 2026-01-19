'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameContainer } from '@/components/game/GameContainer';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { apiRequest } from '@/lib/api';

export default function SequenceMemoryGame() {
    const { gameState, score, setScore, startGame, endGame, resetGame } = useGameEngine();
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [activeTile, setActiveTile] = useState<number | null>(null);
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const startNewGame = () => {
        startGame();
        setSequence([]);
        setUserSequence([]);
        nextRound([]);
    };

    const nextRound = async (currentSeq: number[]) => {
        setIsInputDisabled(true);
        const nextNum = Math.floor(Math.random() * 9);
        const newSeq = [...currentSeq, nextNum];
        setSequence(newSeq);
        setUserSequence([]);

        // Play sequence
        for (let i = 0; i < newSeq.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setActiveTile(newSeq[i]);
            await new Promise(r => setTimeout(r, 500));
            setActiveTile(null);
        }
        setIsInputDisabled(false);
    };

    const handleTileClick = (index: number) => {
        if (isInputDisabled) return;

        // Flash on click
        setActiveTile(index);
        setTimeout(() => setActiveTile(null), 200);

        const newUserSeq = [...userSequence, index];
        setUserSequence(newUserSeq);

        // Check correctness
        const currentIndex = newUserSeq.length - 1;
        if (newUserSeq[currentIndex] !== sequence[currentIndex]) {
            handleGameOver();
            return;
        }

        // Check if level complete
        if (newUserSeq.length === sequence.length) {
            setScore(s => s + 1);
            setTimeout(() => nextRound(sequence), 1000);
        }
    };

    const handleGameOver = () => {
        endGame();
        submitScore(score);
    };

    const submitScore = async (finalScore: number) => {
        try {
            await apiRequest('/benchmarks', {
                method: 'POST',
                body: JSON.stringify({
                    category: 'SEQUENCE_MEMORY',
                    score: finalScore,
                    rawStats: { level: finalScore }
                })
            });
        } catch (err) { console.error(err); }
    };

    return (
        <GameContainer
            title="Sequence Memory"
            description="Memorize the pattern."
            gameState={gameState}
            score={score}
            onStart={startNewGame}
            onReset={resetGame}
            scoreLabel="Level"
            unit=""
        >
            <div className="grid grid-cols-3 gap-4 w-[300px] h-[300px]">
                {[...Array(9)].map((_, i) => (
                    <div
                        key={i}
                        onClick={() => handleTileClick(i)}
                        className={`rounded-lg transition-all duration-100 ${activeTile === i
                                ? 'bg-white shadow-[0_0_20px_white]'
                                : 'bg-primary/20 hover:bg-primary/30'
                            } cursor-pointer`}
                    />
                ))}
            </div>
        </GameContainer>
    );
}
