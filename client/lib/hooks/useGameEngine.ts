import { useState, useCallback, useRef } from 'react';

export type GameState = 'idle' | 'playing' | 'ended';

interface UseGameEngineProps {
    initialLives?: number;
    initialTime?: number;
}

export function useGameEngine(props: UseGameEngineProps = {}) {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(props.initialLives ?? 0);
    const [timeLeft, setTimeLeft] = useState(props.initialTime ?? 0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = useCallback(() => {
        setGameState('playing');
        setScore(0);
        setLives(props.initialLives ?? 0);
        setTimeLeft(props.initialTime ?? 0);
    }, [props.initialLives, props.initialTime]);

    const endGame = useCallback(() => {
        setGameState('ended');
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    const resetGame = useCallback(() => {
        setGameState('idle');
        setScore(0);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    return {
        gameState,
        setGameState,
        score,
        setScore,
        lives,
        setLives,
        timeLeft,
        setTimeLeft,
        startGame,
        endGame,
        resetGame,
    };
}
