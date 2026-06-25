import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { action, finalPoints, comment } = body;
  
  const contributions = (db.get('contributions') || []) as any[];
  const cont = contributions.find((c: any) => c.id === id);
  if (!cont) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  cont.status = action === 'approve' ? 'approved' : 'rejected';
  cont.finalPoints = action === 'approve' ? (finalPoints || cont.suggestedPoints) : null;
  cont.approvalFlow = [{ approver: 'Michael Chen', role: 'Manager', status: cont.status, comment: comment, date: new Date().toISOString().split('T')[0] }];
  
  db.set('contributions', contributions);
  
  if (action === 'approve') {
    const leaderboard = db.get('contributionLeaderboard') || [];
    const entry = leaderboard.find((l: any) => l.employeeId === cont.employeeId);
    if (entry) {
      entry.totalPoints = (entry.totalPoints || 0) + cont.finalPoints;
      db.set('contributionLeaderboard', leaderboard);
    }
  }
  
  return NextResponse.json({ success: true, data: cont });
}
