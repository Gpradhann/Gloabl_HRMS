import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const list = db.get('announcements') || [];
  return NextResponse.json({ success: true, data: list });
}

export async function POST(request: Request) {
  const body = await request.json();
  const list = (db.get('announcements') || []) as any[];
  
  const newItem = {
    id: `ann-${Date.now()}`,
    title: body.title,
    content: body.content,
    priority: body.priority || 'general',
    category: body.category || 'general',
    authorName: body.authorName || 'HR Admin',
    authorRole: body.authorRole || 'HR',
    publishedDate: new Date().toISOString(),
    views: 0,
    likes: 0,
    likedBy: [],
    acknowledgedBy: [],
    requiresAcknowledgment: body.requiresAcknowledgment || false,
    acknowledged: false
  };
  
  list.unshift(newItem);
  db.set('announcements', list);
  return NextResponse.json({ success: true, data: newItem });
}
