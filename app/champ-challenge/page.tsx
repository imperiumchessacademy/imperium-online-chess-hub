import { Metadata } from 'next';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Champ Challenge',
  description: 'Daily tournaments and championship challenges at Imperium Online Chess Hub.',
};

export const revalidate = 60;

export default function ChampChallengePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center rounded-full border border-[#c68a2e]/30 bg-[#c68a2e]/10 px-4 py-1.5">
          <span className="text-sm font-semibold text-[#c68a2e]">IMPERIUM ONLINE CHESS HUB</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
          <Trophy className="h-8 w-8 text-[#c68a2e]" />
          Champ Challenge
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Daily competitive battleground where players test skill, speed, and consistency.
        </p>
      </div>

      {/* About Section */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">About Champ Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Champ Challenge is our daily tournament system designed to reward consistent performance
            and competitive excellence.
          </p>
          <ul className="space-y-2">
            {[
              'Tournaments run daily on Lichess.',
              'Top 4 finishers earn premiership points.',
              'Points accumulate throughout the season.',
              'Consistency is rewarded over single wins.',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="font-semibold text-foreground">Join the Arena</p>
              <p className="text-sm text-muted-foreground mt-1">
                Find the daily tournament on our Lichess team page and join before it starts.
              </p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="font-semibold text-foreground">Compete</p>
              <p className="text-sm text-muted-foreground mt-1">
                Play as many games as you can during the tournament window.
              </p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="font-semibold text-foreground">Earn Points</p>
              <p className="text-sm text-muted-foreground mt-1">
                Top 4 finishers receive premiership points added to their season total.
              </p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="font-semibold text-foreground">Track Progress</p>
              <p className="text-sm text-muted-foreground mt-1">
                Check the Premiership page to see your ranking throughout the season.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <p className="text-center text-sm text-muted-foreground">
        Tournament results are automatically synced from Lichess. Check back after each tournament
        for updated standings.
      </p>
    </div>
  );
}
