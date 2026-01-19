'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
import { Trophy, Copy, Users } from 'lucide-react';

interface Room {
    id: string;
    code: string;
    name: string;
    members: { user: { username: string; id: string } }[];
}

export default function RoomPage() {
    const params = useParams(); // params.code might be string or string[]
    const code = Array.isArray(params.code) ? params.code[0] : params.code;

    const router = useRouter();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // In a real app, we'd check for a token here. 
        // If no token, maybe auto-login as guest first?
        // For MVP, we'll assume we might be logged in or handle auth redirect.
        // Actually, let's just try to fetch. If 401, we need to auth.

        // TEMPORARY: If we don't have token logic in frontend yet, we might fail here.
        // We need a way to store/retrieve token.
        // Let's assume we have a simple hook or local storage usage for now.

        const fetchRoom = async () => {
            try {
                // Check for token in localStorage manually for now until we have auth context
                const token = localStorage.getItem('token');
                if (!token) {
                    // Determine if we should create a guest user?
                    // For now, redirect to login/register? Or auto-create guest?
                    // Let's redirect to landing key "Join" logic which might do this.
                    // Or just creating guest here.

                    // Let's auto-create guest for smoother UX as per requirements
                    const guestRes = await fetch('http://localhost:5000/api/auth/guest', { method: 'POST' });
                    const guestData = await guestRes.json();
                    localStorage.setItem('token', guestData.token);
                    localStorage.setItem('user', JSON.stringify(guestData.user));
                }

                const currentToken = localStorage.getItem('token');

                // Join first (idempotent-ish in our backend logic?)
                // Actually join endpoint is POST /rooms/join/:code
                await apiRequest(`/rooms/join/${code}`, {
                    method: 'POST',
                    token: currentToken || undefined
                });

                // Then get details
                const data = await apiRequest<Room>(`/rooms/${code}`, {
                    token: currentToken || undefined
                });
                setRoom(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            fetchRoom();
        }
    }, [code]);

    const copyCode = () => {
        if (code) {
            navigator.clipboard.writeText(code);
            alert('Room code copied!');
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Room...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen">Error: {error}</div>;
    if (!room) return <div className="flex items-center justify-center min-h-screen">Room not found</div>;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center bg-card p-6 rounded-lg border shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold">{room.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2 cursor-pointer" onClick={copyCode}>
                        <span className="font-mono bg-secondary px-2 py-1 rounded text-foreground">{room.code}</span>
                        <Copy className="w-4 h-4 hover:text-primary" />
                    </div>
                </div>
                <div>
                    <Button variant="outline" onClick={() => router.push('/')}>Exit Room</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content - Leaderboard/Activities */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Select a game to see current room rankings.</p>
                            {/* We needs tabs for games here later. Placeholder for MVP */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button className="h-24 text-lg" variant="secondary" onClick={() => router.push('/play/reaction')}>
                                    Play Reaction Time
                                </Button>
                                <Button className="h-24 text-lg" variant="secondary" onClick={() => router.push('/play/sequence')}>
                                    Play Sequence Memory
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Members */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" /> Members ({room.members.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {room.members.map((m) => (
                                    <li key={m.user.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
                                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                                            {m.user.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="truncate">{m.user.username}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
