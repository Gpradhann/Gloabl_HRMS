import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const expenses = (db.get('reimbursements') || []) as any[];
  const filtered = employeeId ? expenses.filter((e: any) => e.employeeId === employeeId || e.userId === employeeId) : expenses;
  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  const expenses = (db.get('reimbursements') || []) as any[];
  
  const newExpense = {
    id: `exp-${Date.now()}`,
    employeeId: body.employeeId,
    employeeName: body.employeeName,
    employeeInitials: body.employeeInitials || '?',
    category: body.category,
    amount: body.amount,
    currency: body.currency || 'USD',
    description: body.description,
    date: body.date || new Date().toISOString().split('T')[0],
    isMileage: body.isMileage || false,
    mileageKm: body.mileageKm || null,
    mileageFrom: body.mileageFrom || null,
    mileageTo: body.mileageTo || null,
    ratePerKm: body.ratePerKm || null,
    isTaxable: body.isTaxable || false,
    status: 'pending-approval',
    policyValid: body.amount <= 10000,
    policyMessage: body.amount > 10000 ? 'Exceeds standard 10000 limit' : null,
    receiptUrls: body.receiptUrls || [],
    approvalFlow: [{ approver: 'Michael Chen', role: 'Manager', status: 'pending' }]
  };
  
  expenses.unshift(newExpense);
  db.set('reimbursements', expenses);
  return NextResponse.json({ success: true, data: newExpense });
}
