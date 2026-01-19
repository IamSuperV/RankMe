'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
import { cn } from '@/lib/utils'; // Assuming you have utils
import { Trophy } from 'lucide-react';

// Hardcode categories or fetch from backend enum
const CATEGORIES = [
    'REACTION_TIME',
    'SEQUENCE_MEMORY',
    'AIM_TRAINER',
    'NUMBER_MEMORY',
    'CHIMP_TEST'
];

interface LeaderboardEntry {
    id: string;
    score: number;
    rawStats: any;
    user: {
        username: string;
    };
    createdAt: string;
}

export default function LeaderboardPage() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const [scores, setScores] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const data = await apiRequest<LeaderboardEntry[]>(`/rankings/global?category=${activeCategory}`);
                setScores(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [activeCategory]);

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                <Trophy className="text-yellow-500" /> Global Leaderboard
            </h1>

            <div className="flex flex-wrap gap-2 justify-center mb-8">
                {CATEGORIES.map(cat => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        onClick={() => setActiveCategory(cat)}
                        className="text-xs sm:text-sm"
                    >
                        {cat.replace('_', ' ')}
                    </Button>
                ))}
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-6 py-3">Rank</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Score</th>
                                    <th className="px-6 py-3 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
                                ) : scores.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-8">No scores yet. Be the first!</td></tr>
                                ) : (
                                    scores.map((entry, index) => (
                                        <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4 font-bold text-muted-foreground">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium">{entry.user.username}</td>
                                            <td className="px-6 py-4 font-bold text-primary">{entry.score}</td>
                                            <td className="px-6 py-4 text-right text-muted-foreground">
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
