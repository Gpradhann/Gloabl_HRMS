import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  
  const todos = (db.get('todos') || []) as any[];
  const todo = todos.find((t: any) => t.todoId === id);
  if (!todo) {
    return NextResponse.json({ success: false, message: 'Todo not found' }, { status: 404 });
  }
  
  if (body.title !== undefined) todo.title = body.title;
  if (body.description !== undefined) todo.description = body.description;
  if (body.dueDate !== undefined) todo.dueDate = body.dueDate;
  if (body.isCompleted !== undefined) todo.isCompleted = body.isCompleted;
  if (body.userId !== undefined) {
    todo.userId = body.userId;
    const employees = (db.get('employees') || []) as any[];
    const employee = employees.find((emp: any) => emp.id === body.userId);
    todo.userContext = employee ? { userId: employee.id, userName: employee.name } : null;
  }
  
  db.set('todos', todos);
  return NextResponse.json({ success: true, data: { todoId: id } });
}

export async function DELETE(request: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const todos = (db.get('todos') || []) as any[];
  const index = todos.findIndex((t: any) => t.todoId === id);
  if (index === -1) {
    return NextResponse.json({ success: false, message: 'Todo not found' }, { status: 404 });
  }
  
  todos.splice(index, 1);
  db.set('todos', todos);
  
  return NextResponse.json({ success: true, data: { todoId: id } });
}
