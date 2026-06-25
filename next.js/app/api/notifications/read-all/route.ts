import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const userRole = searchParams.get('userRole');
  const notifications = db.get('notifications') || [];
  
  notifications.forEach((n: any) => {
    try {
      const roles = typeof n.forRoles === 'string' ? JSON.parse(n.forRoles) : (n.forRoles || []);
      if (!userRole || roles.includes(userRole)) {
        n.read = true;
      }
    } catch (e) {
      n.read = true;
    }
  });
  
  db.set('notifications', notifications);
  return NextResponse.json({ success: true, message: 'All read' });
}
