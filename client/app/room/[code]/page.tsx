'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { apiRequest } from '@/lib/api';
import { Copy, Users, Play } from 'lucide-react';

interface RoomMember {
    id: string;
    user: {
        username: string;
        id: string;
    };
    isAdmin: boolean;
}

interface RoomData {
    id: string;
    code: string;
    members: RoomMember[];
}

export default function RoomPage() {
    const { code } = useParams();
    const router = useRouter();
    const [room, setRoom] = useState<RoomData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const joinAndFetch = async () => {
            try {
                // Auto-join logic if not already a member would happen here or in a separate flow.
                // For simplicity, we assume joining endpoint adds or returns existing membership
                await apiRequest(`/rooms/${code}/join`, { method: 'POST' });
                const data = await apiRequest<RoomData>(`/rooms/${code}`);
                setRoom(data);
            } catch (error) {
                console.error("Failed to join room", error);
                // router.push('/'); // Redirect on fail?
            } finally {
                setLoading(false);
            }
        };

        if (code) joinAndFetch();
    }, [code]);

    const copyCode = () => {
        if (room?.code) navigator.clipboard.writeText(room.code);
    };

    if (loading) return <div className="flex justify-center p-20">Loading Room...</div>;
    if (!room) return <div className="flex justify-center p-20">Room not found</div>;

    return (
        <div className="container mx-auto p-4 py-8">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Room Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Room: <span className="text-primary tracking-wider">{room.code}</span></span>
                                <Button variant="outline" size="sm" onClick={copyCode}>
                                    <Copy className="h-4 w-4 mr-2" /> Copy Code
                                </Button>
                            </CardTitle>
                            <CardDescription>Share this code to invite friends.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold mb-4 flex items-center"><Users className="mr-2 h-4 w-4" /> Members ({room.members.length})</h3>
                            <div className="grid gap-2">
                                {room.members.map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                                        <span className={member.isAdmin ? "font-bold text-primary" : ""}>
                                            {member.user.username} {member.isAdmin && "(Host)"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">Ready</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Game History</CardTitle></CardHeader>
                        <CardContent className="text-muted-foreground italic text-sm">
                            No games played yet.
                        </CardContent>
                    </Card>
                </div>

                {/* Game Selector */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Launch Game</h3>
                    {['Reaction', 'Sequence', 'Aim', 'Number Memory', 'Chimp Test'].map(game => (
                        <Button key={game} variant="secondary" className="w-full justify-start h-12">
                            <Play className="mr-2 h-4 w-4" /> {game}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
