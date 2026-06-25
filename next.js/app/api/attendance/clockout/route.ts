import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { employeeId } = body;
  const records = db.get('attendanceRecords') as any[];
  const today = new Date().toISOString().split('T')[0];
  
  let record = records.find((r: any) => r.employeeId === employeeId && r.date === today);
  if (record) {
    const clockOutTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    record.clockOut = clockOutTime;
    
    if (record.clockIn) {
      const [inH, inM] = record.clockIn.split(':').map(Number);
      const [outH, outM] = clockOutTime.split(':').map(Number);
      const diffMs = (outH * 60 + outM) - (inH * 60 + inM);
      const totalHours = Math.max(0, diffMs / 60);
      record.totalHours = parseFloat(totalHours.toFixed(2));
      record.productiveHours = parseFloat(Math.max(0, totalHours - 0.5).toFixed(2));
    }
  } else {
    record = {
      id: `att-${Date.now()}`,
      employeeId,
      userId: employeeId,
      date: today,
      clockIn: '09:00',
      clockOut: '18:00',
      clockMethod: 'selfie',
      status: 'present',
      productiveHours: 8.5,
      breakHours: 0.5,
      overtimeHours: 0.5,
      totalHours: 9.0,
      locationVerified: true,
      ipValidated: true,
      shiftName: 'General Shift'
    };
    records.push(record);
  }
  
  db.set('attendanceRecords', records);
  return NextResponse.json({ success: true, data: record });
}
