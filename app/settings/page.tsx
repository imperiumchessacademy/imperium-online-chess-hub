import type { Metadata } from 'next';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/back-button';
import { stackServerApp } from '@/stack';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your Imperium Online Chess Hub account settings.',
};

export default async function SettingsPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <BackButton href="/" label="Home" />
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your settings.
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
          <Settings className="h-8 w-8 text-[#c68a2e]" />
          Settings
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your account preferences.</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Display Name</p>
            <p className="text-foreground font-medium">{user.displayName ?? 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-foreground font-medium">{user.primaryEmail ?? 'Not set'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sign Out</p>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
            <Link href="/handler/sign-out">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
