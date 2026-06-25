import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const taskId = resolvedParams.id;
  const body = await request.json();
  const { status } = body;
  
  const onboardingData = db.get('onboardingData') as any;
  if (onboardingData && Array.isArray(onboardingData.tasks)) {
    const task = onboardingData.tasks.find((t: any) => t.id === taskId);
    if (task) {
      task.status = status || 'completed';
      if (task.status === 'completed') {
        task.completedDate = new Date().toISOString().split('T')[0];
      } else {
        task.completedDate = null;
      }
      
      const completedTasks = onboardingData.tasks.filter((t: any) => t.status === 'completed').length;
      onboardingData.progressPercent = Math.round((completedTasks / onboardingData.tasks.length) * 100);
      
      db.set('onboardingData', onboardingData);
      
      return NextResponse.json({ success: true, data: task });
    }
  }
  
  return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
}
