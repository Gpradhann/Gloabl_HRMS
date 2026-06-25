import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const documents = db.get('documents') || [];
  const filtered = employeeId ? documents.filter((d: any) => d.employeeId === employeeId) : documents;
  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  const documents = (db.get('documents') || []) as any[];
  
  let doc = documents.find((d: any) => d.employeeId === body.employeeId && d.name === body.name);
  if (doc) {
    doc.status = 'uploaded';
    doc.fileName = body.fileName;
    doc.fileSize = body.fileSize;
    doc.fileType = body.fileType;
    doc.uploadDate = new Date().toISOString().split('T')[0];
  } else {
    doc = {
      id: `doc-${Date.now()}`,
      employeeId: body.employeeId,
      name: body.name,
      category: body.category || 'other',
      status: 'uploaded',
      fileName: body.fileName,
      fileSize: body.fileSize,
      fileType: body.fileType,
      uploadDate: new Date().toISOString().split('T')[0],
      verifiedDate: null,
      rejectionReason: null,
      isRequired: body.isRequired || false
    };
    documents.push(doc);
  }
  
  db.set('documents', documents);
  return NextResponse.json({ success: true, data: doc });
}
