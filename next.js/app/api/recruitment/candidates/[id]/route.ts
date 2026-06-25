import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { status, interviewDate, notes, rating } = body;
  
  const candidates = (db.get('candidates') || []) as any[];
  const cand = candidates.find((c: any) => c.id === id);
  if (!cand) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  if (status !== undefined) cand.status = status;
  if (interviewDate !== undefined) cand.interviewDate = interviewDate;
  if (notes !== undefined) cand.notes = notes;
  if (rating !== undefined) cand.rating = rating;
  
  db.set('candidates', candidates);
  return NextResponse.json({ success: true, data: cand });
}
