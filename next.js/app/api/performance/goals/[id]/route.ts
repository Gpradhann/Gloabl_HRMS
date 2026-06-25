import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { progress, status, keyResults } = body;
  
  const goals = (db.get('goals') || []) as any[];
  const goal = goals.find((g: any) => g.id === id);
  if (!goal) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  if (progress !== undefined) goal.progress = progress;
  if (status !== undefined) goal.status = status;
  if (keyResults !== undefined) {
    goal.keyResults = typeof keyResults === 'string' ? keyResults : JSON.stringify(keyResults);
  }
  
  db.set('goals', goals);
  return NextResponse.json({ success: true, data: goal });
}
