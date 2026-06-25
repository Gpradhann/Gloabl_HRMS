import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { action, reason } = body;
  
  const documents = (db.get('documents') || []) as any[];
  const doc = documents.find((d: any) => d.id === id);
  if (!doc) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  doc.status = action === 'verify' ? 'verified' : 'rejected';
  if (action === 'verify') {
    doc.verifiedDate = new Date().toISOString().split('T')[0];
    doc.rejectionReason = null;
  } else {
    doc.verifiedDate = null;
    doc.rejectionReason = reason || 'Document mismatch or blurry.';
  }
  
  db.set('documents', documents);
  return NextResponse.json({ success: true, data: doc });
}
