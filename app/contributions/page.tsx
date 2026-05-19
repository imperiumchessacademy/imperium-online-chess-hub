import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/back-button';
import { stackServerApp } from '@/stack';

export const metadata: Metadata = {
  title: 'Contributions',
  description: 'Support Imperium Online Chess Hub with your contributions.',
};

const tiers = [
  { name: 'Supporter', description: 'Help keep the club running with a small contribution.', features: ['Name listed as supporter', 'Access to member events'] },
  { name: 'Champion', description: 'Make a bigger impact on club operations and prizes.', features: ['All Supporter benefits', 'Priority tournament registration', 'Special badge on profile'] },
  { name: 'Patron', description: 'Become a major sponsor of Imperium Online Chess Hub.', features: ['All Champion benefits', 'Named tournament sponsorship', 'Featured on Wall of Champions'] },
];

export default async function ContributionsPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view contributions.</p>
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
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3"><Heart className="h-8 w-8 text-[#c68a2e]" /> Support the Club</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">Imperium Online Chess Hub is a community-driven initiative. Your voluntary contributions help us maintain admin tools, hosting, and prize pools for tournaments. Every contribution, no matter the size, helps keep the club thriving.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className="border-border bg-card hover:border-[#c68a2e]/50 transition-colors">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c68a2e]/10 mb-2"><Heart className="h-5 w-5 text-[#c68a2e]" /></div>
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">{tier.features.map((feature) => (<li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c68a2e]" />{feature}</li>))}</ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-[#c68a2e]/30 bg-[#c68a2e]/5">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 text-[#c68a2e] mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Thank You</h3>
          <p className="text-muted-foreground">We deeply appreciate every member who contributes to our club. Your support enables us to run better tournaments, offer prizes, and build a stronger chess community.</p>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">Contact an admin to record your contribution.</p>
    </div>
  );
}
