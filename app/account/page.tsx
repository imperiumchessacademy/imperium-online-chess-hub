import type { Metadata } from 'next';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/back-button';
import { stackServerApp } from '@/stack';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Account',
  description: 'View your Imperium Online Chess Hub account details.',
};

export default async function AccountPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <BackButton href="/" label="Home" />
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your account.
            </p>
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
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <User className="h-8 w-8 text-[#c68a2e]" />
          Account
        </h1>
        <p className="mt-2 text-muted-foreground">Your account information.</p>
      </div>

      {/* Account Info */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c68a2e] text-2xl font-bold text-black">
              {(user.displayName ?? user.primaryEmail ?? 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {user.displayName ?? 'Member'}
              </p>
              <p className="text-sm text-muted-foreground">{user.primaryEmail}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID</span>
              <span className="text-foreground font-mono text-sm">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Status</span>
              <span className="text-green-500 font-medium">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked Accounts */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Connected Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Connect your Lichess account to sync your tournament results automatically.
            Contact an admin to link your accounts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
