'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PlayerAvatar } from '@/components/player-avatar';

interface Player {
  id: string;
  username: string;
  rank: number;
  points: number;
  played: number;
  mpi: number;
  lichess_rating: number;
}

export function PlayersGrid({ players }: { players: Player[] }) {
  const [search, setSearch] = useState('');

  const filteredPlayers = players.filter((player) =>
    player.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Player Cards Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPlayers.map((player) => (
          <Link key={player.id} href={`/players/${player.id}`}>
            <Card className="border-border bg-card transition-all hover:border-[#c68a2e]/50 hover:scale-[1.02]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
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

                  {/* Avatar */}
                  <PlayerAvatar username={player.username} size="md" />
                </div>

                {/* Info */}
                <div className="mt-3">
                  <h3 className="truncate font-semibold text-foreground">{player.username}</h3>
                  <p className="text-lg font-bold text-[#c68a2e]">{player.points} pts</p>
                </div>

                {/* Stats */}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Played: {player.played ?? '-'}</span>
                  <span>MPI: {player.mpi ?? '-'}</span>
                </div>
                {player.lichess_rating && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lichess: {player.lichess_rating}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {search ? 'No players found matching your search.' : 'No players available.'}
        </div>
      )}
    </>
  );
}
