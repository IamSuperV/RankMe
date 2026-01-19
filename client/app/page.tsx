import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Zap, Brain, Crosshair, Hash, MousePointer2 } from "lucide-react";

export default function Home() {
  const games = [
    {
      id: "reaction",
      name: "Reaction Time",
      description: "Test your visual reflexes.",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      href: "/play/reaction",
    },
    {
      id: "sequence",
      name: "Sequence Memory",
      description: "Remember the pattern.",
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      href: "/play/sequence",
    },
    {
      id: "aim",
      name: "Aim Trainer",
      description: "Hit targets quickly.",
      icon: <Crosshair className="h-8 w-8 text-red-500" />,
      href: "/play/aim",
    },
    {
      id: "number-memory",
      name: "Number Memory",
      description: "Remember the longest number.",
      icon: <Hash className="h-8 w-8 text-blue-500" />,
      href: "/play/number-memory",
    },
    {
      id: "chimp",
      name: "Chimp Test",
      description: "Are you smarter than a chimpanzee?",
      icon: <MousePointer2 className="h-8 w-8 text-green-500" />,
      href: "/play/chimp",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <section className="flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Rank<span className="text-primary">Me</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Measure your cognitive abilities with professional benchmarks.
            Compete globally or challenge friends in private rooms.
          </p>
        </div>
        <div className="flex space-x-4">
          <Button size="lg" asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Benchmarks</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Card key={game.id} className="hover:bg-muted/50 transition-colors cursor-pointer group">
              <Link href={game.href} className="flex flex-col h-full">
                <CardHeader>
                  <div className="mb-4">{game.icon}</div>
                  <CardTitle className="group-hover:text-primary transition-colors">{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button variant="secondary" className="w-full">Play Now</Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        RankMe &copy; 2026 - Human Benchmarking Platform
      </footer>
    </div>
  );
}
