import { Metadata } from 'next';
import Link from 'next/link';
import { Swords, Calendar, Trophy, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayerAvatar } from '@/components/player-avatar';
import { BackButton } from '@/components/back-button';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { stackServerApp } from '@/stack';

export const metadata: Metadata = {
  title: 'Cage Match',
  description: 'Weekly cage match pairings from the top 20 standings.',
};

export const revalidate = 60;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default async function CageMatchPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view cage match.</p>
            <Link href="/handler/sign-in">
              <Button className="bg-[#c68a2e] text-black hover:bg-[#d4a04a]">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: allMatches } = await supabaseAdmin
    .from('cage_matches')
    .select(`*, player1:player1_id(id, username, points), player2:player2_id(id, username, points), winner:winner_id(id, username)`)
    .order('match_day', { ascending: false });

  const matches = allMatches ?? [];
  const currentMatch = matches.find((m) => m.status === 'upcoming') ?? matches[0];
  const recentMatches = matches.filter((m) => m.status === 'completed').slice(0, 5);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
          <Swords className="h-8 w-8 text-[#c68a2e]" /> Cage Match Pairing
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Weekly random duel drawn from the top 20 standings.</p>
      </div>

      <Card className="border-border bg-card mb-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><Swords className="h-5 w-5 text-[#c68a2e]" /> Format Rules</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            {['Pair is drawn from the current top 20.', 'Pair is published on Thursday after tournament updates.', 'Friday match format is 10 blitz games at 3+0.', 'If tied after 10 games, winner is decided by Armageddon.'].map((rule) => (
              <li key={rule} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />{rule}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {currentMatch ? (
        <Card className="border-[#c68a2e]/50 bg-card mb-8 shadow-[0_0_20px_rgba(198,138,46,0.1)]">
          <CardHeader>
            <div className="inline-flex items-center rounded-full border border-[#c68a2e]/30 bg-[#c68a2e]/10 px-3 py-1 w-fit">
              <span className="text-xs font-semibold text-[#c68a2e] uppercase tracking-wider">This Cycle Pair</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Match day: {formatDate(currentMatch.match_day)}</p>
            <p className="text-sm text-muted-foreground">Format: <span className="text-foreground font-medium">{currentMatch.format}</span></p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 rounded-lg bg-secondary/50 p-6">
              {currentMatch.player1 ? (
                <Link href={`/players/${currentMatch.player1.id}`} className="flex flex-col items-center gap-3 text-center hover:text-[#c68a2e] transition-colors">
                  <PlayerAvatar username={currentMatch.player1.username} size="xl" />
                  <div><p className="font-semibold text-foreground">{currentMatch.player1.username}</p><p className="text-xs text-muted-foreground">{currentMatch.player1.points} pts</p></div>
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-3"><div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">?</div><p className="text-muted-foreground">TBD</p></div>
              )}
              <span className="text-3xl font-bold text-[#c68a2e] drop-shadow-[0_0_10px_rgba(198,138,46,0.5)]">VS</span>
              {currentMatch.player2 ? (
                <Link href={`/players/${currentMatch.player2.id}`} className="flex flex-col items-center gap-3 text-center hover:text-[#c68a2e] transition-colors">
                  <PlayerAvatar username={currentMatch.player2.username} size="xl" />
                  <div><p className="font-semibold text-foreground">{currentMatch.player2.username}</p><p className="text-xs text-muted-foreground">{currentMatch.player2.points} pts</p></div>
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-3"><div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">?</div><p className="text-muted-foreground">TBD</p></div>
              )}
            </div>
            {currentMatch.status === 'completed' && currentMatch.winner && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#c68a2e]/10 p-3 border border-[#c68a2e]/30">
                <Trophy className="h-4 w-4 text-[#c68a2e]" />
                <span className="font-medium text-[#c68a2e]">Winner: {currentMatch.winner.username}{currentMatch.score && ` (${currentMatch.score})`}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card mb-8"><CardContent className="p-8 text-center text-muted-foreground">No cage match data available yet. Check back after the admin posts the weekly pairing.</CardContent></Card>
      )}

      {recentMatches.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-[#c68a2e]" /> Recent Pairs</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMatches.map((match: any) => (
                <div key={match.id} className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{match.player1?.username ?? 'TBD'}</span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="font-medium text-foreground">{match.player2?.username ?? 'TBD'}</span>
                    </div>
                    {match.winner && (
                      <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-[#c68a2e]" /><span className="text-sm text-[#c68a2e] font-medium">{match.winner.username}{match.score ? ` (${match.score})` : ''}</span></div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(match.match_day)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
