import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const LICHESS_TOKEN = process.env.LICHESS_API_TOKEN;
const TEAM_ID = 'imperium-online-chess-hub';
const TOURNAMENT_IDS = ['xzhzQVxf', 'ptyMGwDZ'];

async function fetchLichessApi(endpoint: string) {
  const res = await fetch(`https://lichess.org${endpoint}`, {
    headers: {
      Authorization: `Bearer ${LICHESS_TOKEN}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Lichess API ${endpoint}: ${res.status}`);
  return res.json();
}

async function fetchLichessStream(endpoint: string): Promise<any[]> {
  const res = await fetch(`https://lichess.org${endpoint}`, {
    headers: {
      Authorization: `Bearer ${LICHESS_TOKEN}`,
      Accept: 'application/x-ndjson',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Lichess stream ${endpoint}: ${res.status}`);
  const text = await res.text();
  return text.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
}

export async function GET() {
  const report: any = { status: 'started', steps: [] };

  try {
    // 1. Fetch team members
    report.steps.push('Fetching team members...');
    const members = await fetchLichessStream(`/api/team/${TEAM_ID}/users`);
    report.membersFound = members.length;

    // Count team members as active (Lichess team API doesn't provide online status)
    const onlineCount = members.length;
    report.totalMembers = members.length;

    // Create a map of member profiles for ratings
    const ratingMap: Record<string, number> = {};
    for (const member of members) {
      try {
        const profile = await fetchLichessApi(`/api/user/${member.id}`);
        const rating = profile.perfs?.rapid?.rating ?? profile.perfs?.blitz?.rating ?? profile.perfs?.classical?.rating ?? null;
        ratingMap[profile.username.toLowerCase()] = rating;
      } catch (e) {
        // skip
      }
    }
    report.ratingMapSize = Object.keys(ratingMap).length;

    // 2. Fetch results from each Imperium tournament
    const allTournamentResults: Record<string, { score: number; username: string }> = {};
    let syncedTournaments = 0;

    for (const tId of TOURNAMENT_IDS) {
      try {
        const tData = await fetchLichessApi(`/api/tournament/${tId}`);
        const players = tData.standing?.players || [];
        
        await supabaseAdmin
          .from('tournaments')
          .upsert({
            lichess_id: tId,
            name: tData.fullName ?? tData.name ?? 'Unknown Tournament',
            played_at: tData.finishesAt ? new Date(tData.finishesAt).toISOString() : new Date().toISOString(),
            participant_count: tData.nbPlayers ?? players.length,
            time_control: tData.clock ? `${tData.clock.limit / 60}+${tData.clock.increment}` : null,
          }, { onConflict: 'lichess_id' });

        syncedTournaments++;

        for (const player of players) {
          const key = player.name.toLowerCase();
          if (!allTournamentResults[key]) {
            allTournamentResults[key] = { username: player.name, score: 0 };
          }
          allTournamentResults[key].score += player.score;
        }
      } catch (e: any) {
        report.steps.push(`Failed to fetch tournament ${tId}: ${e.message}`);
      }
    }
    report.syncedTournaments = syncedTournaments;

    // 3. Calculate standings
    const sortedPlayers = Object.values(allTournamentResults)
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({
        rank: i + 1,
        username: p.username,
        points: p.score,
        lichess_rating: ratingMap[p.username.toLowerCase()] ?? null,
        played: TOURNAMENT_IDS.length,
        wins: 0, draws: 0, losses: 0,
        mpi: p.score,
        form: [], movement: 0,
      }));

    // 4. Delete old players not in tournament
    const tournamentUsernames = sortedPlayers.map(p => p.username.toLowerCase());
    const { data: allExisting } = await supabaseAdmin
      .from('live_standings')
      .select('username');

    let deletedCount = 0;
    if (allExisting) {
      for (const existing of allExisting) {
        if (!tournamentUsernames.includes(existing.username.toLowerCase())) {
          await supabaseAdmin.from('live_standings').delete().eq('username', existing.username);
          deletedCount++;
        }
      }
    }
    report.deletedOldPlayers = deletedCount;

    // 5. Upsert tournament players
    let syncedPlayers = 0;
    for (const player of sortedPlayers) {
      const { error } = await supabaseAdmin.from('live_standings').upsert({
        username: player.username,
        lichess_rating: player.lichess_rating,
        played: player.played, wins: player.wins, draws: player.draws, losses: player.losses,
        mpi: player.mpi, points: player.points,
        rank: player.rank, movement: player.movement, form: player.form,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'username' });
      if (!error) syncedPlayers++;
    }

    // 6. Save team stats
    await supabaseAdmin.from('team_stats').upsert({
      id: 'imperium',
      member_count: members.length,
      online_count: onlineCount,
      tournament_count: TOURNAMENT_IDS.length,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    report.syncedPlayers = syncedPlayers;
    report.ranksAssigned = sortedPlayers.length;
    report.status = 'success';
    report.finishedAt = new Date().toISOString();

  } catch (error: any) {
    report.status = 'error';
    report.error = error.message;
  }

  return NextResponse.json(report);
}