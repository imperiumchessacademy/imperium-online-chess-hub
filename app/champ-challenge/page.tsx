import { Metadata } from 'next';
import Link from 'next/link';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, User } from 'lucide-react';
import { stackServerApp } from '@/stack';

export const metadata: Metadata = {
  title: 'Champ Challenge',
  description: 'Daily tournaments and championship challenges at Imperium Online Chess Hub.',
};

export const revalidate = 60;

export default async function ChampChallengePage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view champ challenge.</p>
            <Link href="/handler/sign-in">
              <Button className="bg-[#c68a2e] text-black hover:bg-[#d4a04a]">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center rounded-full border border-[#c68a2e]/30 bg-[#c68a2e]/10 px-4 py-1.5">
          <span className="text-sm font-semibold text-[#c68a2e]">IMPERIUM ONLINE CHESS HUB</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
          <Trophy className="h-8 w-8 text-[#c68a2e]" /> Champ Challenge
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Daily competitive battleground where players test skill, speed, and consistency.</p>
      </div>

      <Card className="border-border bg-card mb-6">
        <CardHeader><CardTitle className="text-lg">About Champ Challenge</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Champ Challenge is our daily tournament system designed to reward consistent performance and competitive excellence.</p>
          <ul className="space-y-2">
            {['Tournaments run daily on Lichess.', 'Top 4 finishers earn premiership points.', 'Points accumulate throughout the season.', 'Consistency is rewarded over single wins.'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border bg-card mb-6">
        <CardHeader><CardTitle className="text-lg">How It Works</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-secondary/50 p-4"><p className="font-semibold text-foreground">Join the Arena</p><p className="text-sm text-muted-foreground mt-1">Find the daily tournament on our Lichess team page and join before it starts.</p></div>
            <div className="rounded-lg bg-secondary/50 p-4"><p className="font-semibold text-foreground">Compete</p><p className="text-sm text-muted-foreground mt-1">Play as many games as you can during the tournament window.</p></div>
            <div className="rounded-lg bg-secondary/50 p-4"><p className="font-semibold text-foreground">Earn Points</p><p className="text-sm text-muted-foreground mt-1">Top 4 finishers receive premiership points added to their season total.</p></div>
            <div className="rounded-lg bg-secondary/50 p-4"><p className="font-semibold text-foreground">Track Progress</p><p className="text-sm text-muted-foreground mt-1">Check the Premiership page to see your ranking throughout the season.</p></div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">Tournament results are automatically synced from Lichess. Check back after each tournament for updated standings.</p>
    </div>
  );
}
