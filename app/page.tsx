import Link from 'next/link';
import { ArrowRight, Users, Trophy, Swords, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlayerAvatar } from '@/components/player-avatar';
import { FormIndicator } from '@/components/form-indicator';
import { stackServerApp } from '@/stack';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const revalidate = 60;

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default async function HomePage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  // Fetch team stats from sync table (online count, member count)
  const { data: teamStats } = await supabaseAdmin
    .from('team_stats')
    .select('*')
    .eq('id', 'imperium')
    .maybeSingle();

  const activePlayers = teamStats?.online_count ?? 0;

  // Fetch top players from Supabase
  const { data: allPlayers } = await supabaseAdmin
    .from('live_standings')
    .select('*')
    .order('rank', { ascending: true });

  const players = allPlayers ?? [];
  const top12 = players.slice(0, 12);
  const top5 = players.slice(0, 5);
  const leader = players[0];

  // Fetch tournaments played count
  const { count: tournamentsPlayed } = await supabaseAdmin
    .from('tournaments')
    .select('*', { count: 'exact', head: true });

  // Fetch latest tournament
  const { data: latestTournaments } = await supabaseAdmin
    .from('tournaments')
    .select('*')
    .order('played_at', { ascending: false })
    .limit(1);

  const latestTournament = latestTournaments?.[0];

  // Fetch current cage match
  const { data: cageMatches } = await supabaseAdmin
    .from('cage_matches')
    .select(`
      *,
      player1:player1_id(id, username, points),
      player2:player2_id(id, username, points)
    `)
    .order('match_day', { ascending: false })
    .limit(1);

  const currentCageMatch = cageMatches?.[0];

  // Movement highlights
  const movementHighlights = players
    .filter((p: any) => p.movement && p.movement !== 0)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Hero Section */}
      <section className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-[#c68a2e]/30 bg-[#c68a2e]/10 px-4 py-1.5">
          <span className="text-sm font-semibold text-[#c68a2e]">IMPERIUM ONLINE CHESS HUB</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
          Track live league standings in real time.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty">
          Follow premiership movement, tournament outcomes, and player performance from one place.
          Sign in to access full member and admin workflows.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {!user ? (
            <Link href="/handler/sign-in">
              <Button size="lg" className="bg-[#c68a2e] text-black hover:bg-[#d4a04a]">
                Sign In
              </Button>
            </Link>
          ) : (
            <Link href="/premiership">
              <Button size="lg" className="bg-[#c68a2e] text-black hover:bg-[#d4a04a]">
                Open Premiership
              </Button>
            </Link>
          )}
          <Link href="/about">
            <Button size="lg" variant="outline">About Imperium</Button>
          </Link>
          <Link href="/premiership">
            <Button size="lg" variant="outline" className="gap-2">
              View Full Standings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Row */}
      <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4 sm:p-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#c68a2e]/10">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#c68a2e]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active players</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{activePlayers || '-'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4 sm:p-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#c68a2e]/10">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-[#c68a2e]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Tournaments played</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{tournamentsPlayed ?? '-'}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left Column */}
        <div className="space-y-6">

          {/* Live Standings Leader Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Live Standings
                {leader && (
                  <span className="text-xs font-normal text-muted-foreground">
                    Updated {formatShortDate(new Date().toISOString())}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leader ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c68a2e] text-sm font-bold text-black">
                      1
                    </div>
                    <PlayerAvatar username={leader.username} size="lg" />
                    <div className="flex-1">
                      <Link href={`/players/${leader.id}`} className="font-semibold text-foreground hover:text-[#c68a2e]">
                        {leader.username}
                      </Link>
                      <p className="text-sm text-muted-foreground">Current league leader</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Form</p>
                      <FormIndicator form={leader.form ?? []} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Events</p>
                      <p className="text-lg font-semibold text-foreground">{leader.played ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MPI</p>
                      <p className="text-lg font-semibold text-foreground">{leader.mpi ?? '-'}</p>
                    </div>
                  </div>

                  {/* Top 5 Mini List */}
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-3">TOP 5</p>
                    <div className="space-y-2">
                      {top5.map((player: any, index: number) => (
                        <Link
                          key={player.id}
                          href={`/players/${player.id}`}
                          className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-secondary/50"
                        >
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                              index === 0
                                ? 'bg-[#c68a2e] text-black'
                                : index === 1
                                  ? 'bg-gray-400 text-black'
                                  : index === 2
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-secondary text-foreground'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="flex-1 text-sm font-medium text-foreground truncate">
                            {player.username}
                          </span>
                          <span className="text-sm font-bold text-[#c68a2e]">{player.points}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No standings data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Latest Tournament */}
          {latestTournament && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Latest Tournament</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={latestTournament.lichess_id ? `https://lichess.org/tournament/${latestTournament.lichess_id}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/60"
                >
                  <p className="font-semibold text-foreground">{latestTournament.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(latestTournament.played_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {latestTournament.participant_count && (
                    <p className="text-sm text-muted-foreground">{latestTournament.participant_count} participants</p>
                  )}
                  {latestTournament.time_control && (
                    <p className="text-sm text-muted-foreground">Time control: {latestTournament.time_control}</p>
                  )}
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Cage Match */}
          {currentCageMatch && (
            <Card className="border-[#c68a2e]/30 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Swords className="h-5 w-5 text-[#c68a2e]" />
                  Cage Match Pairing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="inline-flex items-center rounded-full border border-[#c68a2e]/30 bg-[#c68a2e]/10 px-3 py-1 mb-3">
                  <span className="text-xs font-semibold text-[#c68a2e]">{currentCageMatch.title ?? 'Cage Match'}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(currentCageMatch.match_day).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                  })}{' '}
                  | {currentCageMatch.format}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlayerAvatar username={currentCageMatch.player1?.username ?? 'TBD'} size="sm" />
                    <span className="font-medium text-foreground">
                      {currentCageMatch.player1?.username ?? 'TBD'}
                    </span>
                  </div>
                  <span className="text-[#c68a2e] font-bold">vs</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {currentCageMatch.player2?.username ?? 'TBD'}
                    </span>
                    <PlayerAvatar username={currentCageMatch.player2?.username ?? 'TBD'} size="sm" />
                  </div>
                </div>
                <Link href="/cage-match">
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Movement Highlights */}
          {movementHighlights.length > 0 && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Movement Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {movementHighlights.map((player: any) => (
                    <Link
                      key={player.id}
                      href={`/players/${player.id}`}
                      className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-secondary/50"
                    >
                      <PlayerAvatar username={player.username} size="sm" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{player.username}</p>
                        <p className="text-xs text-muted-foreground">Rank #{player.rank}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm font-bold ${
                          player.movement > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {player.movement > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {Math.abs(player.movement)}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Top 12 Table */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Top 12 Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-16">Pos</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Played</TableHead>
                    <TableHead className="text-right">MPI</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {top12.length > 0 ? (
                    top12.map((player: any) => (
                      <TableRow key={player.id} className="border-border">
                        <TableCell>
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                              player.rank === 1
                                ? 'bg-[#c68a2e] text-black'
                                : player.rank === 2
                                  ? 'bg-gray-400 text-black'
                                  : player.rank === 3
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-secondary text-foreground'
                            }`}
                          >
                            {player.rank}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/players/${player.id}`}
                            className="flex items-center gap-2 hover:text-[#c68a2e]"
                          >
                            <PlayerAvatar username={player.username} size="sm" />
                            <span className="font-medium">{player.username}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {player.played ?? '-'}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {player.mpi ?? '-'}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#c68a2e]">
                          {player.points}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No player data available yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="p-4">
                <Link href="/premiership">
                  <Button variant="outline" className="w-full">
                    View Full Standings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}