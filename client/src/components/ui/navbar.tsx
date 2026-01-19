'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trophy, ChartBar, User, LogOut } from 'lucide-react';

export function Navbar() {
    const router = useRouter();
    // Simple auth check for MVP visualization (would use context in real app)
    // We'll just show buttons and they might redirect if not authed
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    React.useEffect(() => {
        // Client-side check
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                const userData = JSON.parse(user);
                if (!userData.guest) setIsLoggedIn(true);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        router.push('/');
    };

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="font-bold text-xl flex items-center gap-2">
                    <ChartBar className="w-6 h-6 text-primary" />
                    RankMe
                </Link>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/leaderboard">
                            <Trophy className="mr-2 h-4 w-4 text-yellow-500" /> Leaderboard
                        </Link>
                    </Button>

                    {isLoggedIn ? (
                        <>
                            <Button variant="ghost" className="hidden sm:flex" disabled>
                                <User className="mr-2 h-4 w-4" /> Profile
                            </Button>
                            <Button variant="ghost" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </Button>
                        </>
                    ) : (
                        <Button asChild>
                            <Link href="/auth/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
