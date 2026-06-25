import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userRole = searchParams.get('userRole');
  const notifications = db.get('notifications') || [];
  
  const filtered = userRole
    ? notifications.filter((n: any) => {
        try {
          const roles = typeof n.forRoles === 'string' ? JSON.parse(n.forRoles) : (n.forRoles || []);
          return roles.includes(userRole);
        } catch (e) {
          return true;
        }
      })
    : notifications;
    
  return NextResponse.json({ success: true, data: filtered });
}
