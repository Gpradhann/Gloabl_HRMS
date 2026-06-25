import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const status = searchParams.get('status');
  
  const candidates = (db.get('candidates') || []) as any[];
  let filtered = candidates;
  if (jobId) filtered = filtered.filter((c: any) => c.jobPostingId === jobId);
  if (status) filtered = filtered.filter((c: any) => c.status === status);
  
  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  const candidates = (db.get('candidates') || []) as any[];
  
  const newCandidate = {
    id: `cand-${Date.now()}`,
    jobPostingId: body.jobPostingId,
    name: body.name,
    email: body.email,
    phone: body.phone || '',
    initials: body.initials || body.name.split(' ').map((n: string) => n[0]).join(''),
    appliedRole: body.appliedRole,
    skills: body.skills || [],
    experienceYears: body.experienceYears,
    expectedSalary: body.expectedSalary,
    currency: body.currency || 'USD',
    noticePeriodDays: body.noticePeriodDays || 0,
    rating: body.rating || 0.0,
    notes: body.notes || '',
    status: 'applied',
    appliedDate: new Date().toISOString().split('T')[0],
    interviewDate: null,
    color: '#0d9488'
  };
  
  candidates.push(newCandidate);
  db.set('candidates', candidates);
  return NextResponse.json({ success: true, data: newCandidate });
}
