import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { action, comment } = body;
  
  const expenses = (db.get('reimbursements') || []) as any[];
  const exp = expenses.find((e: any) => e.id === id);
  if (!exp) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  exp.status = action === 'approve' ? 'approved' : 'rejected';
  exp.approvalFlow = [{ approver: 'Michael Chen', role: 'Manager', status: exp.status, comment: comment, date: new Date().toISOString().split('T')[0] }];
  if (action === 'approve') {
    exp.paidDate = new Date().toISOString().split('T')[0];
  }
  
  db.set('reimbursements', expenses);
  return NextResponse.json({ success: true, data: exp });
}
