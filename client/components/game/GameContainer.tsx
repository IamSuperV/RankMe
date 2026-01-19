import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Play } from 'lucide-react';
import { GameState } from '@/lib/hooks/useGameEngine';

interface GameContainerProps {
    title: string;
    description: string;
    gameState: GameState;
    score: number;
    onStart: () => void;
    onReset: () => void; // Usually goes to idle
    onRestart?: () => void; // Immediate restart
    children: React.ReactNode;
    scoreLabel?: string;
    unit?: string;
}

export function GameContainer({
    title,
    description,
    gameState,
    score,
    onStart,
    onReset,
    children,
    scoreLabel = 'Score',
    unit = '',
}: GameContainerProps) {
    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>

                <CardContent className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-secondary/10 relative overflow-hidden">
                    {gameState === 'idle' && (
                        <div className="text-center space-y-4">
                            <div className="text-6xl mb-4">🎮</div>
                            <Button size="lg" onClick={onStart} className="text-xl px-8 py-6">
                                <Play className="mr-2 h-6 w-6" /> Start Game
                            </Button>
                        </div>
                    )}

                    {gameState === 'playing' && (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            {children}
                        </div>
                    )}

                    {gameState === 'ended' && (
                        <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
                            <h2 className="text-4xl font-bold">Game Over</h2>
                            <div className="space-y-2">
                                <p className="text-muted-foreground uppercase tracking-widest text-sm">{scoreLabel}</p>
                                <p className="text-6xl font-black text-primary">
                                    {score}<span className="text-2xl text-muted-foreground ml-1">{unit}</span>
                                </p>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <Button variant="outline" onClick={onReset}>
                                    Menu
                                </Button>
                                <Button onClick={onStart}>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>

                {gameState === 'playing' && (
                    <CardFooter className="justify-between border-t bg-muted/20 p-4">
                        <span className="font-mono text-sm text-muted-foreground">Playing...</span>
                        <span className="font-mono font-bold text-xl">
                            {scoreLabel}: {score} {unit}
                        </span>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
