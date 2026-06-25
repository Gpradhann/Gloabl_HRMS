'use client';
import { useState } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { useTodos, Todo } from '../../../hooks/useTodos';
import { 
  CheckSquare, Square, Plus, Trash2, Calendar, 
  ArrowLeft, Check, AlertCircle, Clock 
} from 'lucide-react';
import Link from 'next/link';

export default function TodosPage() {
  const { activeRole } = useHrmsStore();
  const userIdByRole: Record<string, string> = {
    Employee: 'emp-001', Manager: 'emp-002',
    HR: 'emp-003', Admin: 'emp-004'
  };
  const currentUserId = userIdByRole[activeRole] || 'emp-001';

  const { todos, isLoading, createTodo, updateTodo, deleteTodo } = useTodos(currentUserId);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleToggle = async (todo: Todo) => {
    await updateTodo({
      todoId: todo.todoId,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString() : null,
      isCompleted: !todo.isCompleted,
      userId: todo.userId
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTodo({
      title,
      description: description || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      isCompleted: false,
      userId: currentUserId
    });
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsAdding(false);
  };

  const handleDelete = async (todoId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTodo(todoId);
    }
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'pending') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '1rem', minHeight: 'calc(100vh - 120px)', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'white', border: '1px solid rgb(var(--color-border)/0.6)', color: 'var(--foreground)' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>My Tasks</h1>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Manage your daily checklist & items</p>
        </div>
      </div>

      {/* Filters & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', background: 'white', padding: 3, borderRadius: 'var(--radius-lg)', border: '1px solid rgb(var(--color-border)/0.6)' }}>
          {(['all', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: filter === f ? '#0d9488' : 'transparent',
                color: filter === f ? 'white' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'linear-gradient(135deg, #0d9488, #0891b2)',
            color: 'white',
            border: 'none',
            padding: '8px 14px',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgb(13 148 136 / 0.25)'
          }}
        >
          <Plus size={14} /> New Task
        </button>
      </div>

      {/* Add Task Modal overlay */}
      {isAdding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, overflowY: 'auto', padding: '1rem' }}>
          <form onSubmit={handleCreate} className="animate-slide-up" style={{ background: 'white', width: '100%', maxWidth: 480, borderRadius: 'var(--radius-2xl)', padding: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Create New Task</h2>
              <button type="button" onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4 }}>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Task title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8125rem', padding: '10px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid rgb(var(--color-border))', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4 }}>Description</label>
                <textarea
                  placeholder="Additional context/details..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8125rem', padding: '10px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid rgb(var(--color-border))', outline: 'none', minHeight: 80, resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4 }}>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8125rem', padding: '10px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid rgb(var(--color-border))', outline: 'none' }}
                />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: 'white', border: 'none', padding: '12px', borderRadius: 'var(--radius-xl)', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
              Create Task
            </button>
          </form>
        </div>
      )}

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {isLoading ? (
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center', border: '1px solid rgb(var(--color-border)/0.5)', color: '#94a3b8', fontSize: '0.8125rem' }}>
            Loading checklist...
          </div>
        ) : filteredTodos.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', textAlign: 'center', border: '1px solid rgb(var(--color-border)/0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <CheckCircle2Icon />
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>All caught up!</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>No tasks found in this section.</p>
          </div>
        ) : (
          filteredTodos.map(todo => {
            const isOverdue = todo.dueDate && !todo.isCompleted && new Date(todo.dueDate) < new Date();
            return (
              <div
                key={todo.todoId}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1rem',
                  border: '1px solid rgb(var(--color-border)/0.5)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  boxShadow: todo.isCompleted ? 'none' : '0 2px 6px rgba(0,0,0,0.015)'
                }}
              >
                <button
                  onClick={() => handleToggle(todo)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', marginTop: 2 }}
                >
                  {todo.isCompleted ? (
                    <CheckSquare size={20} color="#0d9488" />
                  ) : (
                    <Square size={20} color="#64748b" />
                  )}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      margin: '0 0 4px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textDecoration: todo.isCompleted ? 'line-through' : 'none',
                      color: todo.isCompleted ? '#94a3b8' : 'var(--foreground)'
                    }}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: todo.isCompleted ? '#cbd5e1' : '#64748b', lineHeight: 1.4 }}>
                      {todo.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {todo.dueDate && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: isOverdue ? '#ef4444' : '#64748b',
                          background: isOverdue ? '#fef2f2' : '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: 999
                        }}
                      >
                        <Calendar size={10} />
                        {new Date(todo.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    )}
                    {todo.isCompleted ? (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#0f766e', background: '#ecfdf5', padding: '3px 8px', borderRadius: 999 }}>
                        Completed
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#c2410c', background: '#fff7ed', padding: '3px 8px', borderRadius: 999 }}>
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(todo.todoId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 4,
                    cursor: 'pointer',
                    color: '#cbd5e1',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'none'; }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function CheckCircle2Icon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
      <Check size={24} strokeWidth={3} />
    </div>
  );
}
