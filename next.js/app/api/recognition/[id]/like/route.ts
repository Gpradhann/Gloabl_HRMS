import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function POST(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { employeeId } = body;
  
  const list = db.get('recognitions') || [];
  const item = list.find((r: any) => r.id === id) as any;
  if (!item) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  if (!item.likedBy) item.likedBy = [];
  if (item.likedBy.includes(employeeId)) {
    item.likedBy = item.likedBy.filter((x: string) => x !== employeeId);
    item.likesCount = Math.max(0, item.likesCount - 1);
  } else {
    item.likedBy.push(employeeId);
    item.likesCount = (item.likesCount || 0) + 1;
  }
  
  db.set('recognitions', list);
  return NextResponse.json({ success: true, data: item });
}
