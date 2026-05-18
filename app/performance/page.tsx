import type { Metadata } from 'next';
import Link from 'next/link';
import { LineChart, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/back-button';
import { FormIndicator } from '@/components/form-indicator';
import { stackServerApp } from '@/stack';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'My Performance',
  description: 'View your performance stats on Imperium Online Chess Hub.',
};

export const revalidate = 60;

// Badge level helper - backend instruction as per requirements
function getBadgeLevel(points: number): { level: string; label: string } {
  if (points >= 100) return { level: '4', label: 'Imperator' };
  if (points >= 50) return { level: '3', label: 'Master' };
  if (points >= 20) return { level: '2', label: 'Expert' };
  return { level: '1', label: 'Associate' };
}

function getNextMilestone(points: number): { target: number; label: string } {
  if (points >= 100) return { target: 100, label: 'Imperator (Max)' };
  if (points >= 50) return { target: 100, label: 'Imperator' };
  if (points >= 20) return { target: 50, label: 'Master' };
  return { target: 20, label: 'Expert' };
}

export default async function PerformancePage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <BackButton href="/" label="Home" />
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to view your performance</h2>
            <p className="text-muted-foreground mb-4">
              Track your progress, stats, and rankings.
            </p>
            <Link href="/handler/sign-in">
              <Button className="bg-[#c68a2e] text-black hover:bg-[#d4a04a]">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Try to find user's player data by email or display name
  const { data: playerData } = await supabaseAdmin
    .from('live_standings')
    .select('*')
    .or(`username.ilike.%${user.displayName ?? ''}%`)
    .limit(1)
    .single();

  const player = playerData;
  const points = player?.points ?? 0;
  const badge = getBadgeLevel(points);
  const nextMilestone = getNextMilestone(points);
  const progressPercent = Math.min((points / nextMilestone.target) * 100, 100);

  // Calculate win rate
  const wins = player?.wins ?? 0;
  const losses = player?.losses ?? 0;
  const draws = player?.draws ?? 0;
  const totalGames = wins + losses + draws;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />

      <div className="mb-8">
        <p className="text-lg text-muted-foreground">Welcome back,</p>
        <h1 className="text-3xl font-bold text-foreground">
          {user.displayName ?? player?.username ?? 'Member'}
        </h1>
      </div>

      {/* Rank Hero Card */}
      <Card className="border-[#c68a2e]/30 bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c68a2e] text-3xl font-bold text-black">
                #{player?.rank ?? '-'}
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg text-muted-foreground">
                You are ranked{' '}
                <span className="font-bold text-[#c68a2e]">#{player?.rank ?? '-'}</span> in the
                Imperium Premiership
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Progress to {nextMilestone.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {points} / {nextMilestone.target} pts
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-[#c68a2e] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 inline-flex items-center rounded-full bg-[#c68a2e]/10 px-3 py-1 text-sm">
                <span className="text-muted-foreground mr-2">Badge Level:</span>
                <span className="font-semibold text-[#c68a2e]">{badge.label}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Points</p>
            <p className="text-2xl font-bold text-[#c68a2e]">{points}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Games Played</p>
            <p className="text-2xl font-bold text-foreground">{player?.played ?? '-'}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold text-foreground">{winRate}%</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">MPI</p>
            <p className="text-2xl font-bold text-foreground">{player?.mpi ?? '-'}</p>
          </CardContent>
        </Card>
      </div>

      {/* W/D/L Bar */}
      {totalGames > 0 && (
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-6 w-full overflow-hidden rounded-full">
              {wins > 0 && (
                <div
                  className="bg-green-600 transition-all"
                  style={{ width: `${(wins / totalGames) * 100}%` }}
                />
              )}
              {draws > 0 && (
                <div
                  className="bg-yellow-600 transition-all"
                  style={{ width: `${(draws / totalGames) * 100}%` }}
                />
              )}
              {losses > 0 && (
                <div
                  className="bg-red-600 transition-all"
                  style={{ width: `${(losses / totalGames) * 100}%` }}
                />
              )}
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-600" />
                <span className="text-muted-foreground">Wins: {wins}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <span className="text-muted-foreground">Draws: {draws}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-600" />
                <span className="text-muted-foreground">Losses: {losses}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Strip */}
      {player?.form && player.form.length > 0 && (
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Current Form</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <FormIndicator form={player.form} />
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Last 5 results</p>
          </CardContent>
        </Card>
      )}

      {/* Lichess Link */}
      {player?.username && (
        <div className="text-center">
          <Link
            href={`https://lichess.org/@/${player.username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              View my Lichess profile
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {!player && (
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>
              Your account is not yet linked to a player profile. Contact an admin to connect your
              Lichess account.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
