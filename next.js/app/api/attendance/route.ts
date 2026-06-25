import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const records = db.get('attendanceRecords');
  const filtered = employeeId ? records.filter((r: any) => r.employeeId === employeeId) : records;
  return NextResponse.json({ success: true, data: filtered });
}
