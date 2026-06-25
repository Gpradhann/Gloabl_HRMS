import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const onboardingData = db.get('onboardingData');
  
  return NextResponse.json({ success: true, data: onboardingData });
}
