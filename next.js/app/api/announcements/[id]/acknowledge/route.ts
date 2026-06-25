import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function POST(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { employeeId } = body;
  
  const list = db.get('announcements') || [];
  const item = list.find((a: any) => a.id === id) as any;
  if (!item) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  if (!item.acknowledgedBy) item.acknowledgedBy = [];
  if (!item.acknowledgedBy.includes(employeeId)) {
    item.acknowledgedBy.push(employeeId);
  }
  item.acknowledged = true;
  
  db.set('announcements', list);
  return NextResponse.json({ success: true, data: item });
}
