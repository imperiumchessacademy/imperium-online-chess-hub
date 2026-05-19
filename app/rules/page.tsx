import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Clock, Trophy, Users, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/back-button';
import { stackServerApp } from '@/stack';

export const metadata: Metadata = {
  title: 'Rules',
  description: 'Imperium Online Chess Hub club rules and guidelines',
};

const sections = [
  { icon: Users, title: 'General Conduct', rules: ['Treat all members with respect at all times.', 'No harassment, hate speech, or toxic behavior.', 'Keep discussions chess-related and constructive.', 'Support fellow members in their chess journey.'] },
  { icon: Trophy, title: 'Premiership Rules', rules: ['Points are earned from tournament placements.', 'Top 4 finishers in daily tournaments earn points.', 'Points accumulate throughout the season.', 'Season standings determine championship titles.', 'Inactivity for 60+ days may affect standing.'] },
  { icon: Clock, title: 'Cage Match Rules', rules: ['Pairings are selected weekly from top 20 players.', 'Each match consists of 10 games at 3+0 time control.', 'If tied after 10 games, Armageddon decides the winner.', 'Players must complete matches within the designated week.', 'Failure to play forfeits the match to the opponent.'] },
  { icon: CheckCircle, title: 'Point System', rules: ['Tournament points vary by placement and participation.', 'Cage Match win: 3 points. Draw: 1 point each.', 'Bonus points for consecutive tournament wins.', 'All points contribute to season standings.'] },
  { icon: Shield, title: 'Fair Play', rules: ['No engine assistance or computer help during games.', 'No sandbagging or intentional rating manipulation.', 'Report suspicious activity to admins immediately.', 'Cheating results in immediate and permanent ban.'] },
  { icon: AlertTriangle, title: 'Violations', rules: ['First offense: Warning from admin.', 'Second offense: Temporary suspension.', 'Third offense: Permanent ban from club.', 'Severe violations may result in immediate ban.'] },
];

export default async function RulesPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view the rules.</p>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3"><BookOpen className="h-8 w-8 text-[#c68a2e]" /> Club Rules & Guidelines</h1>
        <p className="mt-2 text-muted-foreground">These rules apply to all members of Imperium Online Chess Hub. Please read carefully.</p>
      </div>
      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c68a2e]/10"><Icon className="h-5 w-5 text-[#c68a2e]" /></div>
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c68a2e]/20 text-xs font-bold text-[#c68a2e]">{i + 1}</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">Last reviewed: May 2026 - Questions? Contact an admin.</p>
    </div>
  );
}
