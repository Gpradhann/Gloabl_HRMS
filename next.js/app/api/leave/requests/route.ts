import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const requests = (db.get('leaveRequests') || []) as any[];
  const filtered = employeeId ? requests.filter((r: any) => r.employeeId === employeeId || r.userId === employeeId) : requests;
  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  const requests = (db.get('leaveRequests') || []) as any[];
  const balances = db.get('leaveBalances') || [];
  
  const newRequest = {
    id: `lv-${Date.now()}`,
    employeeId: body.employeeId,
    employeeName: body.employeeName,
    employeeInitials: body.employeeInitials || '?',
    leaveType: body.leaveType,
    startDate: body.startDate,
    endDate: body.endDate,
    totalDays: body.totalDays,
    reason: body.reason,
    status: 'pending',
    submittedDate: new Date().toISOString().split('T')[0],
    approverId: null,
    approverComment: null,
    approvalFlow: [{ approver: 'Michael Chen', role: 'Manager', status: 'pending' }]
  };
  
  requests.push(newRequest);
  db.set('leaveRequests', requests);
  
  const balance = balances.find((b: any) => (b.employeeId === body.employeeId || b.userId === body.employeeId) && b.leaveType === body.leaveType);
  if (balance) {
    balance.pending = (balance.pending || 0) + body.totalDays;
    db.set('leaveBalances', balances);
  }
  
  return NextResponse.json({ success: true, data: newRequest });
}
