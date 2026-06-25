import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { action, comment } = body;
  const requests = (db.get('leaveRequests') || []) as any[];
  const balances = db.get('leaveBalances') || [];
  
  const req = requests.find((r: any) => r.id === id);
  if (!req) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  const oldStatus = req.status;
  req.status = action === 'approve' ? 'approved' : 'rejected';
  req.approverComment = comment || null;
  req.approverId = 'emp-002';
  req.approvalFlow = [{ approver: 'Michael Chen', role: 'Manager', status: req.status, comment: comment, date: new Date().toISOString().split('T')[0] }];
  
  db.set('leaveRequests', requests);
  
  const balance = balances.find((b: any) => (b.employeeId === req.employeeId || b.userId === req.employeeId) && b.leaveType === req.leaveType);
  if (balance) {
    if (oldStatus === 'pending') {
      balance.pending = Math.max(0, (balance.pending || 0) - req.totalDays);
    }
    if (action === 'approve') {
      balance.used = (balance.used || 0) + req.totalDays;
      balance.available = Math.max(0, (balance.available || 0) - req.totalDays);
    }
    db.set('leaveBalances', balances);
  }
  
  return NextResponse.json({ success: true, data: req });
}
