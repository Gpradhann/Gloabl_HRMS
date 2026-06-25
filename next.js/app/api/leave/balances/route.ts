import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const balances = db.get('leaveBalances') || [];
  const filtered = employeeId ? balances.filter((b: any) => b.employeeId === employeeId || b.userId === employeeId) : balances;
  return NextResponse.json({ success: true, data: filtered });
}
