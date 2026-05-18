import { Metadata } from 'next';
import Link from 'next/link';
import { Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlayerAvatar } from '@/components/player-avatar';
import { FormIndicator } from '@/components/form-indicator';
import { BackButton } from '@/components/back-button';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'Premiership',
  description: 'Full league standings and player rankings for the Chess Champions League.',
};

export const revalidate = 60;

export default async function PremiershipsPage() {
  const { data: players, error } = await supabaseAdmin
    .from('live_standings')
    .select('*')
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching players:', error);
  }

  const sortedPlayers = players ?? [];

  const lastUpdated = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          2026 CHESS CHAMPIONS LEAGUE
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Premiership league table</p>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Top 10
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Top 10 (WA)
        </Button>
        <Button variant="outline" size="sm" className="gap-2" disabled title="Coming soon">
          <Share2 className="h-4 w-4" />
          Share Image
        </Button>
      </div>

      {/* League Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-center">Played</TableHead>
              <TableHead className="text-center">MPI</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-center">Form</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.length > 0 ? (
              sortedPlayers.map((player: any) => (
                <TableRow
                  key={player.id}
                  className={`border-border transition-colors hover:border-l-2 hover:border-l-[#c68a2e] ${
                    player.rank <= 3 ? 'bg-[#c68a2e]/5' : ''
                  }`}
                >
                  <TableCell>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        player.rank === 1
                          ? 'bg-[#c68a2e] text-black'
                          : player.rank === 2
                            ? 'bg-gray-400 text-black'
                            : player.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {player.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/players/${player.id}`}
                      className="flex items-center gap-3 hover:text-[#c68a2e] transition-colors"
                    >
                      <PlayerAvatar username={player.username} size="sm" />
                      <span className="font-medium">{player.username}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {player.played ?? '-'}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {player.mpi ?? '-'}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {player.lichess_rating ?? '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <FormIndicator form={player.form ?? []} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-[#c68a2e]">
                    {player.points}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  No player data available yet. Connect your database to see standings.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Total Count */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Total players: {sortedPlayers.length}
      </div>
    </div>
  );
}
