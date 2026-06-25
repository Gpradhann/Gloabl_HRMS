import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const memberId = resolvedParams.id;
  const body = await request.json();
  const { status } = body;

  const onboardingData = db.get('onboardingData') as any;
  if (onboardingData && Array.isArray(onboardingData.teamIntroductions)) {
    const member = onboardingData.teamIntroductions.find((m: any) => m.employeeId === memberId);
    if (member) {
      member.introductionStatus = status || (member.introductionStatus === 'done' ? 'pending' : 'done');
      db.set('onboardingData', onboardingData);
      return NextResponse.json({ success: true, data: member });
    }
  }

  return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
}
