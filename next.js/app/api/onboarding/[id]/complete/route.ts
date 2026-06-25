import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function POST(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const onboardingData = db.get('onboardingData') as any;
  
  if (onboardingData) {
    onboardingData.isComplete = true;
    onboardingData.progressPercent = 100;
    
    if (Array.isArray(onboardingData.tasks)) {
      onboardingData.tasks.forEach((t: any) => {
        t.status = 'completed';
        t.completedDate = new Date().toISOString().split('T')[0];
      });
    }
    
    db.set('onboardingData', onboardingData);
  }
  
  return NextResponse.json({ success: true });
}
