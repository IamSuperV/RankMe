'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await apiRequest<{ token: string; user: any }>('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/');
        } catch (error) {
            alert("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Join RankMe to track your progress</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Register'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Login</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
