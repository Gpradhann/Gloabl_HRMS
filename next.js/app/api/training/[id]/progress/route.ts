import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  const { contentId, completed } = body;
  
  const modules = (db.get('trainingModules') || []) as any[];
  const mod = modules.find((m: any) => m.id === id);
  if (!mod) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  
  const contents = typeof mod.contents === 'string' ? JSON.parse(mod.contents) : (mod.contents || []);
  const content = contents.find((c: any) => c.id === contentId);
  if (content) {
    content.completed = completed;
  }
  
  const completedCount = contents.filter((c: any) => c.completed).length;
  mod.progress = Math.round((completedCount / contents.length) * 100);
  mod.contents = contents;
  
  if (mod.progress === 100) {
    mod.status = 'completed';
    mod.certificateId = `cert-${Date.now()}`;
  } else {
    mod.status = 'in-progress';
  }
  
  db.set('trainingModules', modules);
  return NextResponse.json({ success: true, data: mod });
}
