import type { Metadata } from 'next';
import { Crown } from 'lucide-react';
import { BackButton } from '@/components/back-button';

export const metadata: Metadata = {
  title: 'Wall of Champions',
  description: 'Imperium Online Chess Hub hall of fame and past champions',
};

export default function WallOfChampionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />

      <div className="mb-6 mt-4">
        <span className="inline-flex items-center rounded-full border border-[#c68a2e]/50 bg-[#c68a2e]/10 px-3 py-1 text-xs font-medium text-[#c68a2e] uppercase tracking-wider">
          Imperium Online Chess Hub
        </span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Crown className="h-8 w-8 text-[#c68a2e]" />
          Wall of Champions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Honouring the greatest players in Imperium Online Chess Hub history, season by season.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <Crown className="h-12 w-12 text-[#c68a2e]/40 mx-auto mb-4" />
        <p className="text-muted-foreground">
          No champions have been recorded yet.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Champions are announced by admins at the end of each season.
        </p>
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Champions are determined at the end of each season — Updated by admins
      </p>
    </div>
  );
}
