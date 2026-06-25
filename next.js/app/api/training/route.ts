import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const modules = (db.get('trainingModules') || []) as any[];
  const filtered = employeeId ? modules.filter((m: any) => m.employeeId === employeeId) : modules;
  return NextResponse.json({ success: true, data: filtered });
}
