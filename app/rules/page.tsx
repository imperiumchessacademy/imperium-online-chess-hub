import type { Metadata } from 'next';
import { Shield, Clock, Trophy, Users, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { BackButton } from '@/components/back-button';

export const metadata: Metadata = {
  title: 'Rules',
  description: 'Imperium Online Chess Hub club rules and guidelines',
};

const sections = [
  {
    icon: Users,
    title: 'General Conduct',
    rules: [
      'Treat all members with respect at all times.',
      'No harassment, hate speech, or toxic behavior.',
      'Keep discussions chess-related and constructive.',
      'Support fellow members in their chess journey.',
    ],
  },
  {
    icon: Trophy,
    title: 'Premiership Rules',
    rules: [
      'Points are earned from tournament placements.',
      'Top 4 finishers in daily tournaments earn points.',
      'Points accumulate throughout the season.',
      'Season standings determine championship titles.',
      'Inactivity for 60+ days may affect standing.',
    ],
  },
  {
    icon: Clock,
    title: 'Cage Match Rules',
    rules: [
      'Pairings are selected weekly from top 20 players.',
      'Each match consists of 10 games at 3+0 time control.',
      'If tied after 10 games, Armageddon decides the winner.',
      'Players must complete matches within the designated week.',
      'Failure to play forfeits the match to the opponent.',
    ],
  },
  {
    icon: CheckCircle,
    title: 'Point System',
    rules: [
      'Tournament points vary by placement and participation.',
      'Cage Match win: 3 points. Draw: 1 point each.',
      'Bonus points for consecutive tournament wins.',
      'All points contribute to season standings.',
    ],
  },
  {
    icon: Shield,
    title: 'Fair Play',
    rules: [
      'No engine assistance or computer help during games.',
      'No sandbagging or intentional rating manipulation.',
      'Report suspicious activity to admins immediately.',
      'Cheating results in immediate and permanent ban.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Violations',
    rules: [
      'First offense: Warning from admin.',
      'Second offense: Temporary suspension.',
      'Third offense: Permanent ban from club.',
      'Severe violations may result in immediate ban.',
    ],
  },
];

export default function RulesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-[#c68a2e]" />
          Club Rules & Guidelines
        </h1>
        <p className="mt-2 text-muted-foreground">
          These rules apply to all members of Imperium Online Chess Hub. Please read carefully.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c68a2e]/10">
                  <Icon className="h-5 w-5 text-[#c68a2e]" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c68a2e]/20 text-xs font-bold text-[#c68a2e]">
                      {i + 1}
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Last reviewed: May 2026 - Questions? Contact an admin.
      </p>
    </div>
  );
}
