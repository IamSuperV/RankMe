'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await apiRequest<{ token: string; user: any }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/');
        } catch (error) {
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Login to access your history</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
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
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            No account? <Link href="/auth/register" className="text-primary hover:underline">Register</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
