import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  const leaderboard = db.get('contributionLeaderboard') || [];
  return NextResponse.json({ success: true, data: leaderboard });
}
