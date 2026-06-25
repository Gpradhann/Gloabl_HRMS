import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  const items = db.get('contributionItems') || [];
  return NextResponse.json({ success: true, data: items });
}
