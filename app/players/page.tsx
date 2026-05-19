import { Metadata } from 'next';
import Link from 'next/link';
import { BackButton } from '@/components/back-button';
import { PlayersGrid } from '@/components/players-grid';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { stackServerApp } from '@/stack';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Players',
  description: 'All registered Imperium Online Chess Hub members.',
};

export const revalidate = 60;

export default async function PlayersPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view players.</p>
            <Link href="/handler/sign-in">
              <Button className="bg-[#c68a2e] text-black hover:bg-[#d4a04a]">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: players, error } = await supabaseAdmin
    .from('live_standings')
    .select('*')
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching players:', error);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Players</h1>
        <p className="mt-2 text-lg text-muted-foreground">All registered Imperium members</p>
      </div>
      <PlayersGrid players={players ?? []} />
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Total players: {players?.length ?? 0}
      </div>
    </div>
  );
}
