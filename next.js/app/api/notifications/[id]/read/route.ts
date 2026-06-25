import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const notifications = db.get('notifications') || [];
  const notif = notifications.find((n: any) => n.id === id);
  if (notif) {
    notif.read = true;
  }
  
  db.set('notifications', notifications);
  return NextResponse.json({ success: true });
}
