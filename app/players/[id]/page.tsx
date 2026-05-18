import { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerAvatar } from '@/components/player-avatar';
import { FormIndicator } from '@/components/form-indicator';
import { BackButton } from '@/components/back-button';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: player } = await supabaseAdmin
    .from('live_standings')
    .select('username')
    .eq('id', id)
    .single();

  return {
    title: player?.username ?? 'Player Profile',
    description: `View ${player?.username ?? 'player'}'s profile and stats on Imperium Online Chess Hub.`,
  };
}

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: player, error } = await supabaseAdmin
    .from('live_standings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !player) {
    notFound();
  }

  // Calculate win rate if we have the data
  const wins = player.wins ?? 0;
  const losses = player.losses ?? 0;
  const draws = player.draws ?? 0;
  const totalGames = wins + losses + draws;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/premiership" label="Back to Standings" />

      {/* Profile Header */}
      <Card className="border-border bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <PlayerAvatar username={player.username} size="xl" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{player.username}</h1>
                {player.rank <= 3 && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      player.rank === 1
                        ? 'bg-[#c68a2e] text-black'
                        : player.rank === 2
                          ? 'bg-gray-400 text-black'
                          : 'bg-amber-700 text-white'
                    }`}
                  >
                    #{player.rank}
                  </span>
                )}
              </div>

              {/* Stats Pills */}
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="rounded-full bg-[#c68a2e]/10 px-4 py-2 text-sm">
                  <span className="text-muted-foreground">Points: </span>
                  <span className="font-bold text-[#c68a2e]">{player.points}</span>
                </div>
                <div className="rounded-full bg-secondary px-4 py-2 text-sm">
                  <span className="text-muted-foreground">Rank: </span>
                  <span className="font-bold text-foreground">#{player.rank}</span>
                </div>
                {player.lichess_rating && (
                  <div className="rounded-full bg-secondary px-4 py-2 text-sm">
                    <span className="text-muted-foreground">Lichess: </span>
                    <span className="font-bold text-foreground">{player.lichess_rating}</span>
                  </div>
                )}
              </div>

              <Link
                href={`https://lichess.org/@/${player.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  View on Lichess
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Games Played</p>
            <p className="text-2xl font-bold text-foreground">{player.played ?? '-'}</p>
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
            <p className="text-2xl font-bold text-foreground">{player.mpi ?? '-'}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Current Form</p>
            <div className="flex justify-center mt-2">
              <FormIndicator form={player.form ?? []} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Record Card */}
      {totalGames > 0 && (
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Record</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Stacked Bar */}
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

      {/* Season Summary */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Season Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {player.username} has played {player.played ?? 0} events and accumulated{' '}
            {player.points} league points, currently ranked #{player.rank} on the premiership table.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
