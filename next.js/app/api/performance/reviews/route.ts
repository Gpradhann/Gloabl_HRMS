import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const reviews = db.get('performanceReviews') || [];
  const filtered = employeeId ? reviews.filter((r: any) => r.employeeId === employeeId) : reviews;
  return NextResponse.json({ success: true, data: filtered });
}
