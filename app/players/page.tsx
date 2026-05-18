import { Metadata } from 'next';
import { BackButton } from '@/components/back-button';
import { PlayersGrid } from '@/components/players-grid';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'Players',
  description: 'All registered Imperium Online Chess Hub members.',
};

export const revalidate = 60;

export default async function PlayersPage() {
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Players</h1>
        <p className="mt-2 text-lg text-muted-foreground">All registered Imperium members</p>
      </div>

      <PlayersGrid players={players ?? []} />

      {/* Total Count */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Total players: {players?.length ?? 0}
      </div>
    </div>
  );
}
