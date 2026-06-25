import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  const todos = (db.get('todos') || []) as any[];
  const filtered = userId ? todos.filter((todo: any) => todo.userId === userId) : todos;
  
  return NextResponse.json({ success: true, data: { todos: filtered } });
}

export async function POST(request: Request) {
  const body = await request.json();
  const todos = (db.get('todos') || []) as any[];
  const employees = (db.get('employees') || []) as any[];
  
  const employee = employees.find((emp: any) => emp.id === body.userId);
  const userContext = employee ? { userId: employee.id, userName: employee.name } : null;
  
  const newTodo = {
    todoId: `todo-${Date.now()}`,
    title: body.title,
    description: body.description || null,
    dueDate: body.dueDate || null,
    isCompleted: body.isCompleted || false,
    userId: body.userId,
    userContext
  };
  
  todos.push(newTodo);
  db.set('todos', todos);
  
  return NextResponse.json({ success: true, data: { todoId: newTodo.todoId, todo: newTodo } });
}
