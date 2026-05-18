import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/back-button';
import { Trophy, Eye, Users, Rocket, Info, Crown, Star, Shield, Sword } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Imperium Online Chess Hub - our mission, vision, and community.',
};

const badges = [
  {
    rank: 1,
    name: 'Associate',
    icon: Shield,
    color: 'text-slate-400',
    border: 'border-slate-400/30',
    bg: 'bg-slate-400/10',
  },
  {
    rank: 2,
    name: 'Expert',
    icon: Star,
    color: 'text-blue-400',
    border: 'border-blue-400/30',
    bg: 'bg-blue-400/10',
  },
  {
    rank: 3,
    name: 'Master',
    icon: Sword,
    color: 'text-[#c68a2e]',
    border: 'border-[#c68a2e]/30',
    bg: 'bg-[#c68a2e]/10',
  },
  {
    rank: 4,
    name: 'Imperator',
    icon: Crown,
    color: 'text-yellow-400',
    border: 'border-yellow-400/30',
    bg: 'bg-yellow-400/10',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton href="/" label="Home" />

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-[#c68a2e]/30 bg-[#c68a2e]/10 px-4 py-1.5">
          <span className="text-sm font-semibold text-[#c68a2e]">IMPERIUM ONLINE CHESS HUB</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          ♟️ About Imperium Online Chess Hub
        </h1>
      </div>

      {/* About the Club */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-[#c68a2e]" />
            About the Club
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Imperium Online Chess Hub is a competitive, community-driven chess movement dedicated
            to building strong, disciplined, and consistent players.
          </p>
          <p>
            The word &quot;Imperium&quot; represents strength and excellence. Our hub unites a
            brotherhood and sisterhood of strong players through discipline, respect, and
            competitive excellence.
          </p>
          <div className="rounded-lg bg-[#c68a2e]/10 p-4 border border-[#c68a2e]/20">
            <p className="font-semibold text-foreground">Our mission is simple</p>
            <p className="mt-1 text-[#c68a2e]">
              To sharpen individuals into champions until we become a community of masters.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vision */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#c68a2e]" />
            Our Vision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-muted-foreground">
            {[
              'Raise the standard of chess performance.',
              'Reward consistency, not just talent.',
              'Create structured competitive systems.',
              'Maintain accurate records and rankings.',
              'Build a transparent, self-sustaining chess community.',
              'Develop future Masters, GMs, and WGMs.',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground italic">
            Imperium is not just about playing games — it is about growth, discipline, and excellence.
          </p>
        </CardContent>
      </Card>

      {/* Competitive Structure */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#c68a2e]" />
            Our Competitive Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-muted-foreground">
          <p>Imperium runs structured competitions designed to reward performance:</p>

          <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
            <p className="font-semibold text-foreground">🏆 Champ Challenge (Daily Tournaments)</p>
            <p className="text-sm">
              Our daily competitive battleground where players test skill, speed, and consistency.
            </p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
            <p className="font-semibold text-foreground">🏆 Imperium Champions League</p>
            <p className="text-sm">An 8-month league system where:</p>
            <ul className="space-y-2 text-sm">
              {[
                'Top 4 daily finishers earn points.',
                'Rankings are tracked automatically.',
                'The most consistent players rise to the top.',
                'Top 10 players receive cash prizes.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Badge System */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#c68a2e]" />
            Badge System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To reflect performance levels, Imperium introduces a Badge ranking system:
          </p>
          <div className="space-y-2">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className={`flex items-center gap-3 rounded-lg border ${badge.border} ${badge.bg} px-4 py-3`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${badge.color}`} />
                  <span className="text-sm font-medium text-foreground">
                    {badge.rank}. {badge.name}
                    {badge.rank === 4 && ' 👑'}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            Your badge is determined by your accumulated league points.
          </p>
          <p className="text-sm text-muted-foreground">
            This system encourages improvement and recognises progression.
          </p>
        </CardContent>
      </Card>

      {/* Wall of Champions */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-[#c68a2e]" />
            Wall of Champions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Our Wall of Champions honours players who win Lichess tournaments.</p>
          <ul className="space-y-2">
            {[
              'Every tournament victory counts.',
              'Consecutive-day champions earn special recognition.',
              'Monthly title milestones receive cash rewards.',
              'Consistency and dominance are celebrated.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Transparency & Self-Sponsorship */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-[#c68a2e]" />
            Transparency &amp; Self-Sponsorship
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Imperium is a self-sponsored hub.</p>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Members contribute to support:</p>
            <ul className="space-y-2 text-sm">
              {['Prize payouts.', 'Special tournaments.', 'Team battles.', 'Celebration events.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Our website keeps transparent records of:</p>
            <ul className="space-y-2 text-sm">
              {['Contributions.', 'Sponsored tournaments.', 'Club balances.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm italic">Trust and accountability are part of our foundation.</p>
        </CardContent>
      </Card>

      {/* Culture */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#c68a2e]" />
            Our Culture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Respect above ego.',
              'Competition above excuses.',
              'Records over noise.',
              'Growth over comfort.',
            ].map((item) => (
              <div key={item} className="rounded-lg bg-secondary/50 p-3 text-center">
                <p className="font-medium text-foreground">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            We welcome sponsors, supporters, and serious competitors.
          </p>
        </CardContent>
      </Card>

      {/* The Future */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[#c68a2e]" />
            The Future
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Imperium is building:</p>
          <ul className="space-y-2">
            {[
              'A structured digital ecosystem.',
              'Accurate historical records.',
              'Performance analytics.',
              'A professional competitive environment.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-center font-semibold text-[#c68a2e] pt-2">
            We are laying foundations for long-term excellence.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
