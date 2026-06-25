import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { employeeId, method } = body;
  const records = db.get('attendanceRecords') as any[];
  const today = new Date().toISOString().split('T')[0];
  
  let record = records.find((r: any) => r.employeeId === employeeId && r.date === today);
  if (!record) {
    record = {
      id: `att-${Date.now()}`,
      employeeId,
      userId: employeeId,
      date: today,
      clockIn: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      clockOut: null,
      clockMethod: method || 'selfie',
      status: 'present',
      productiveHours: 0,
      breakHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      locationVerified: true,
      ipValidated: true,
      shiftName: 'General Shift'
    };
    records.push(record);
  } else {
    record.clockIn = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  }
  
  db.set('attendanceRecords', records);
  return NextResponse.json({ success: true, data: record });
}
