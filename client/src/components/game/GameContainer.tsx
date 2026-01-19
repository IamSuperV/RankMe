import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export type GameState = 'idle' | 'playing' | 'ended';

interface GameContainerProps {
    title: string;
    description: string;
    gameState: GameState;
    score: number | null;
    scoreLabel?: string;
    onStart: () => void;
    onRestart: () => void;
    children: React.ReactNode;
    className?: string; // For custom styling of the game area
}

export const GameContainer: React.FC<GameContainerProps> = ({
    title,
    description,
    gameState,
    score,
    scoreLabel = 'Score',
    onStart,
    onRestart,
    children,
    className,
}) => {
    return (
        <div className="container max-w-4xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            {/* Header - Always visible or maybe hide during play if immersive? Keeping it simple. */}
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground text-lg">{description}</p>
            </div>

            <div className={cn("w-full max-w-2xl aspect-video relative rounded-xl overflow-hidden border shadow-lg bg-card transition-all duration-300", className)}>

                {/* IDLE SCREEN */}
                {gameState === 'idle' && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-8 text-center animate-in fade-in zoom-in-95">
                        <div className="space-y-6 max-w-md">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold">Ready to test?</h2>
                                <p className="text-muted-foreground">Click start when you are ready. Good luck!</p>
                            </div>
                            <Button size="lg" onClick={onStart} className="w-full text-lg h-12">
                                Start Game
                            </Button>
                        </div>
                    </div>
                )}

                {/* END SCREEN */}
                {gameState === 'ended' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 p-8 text-center animate-in fade-in slide-in-from-bottom-5">
                        <div className="space-y-8 max-w-md w-full">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold">Results</h2>
                                <div className="py-8">
                                    <span className="text-6xl font-black text-primary">{score}</span>
                                    <p className="text-xl text-muted-foreground mt-2">{scoreLabel}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full">
                                <Button variant="outline" className="flex-1" asChild>
                                    <Link href="/">
                                        <Home className="mr-2 h-4 w-4" /> Home
                                    </Link>
                                </Button>
                                <Button onClick={onRestart} className="flex-1">
                                    <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                                </Button>
                            </div>
                            {/* TODO: Add Save Score Button / Leaderboard preview here later */}
                        </div>
                    </div>
                )}

                {/* GAME PLAY AREA */}
                <div className="w-full h-full relative">
                    {children}
                </div>

            </div>
        </div>
    );
};
