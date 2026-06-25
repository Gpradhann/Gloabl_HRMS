import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const list = (db.get('recognitions') || []) as any[];
  return NextResponse.json({ success: true, data: list });
}

export async function POST(request: Request) {
  const body = await request.json();
  const list = (db.get('recognitions') || []) as any[];
  
  const newItem = {
    id: `rec-${Date.now()}`,
    fromEmployeeId: body.fromEmployeeId,
    fromEmployeeName: body.fromEmployeeName,
    fromEmployeeInitials: body.fromEmployeeInitials || '?',
    fromColor: body.fromColor || '#0d9488',
    toEmployeeId: body.toEmployeeId,
    toEmployeeName: body.toEmployeeName,
    toEmployeeInitials: body.toEmployeeInitials || '?',
    toColor: body.toColor || '#8b5cf6',
    message: body.message,
    category: body.category || 'collaboration',
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    comments: [],
    date: new Date().toISOString().split('T')[0]
  };
  
  list.unshift(newItem);
  db.set('recognitions', list);
  return NextResponse.json({ success: true, data: newItem });
}
