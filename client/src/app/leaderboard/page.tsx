'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
import { Trophy, Medal, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreEntry {
    id: string;
    value: number;
    user: { username: string; guest: boolean };
}

export default function LeaderboardPage() {
    // Categories could be dynamic, hardcoding for MVP
    const categories = ['REACTION_TIME', 'SEQUENCE_MEMORY', 'AIM_TRAINER', 'NUMBER_MEMORY', 'CHIMP_TEST'];
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            setLoading(true);
            try {
                const data = await apiRequest<ScoreEntry[]>(`/rankings/global?category=${activeCategory}`);
                setScores(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, [activeCategory]);

    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="text-center space-y-4">
                <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                    <Crown className="w-8 h-8 text-yellow-500" />
                    Global Rankings
                </h1>
                <p className="text-muted-foreground">See who is the best in the world.</p>
            </header>

            {/* Category Selector */}
            <div className="flex flex-wrap justify-center gap-2">
                {categories.map(cat => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? 'default' : 'outline'}
                        onClick={() => setActiveCategory(cat)}
                        className="capitalize"
                    >
                        {cat.replace('_', ' ').toLowerCase()}
                    </Button>
                ))}
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Top Players - {activeCategory.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading rankings...</div>
                    ) : scores.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No scores yet. Be the first!</div>
                    ) : (
                        <div className="space-y-2">
                            {scores.map((score, index) => (
                                <div key={score.id} className="flex items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                    <div className={cn(
                                        "w-8 h-8 flex items-center justify-center font-bold mr-4 rounded-full",
                                        index === 0 ? "bg-yellow-500/20 text-yellow-600" :
                                            index === 1 ? "bg-gray-400/20 text-gray-600" :
                                                index === 2 ? "bg-amber-600/20 text-amber-700" :
                                                    "text-muted-foreground"
                                    )}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">{score.user.username}</div>
                                        <div className="text-xs text-muted-foreground"> {score.user.guest ? 'Guest' : 'Verified'}</div>
                                    </div>
                                    <div className="font-mono font-bold text-lg">
                                        {score.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
