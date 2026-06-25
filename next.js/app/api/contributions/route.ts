import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const contributions = (db.get('contributions') || []) as any[];
  const filtered = employeeId ? contributions.filter((c: any) => c.employeeId === employeeId) : contributions;
  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  const contributions = (db.get('contributions') || []) as any[];
  
  const newContribution = {
    id: `cnt-${Date.now()}`,
    employeeId: body.employeeId,
    employeeName: body.employeeName,
    employeeInitials: body.employeeInitials || '?',
    title: body.title,
    description: body.description,
    type: body.type || 'committed',
    category: body.category || 'collaboration',
    suggestedPoints: body.suggestedPoints || 100,
    finalPoints: null,
    impactLevel: body.impactLevel || 'low',
    tags: body.tags || [],
    status: 'under-review',
    approvalFlow: [{ approver: 'Michael Chen', role: 'Manager', status: 'pending' }],
    createdDate: new Date().toISOString().split('T')[0]
  };
  
  contributions.unshift(newContribution);
  db.set('contributions', contributions);
  return NextResponse.json({ success: true, data: newContribution });
}
