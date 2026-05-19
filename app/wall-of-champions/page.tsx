import type { Metadata } from 'next';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/back-button';
import { stackServerApp } from '@/stack';

export const metadata: Metadata = {
  title: 'Wall of Champions',
  description: 'Imperium Online Chess Hub hall of fame and past champions',
};

export default async function WallOfChampionsPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view the Wall of Champions.</p>
            <Link href="/handler/sign-in">
              <Button className="bg-[#c68a2e] text-black hover:bg-[#d4a04a]">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />
      <div className="mb-6 mt-4">
        <span className="inline-flex items-center rounded-full border border-[#c68a2e]/50 bg-[#c68a2e]/10 px-3 py-1 text-xs font-medium text-[#c68a2e] uppercase tracking-wider">Imperium Online Chess Hub</span>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3"><Crown className="h-8 w-8 text-[#c68a2e]" /> Wall of Champions</h1>
        <p className="mt-2 text-muted-foreground">Honouring the greatest players in Imperium Online Chess Hub history, season by season.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <Crown className="h-12 w-12 text-[#c68a2e]/40 mx-auto mb-4" />
        <p className="text-muted-foreground">No champions have been recorded yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Champions are announced by admins at the end of each season.</p>
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">Champions are determined at the end of each season — Updated by admins</p>
    </div>
  );
}
