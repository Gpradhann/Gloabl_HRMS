import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const goals = (db.get('goals') || []) as any[];
  const filtered = employeeId ? goals.filter((g: any) => g.employeeId === employeeId) : goals;
  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  const goals = (db.get('goals') || []) as any[];
  
  const newGoal = {
    id: `goal-${Date.now()}`,
    employeeId: body.employeeId,
    title: body.title,
    description: body.description || '',
    category: body.category || 'individual',
    type: body.type || 'quarterly',
    weight: body.weight || 25,
    dueDate: body.dueDate,
    status: 'in-progress',
    progress: 0,
    keyResults: body.keyResults || []
  };
  
  goals.push(newGoal);
  db.set('goals', goals);
  return NextResponse.json({ success: true, data: newGoal });
}
