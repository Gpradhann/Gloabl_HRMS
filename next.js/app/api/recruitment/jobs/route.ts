import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  const jobs = db.get('jobPostings') || [];
  return NextResponse.json({ success: true, data: jobs });
}
