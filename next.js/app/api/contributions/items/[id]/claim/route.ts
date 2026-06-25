import { NextResponse } from 'next/server';
import { db } from '../../../../../../lib/db';

export async function POST(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId') || 'emp-001';
  
  const items = (db.get('contributionItems') || []) as any[];
  const item = items.find((i: any) => i.id === id);
  if (!item) {
    return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
  }
  
  item.isAvailable = false;
  item.claimedBy = employeeId;
  db.set('contributionItems', items);
  
  const leaderboard = db.get('contributionLeaderboard') || [];
  const entry = leaderboard.find((l: any) => l.employeeId === employeeId);
  if (entry) {
    entry.totalPoints = Math.max(0, entry.totalPoints - item.suggestedPoints);
    db.set('contributionLeaderboard', leaderboard);
  }
  
  return NextResponse.json({ success: true });
}
