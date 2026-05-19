import { supabaseAdmin } from '@/lib/supabase/admin';
import { stackServerApp } from '@/stack';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

async function testSupabase() {
  const results: Record<string, { ok: boolean; value: string }> = {};
  const tables = ['live_standings', 'tournaments', 'cage_matches', 'players'];
  for (const table of tables) {
    try {
      const { data, error, count } = await supabaseAdmin.from(table).select('*', { count: 'exact', head: false }).limit(1);
      results[table] = error ? { ok: false, value: error.message } : { ok: true, value: `${count ?? (data?.length ?? 0)} rows` };
    } catch (e: any) { results[table] = { ok: false, value: e.message }; }
  }
  return results;
}

async function testLichess() {
  try {
    const res = await fetch('https://lichess.org/api/account', { headers: { Authorization: `Bearer ${process.env.LICHESS_API_TOKEN}` }, cache: 'no-store' });
    if (!res.ok) return { ok: false, value: `HTTP ${res.status}: ${res.statusText}` };
    const data = await res.json();
    return { ok: true, value: `Connected as @${data.username} (${data.title ?? 'no title'})` };
  } catch (e: any) { return { ok: false, value: e.message }; }
}

async function testLichessTeam() {
  try {
    const res = await fetch('https://lichess.org/api/team/search?text=imperium', { cache: 'no-store' });
    if (!res.ok) return { ok: false, value: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: true, value: `Lichess API reachable — ${data?.currentPageResults?.length ?? 0} results for "imperium"` };
  } catch (e: any) { return { ok: false, value: e.message }; }
}

export default async function TestPage() {
  const user = await stackServerApp.getUser({ or: 'return-null' });
  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to access the test page.</p>
            <Link href="/handler/sign-in"><Button className="bg-[#c68a2e] text-black hover:bg-[#d4a04a]">Sign In</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [supabaseResults, lichessAccount, lichessApi] = await Promise.all([testSupabase(), testLichess(), testLichessTeam()]);
  const allSupabaseOk = Object.values(supabaseResults).every((r) => r.ok);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Connection Tests</h1>
        <p className="text-sm text-muted-foreground mt-1">Supabase database &amp; Lichess API status</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${allSupabaseOk ? 'bg-green-500' : 'bg-red-500'}`} />
          <h2 className="text-lg font-semibold text-foreground">Supabase Database</h2>
          <span className="text-xs text-muted-foreground ml-auto">{process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0]}</span>
        </div>
        <div className="space-y-2">{Object.entries(supabaseResults).map(([table, result]) => (
          <div key={table} className="flex items-center justify-between rounded-md bg-secondary/40 px-4 py-2">
            <div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${result.ok ? 'bg-green-500' : 'bg-red-500'}`} /><span className="text-sm font-mono text-foreground">{table}</span></div>
            <span className={`text-xs ${result.ok ? 'text-muted-foreground' : 'text-red-400'}`}>{result.value}</span>
          </div>
        ))}</div>
        {!allSupabaseOk && <p className="text-xs text-red-400 mt-2">⚠ Some tables failed. They may not exist yet — check your Supabase dashboard.</p>}
      </div>
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3"><div className={`h-3 w-3 rounded-full ${lichessAccount.ok ? 'bg-green-500' : 'bg-red-500'}`} /><h2 className="text-lg font-semibold text-foreground">Lichess API</h2></div>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md bg-secondary/40 px-4 py-2">
            <div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${lichessAccount.ok ? 'bg-green-500' : 'bg-red-500'}`} /><span className="text-sm font-mono text-foreground">API Token (account)</span></div>
            <span className={`text-xs ${lichessAccount.ok ? 'text-muted-foreground' : 'text-red-400'}`}>{lichessAccount.value}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-secondary/40 px-4 py-2">
            <div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${lichessApi.ok ? 'bg-green-500' : 'bg-red-500'}`} /><span className="text-sm font-mono text-foreground">Public API reachability</span></div>
            <span className={`text-xs ${lichessApi.ok ? 'text-muted-foreground' : 'text-red-400'}`}>{lichessApi.value}</span>
          </div>
        </div>
        {!lichessAccount.ok && <p className="text-xs text-red-400">⚠ Token invalid or expired. Generate a new one at lichess.org/account/oauth/token</p>}
      </div>
      <div className={`rounded-lg border px-6 py-4 text-center ${allSupabaseOk && lichessAccount.ok ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
        <p className={`font-semibold ${allSupabaseOk && lichessAccount.ok ? 'text-green-400' : 'text-red-400'}`}>
          {allSupabaseOk && lichessAccount.ok ? '✓ All connections healthy — ready for deployment' : '✗ Some connections failed — fix before deploying'}
        </p>
      </div>
      <p className="text-center text-xs text-muted-foreground">Remove this page before going to production: <span className="font-mono">app/test/page.tsx</span></p>
    </div>
  );
}
