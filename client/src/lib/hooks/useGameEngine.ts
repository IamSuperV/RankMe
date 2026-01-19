import { useState, useCallback } from 'react';

export type GameState = 'idle' | 'playing' | 'ended';

interface UseGameEngineReturn {
    gameState: GameState;
    score: number | null;
    startGame: () => void;
    endGame: (finalScore: number) => void;
    resetGame: () => void;
    setGameState: (state: GameState) => void;
}

export function useGameEngine(): UseGameEngineReturn {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [score, setScore] = useState<number | null>(null);

    const startGame = useCallback(() => {
        setScore(null);
        setGameState('playing');
    }, []);

    const endGame = useCallback((finalScore: number) => {
        setScore(finalScore);
        setGameState('ended');
    }, []);

    const resetGame = useCallback(() => {
        setScore(null);
        setGameState('idle');
    }, []);

    return {
        gameState,
        score,
        startGame,
        endGame,
        resetGame,
        setGameState
    };
}
