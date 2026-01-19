'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Trophy, Users, Zap, Brain, Crosshair } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();
    const [roomCode, setRoomCode] = useState('');
    const [username, setUsername] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomCode.length > 0) {
            // Todo: Validate / Guest Auth flow first?
            // For MVP: Just go to room page, it handles auth/guest creation if missing
            router.push(`/room/${roomCode}`);
        }
    };

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            // In a real app, we'd call API to create room here and get the code
            // For now, we'll simulate or rely on the Room Page to create it if it doesn't exist?
            // Actually, better to explicitly create.
            // Let's rely on a utility helper we'll build next, or just fetch directly.

            // Quick temp logic: Auto-generate a guest user if needed, then create room.
            // Since we don't have the auth token in local storage handy in this component yet (need a hook),
            // we might redirect to a "create-room" intermediate page or just handle it.

            // Simpler MVP: Redirect to a special 'new' route or handle in Room page?
            // Let's try to call the API directly if we can, or just redirect to a random code and let the room page handle "If not exists, create?"
            // The requirements said "Anyone can create a room instantly".
            // Let's redirect to `room/new` which handles the logic.
            router.push('/room/new');
        } catch (error) {
            console.error("Failed to create room", error);
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        RankMe
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        The Human Benchmarking Platform. <br />
                        Compare your reaction time, memory, and focus with friends.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md mt-8">
                    <Card className="hover:border-primary transition-colors cursor-pointer group" onClick={handleCreate}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2 group-hover:text-primary transition-colors">
                                <Users className="w-6 h-6" /> Create Room
                            </CardTitle>
                            <CardDescription>Start a private leaderboard for your group.</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Trophy className="w-6 h-6" /> Join Room
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleJoin} className="flex gap-2">
                                <Input
                                    placeholder="Enter Code"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    className="font-mono uppercase text-center"
                                    maxLength={6}
                                />
                                <Button type="submit" size="icon" disabled={!roomCode}>
                                    →
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Feature Preview */}
            <section className="py-20 bg-secondary/20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Benchmark Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { icon: Zap, label: "Reaction", href: "/play/reaction" },
                            { icon: Brain, label: "Sequence", href: "/play/sequence" },
                            { icon: Crosshair, label: "Aim", href: "/play/aim" },
                            { icon: Trophy, label: "Number", href: "/play/number-memory" },
                            { icon: Users, label: "Chimp", href: "/play/chimp" },
                        ].map((item, i) => (
                            <Link href={item.href} key={i} className="group">
                                <Card className="h-full hover:bg-primary/5 transition-colors border-dashed hover:border-solid">
                                    <CardContent className="flex flex-col items-center justify-center h-full p-6 space-y-4">
                                        <item.icon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-semibold">{item.label}</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-6 text-center text-sm text-muted-foreground">
                RankMe &copy; 2026
            </footer>
        </div>
    );
}
