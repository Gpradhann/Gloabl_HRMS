'use client';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { useEffect, useState } from 'react';
import { currentEmployee } from '../../../data/employees';
import { attendanceSummary } from '../../../data/attendance';
import { leaveBalances, leaveRequests } from '../../../data/leave';
import { goals } from '../../../data/performance';
import { announcements } from '../../../data/announcements';
import { recognitions } from '../../../data/recognition';
import { trainingModules } from '../../../data/training';
import { reimbursements } from '../../../data/expenses';
import { useTodos } from '../../../hooks/useTodos';
import {
  Clock, Calendar, TrendingUp, FileText, Users, BarChart3,
  Bell, ChevronRight, AlertCircle, CheckCircle2, BookOpen,
  DollarSign, Star, Megaphone, Sparkles, UserCheck,
  Activity, ArrowUpRight, Target, CheckSquare, Square, Plus
} from 'lucide-react';
import Link from 'next/link';

function GreetingBanner({ name, role }: { name: string; role: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening';
  return (
    <div style={{
      background: 'linear-gradient(160deg, #0f766e 0%, #0d9488 50%, #0891b2 100%)',
      padding: '1.5rem 1.25rem 1.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgb(255 255 255 / 0.06)' }} />
      <div style={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgb(255 255 255 / 0.04)' }} />

      <p style={{ color: 'rgb(255 255 255 / 0.8)', fontSize: '0.875rem', margin: '0 0 4px', fontWeight: 500 }}>{greeting},</p>
      <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{name.split(' ')[0]} 👋</h1>
      <p style={{ color: 'rgb(255 255 255 / 0.7)', fontSize: '0.8125rem', margin: 0 }}>{role} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
    </div>
  );
}

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '0.875rem', border: '1px solid rgb(var(--color-border)/0.5)', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgb(var(--color-muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
      {sub && <p style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))', margin: '2px 0 0' }}>{sub}</p>}
    </div>
  );
}

function QuickAction({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <Link href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none', flex: 1 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16, background: `${color}12`,
        border: `1.5px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.2s',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgb(var(--color-muted-foreground))', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </Link>
  );
}

function HomeTodosWidget({ userId }: { userId: string }) {
  const { todos, updateTodo, createTodo, isLoading } = useTodos(userId);
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = async (todo: any) => {
    await updateTodo({
      todoId: todo.todoId,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      isCompleted: !todo.isCompleted,
      userId: todo.userId
    });
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createTodo({
      title: newTitle,
      userId: userId,
      isCompleted: false
    });
    setNewTitle('');
    setIsAdding(false);
  };

  const pendingTodos = todos.filter(t => !t.isCompleted);

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem', overflow: 'hidden' }}>
      <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>My Tasks ({pendingTodos.length})</p>
        <Link href="/todos" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgb(var(--color-primary))', textDecoration: 'none' }}>View all</Link>
      </div>

      <div style={{ padding: '0.875rem 1rem' }}>
        {isLoading ? (
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Loading tasks...</p>
        ) : todos.length === 0 ? (
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>No tasks for today!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todos.slice(0, 3).map(todo => (
              <div key={todo.todoId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => handleToggle(todo)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {todo.isCompleted ? (
                    <CheckSquare size={18} color="#0d9488" />
                  ) : (
                    <Square size={18} color="#64748b" />
                  )}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textDecoration: todo.isCompleted ? 'line-through' : 'none',
                    color: todo.isCompleted ? '#94a3b8' : 'var(--foreground)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {todo.title}
                  </p>
                  {todo.dueDate && (
                    <p style={{ margin: 0, fontSize: '0.6875rem', color: '#94a3b8' }}>
                      Due {new Date(todo.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdding ? (
          <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              type="text"
              placeholder="New task..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={{
                flex: 1,
                fontSize: '0.75rem',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgb(var(--color-border))',
                outline: 'none'
              }}
              autoFocus
            />
            <button type="submit" style={{
              background: '#0d9488',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Add
            </button>
            <button type="button" onClick={() => setIsAdding(false)} style={{
              background: 'none',
              color: '#64748b',
              border: 'none',
              padding: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}>
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: '#0d9488',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 12,
              padding: 0
            }}
          >
            <Plus size={14} /> Add Quick Task
          </button>
        )}
      </div>
    </div>
  );
}

// Employee-specific home
function EmployeeHome() {
  const pendingLeave = leaveRequests.filter(l => l.employeeId === 'emp-001' && l.status === 'pending').length;
  const pendingExpenses = reimbursements.filter(e => e.employeeId === 'emp-001' && e.status === 'pending-approval').length;
  const activeGoals = goals.filter(g => g.status === 'in-progress' || g.status === 'on-track').length;
  const inProgressModules = trainingModules.filter(m => m.status === 'in-progress').length;
  const upcomingAnnouncement = announcements.filter(a => !a.acknowledged && a.requiresAcknowledgment)[0];

  return (
    <div style={{ padding: '0 1rem 1rem' }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginTop: '1rem', marginBottom: '1rem' }}>
        <StatCard label="Today" value="Present" sub={`${attendanceSummary.present} days this month`} color="#0d9488" icon={<Clock size={14} color="#0d9488" />} />
        <StatCard label="Leave" value={leaveBalances[0].available} sub="Casual days left" color="#6366f1" icon={<Calendar size={14} color="#6366f1" />} />
        <StatCard label="Goals" value={`${activeGoals}`} sub="In progress" color="#f97316" icon={<Target size={14} color="#f97316" />} />
      </div>

      {/* Urgent action */}
      {upcomingAnnouncement && (
        <Link href="/announcements" style={{ textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
          <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 'var(--radius-xl)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={18} color="#f97316" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8125rem', color: '#c2410c' }}>Action Required</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#9a3412', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{upcomingAnnouncement.title}</p>
            </div>
            <ChevronRight size={16} color="#f97316" />
          </div>
        </Link>
      )}

      {/* Quick actions */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.875rem', fontSize: '0.875rem', fontWeight: 700 }}>Quick Actions</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around' }}>
          <QuickAction href="/attendance" icon={<Clock size={22} color="#0d9488" />} label="Clock In" color="#0d9488" />
          <QuickAction href="/leave" icon={<Calendar size={22} color="#6366f1" />} label="Apply Leave" color="#6366f1" />
          <QuickAction href="/expenses" icon={<DollarSign size={22} color="#f97316" />} label="Add Expense" color="#f97316" />
          <QuickAction href="/payroll" icon={<FileText size={22} color="#8b5cf6" />} label="Payslip" color="#8b5cf6" />
          <QuickAction href="/recognition" icon={<Star size={22} color="#ec4899" />} label="Recognize" color="#ec4899" />
        </div>
      </div>

      {/* Todo list */}
      <HomeTodosWidget userId="emp-001" />

      {/* Pending items */}
      {(pendingLeave > 0 || pendingExpenses > 0) && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem', overflow: 'hidden' }}>
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Pending Items</p>
          </div>
          {pendingLeave > 0 && (
            <Link href="/leave" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.2)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={16} color="#16a34a" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600 }}>Leave Request Pending</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{pendingLeave} request awaiting approval</p>
              </div>
              <ChevronRight size={16} color="rgb(var(--color-muted-foreground))" />
            </Link>
          )}
          {pendingExpenses > 0 && (
            <Link href="/expenses" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={16} color="#f97316" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600 }}>Expenses Pending Approval</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{pendingExpenses} expense claim(s)</p>
              </div>
              <ChevronRight size={16} color="rgb(var(--color-muted-foreground))" />
            </Link>
          )}
        </div>
      )}

      {/* Training due */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Training Due</p>
          <Link href="/training" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgb(var(--color-primary))', textDecoration: 'none' }}>View all</Link>
        </div>
        {trainingModules.filter(m => m.status !== 'completed').slice(0, 2).map(m => (
          <Link key={m.id} href="/training" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.2)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: m.isMandatory ? '#fef2f2' : '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} color={m.isMandatory ? '#dc2626' : '#0891b2'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Due {new Date(m.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · {m.progress}% done{m.isMandatory ? ' · Mandatory' : ''}</p>
            </div>
            <div style={{ width: 32, height: 32, position: 'relative', flexShrink: 0 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="16" cy="16" r="13" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="16" cy="16" r="13" fill="none" stroke={m.isMandatory ? '#dc2626' : '#0d9488'} strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 13}`}
                  strokeDashoffset={`${2 * Math.PI * 13 * (1 - m.progress / 100)}`}
                  strokeLinecap="round" />
              </svg>
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: 'var(--foreground)' }}>{m.progress}%</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recognition feed snippet */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Recent Recognition</p>
          <Link href="/recognition" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgb(var(--color-primary))', textDecoration: 'none' }}>See all</Link>
        </div>
        {recognitions.slice(0, 2).map(r => (
          <div key={r.id} style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: r.fromColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>{r.fromEmployeeInitials}</div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>
                <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{r.fromEmployeeName}</span> → <span style={{ fontWeight: 700, color: r.toColor }}>{r.toEmployeeName}</span>
              </p>
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: 999, fontWeight: 600 }}>{r.category}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))', lineHeight: 1.4 }} className="line-clamp-2">{r.message}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <span style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>❤️ {r.likesCount}</span>
              <span style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>💬 {r.commentsCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Manager home
function ManagerHome() {
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
  const pendingExpenses = reimbursements.filter(e => e.status === 'pending-approval').length;
  const teamSize = 3;

  return (
    <div style={{ padding: '0 1rem 1rem' }}>
      <div style={{ display: 'flex', gap: 10, marginTop: '1rem', marginBottom: '1rem' }}>
        <StatCard label="Team" value={teamSize} sub="Direct reports" color="#0d9488" icon={<Users size={14} color="#0d9488" />} />
        <StatCard label="Leave Q" value={pendingLeaves} sub="Awaiting approval" color="#f97316" icon={<Calendar size={14} color="#f97316" />} />
        <StatCard label="Expenses" value={pendingExpenses} sub="Pending review" color="#6366f1" icon={<DollarSign size={14} color="#6366f1" />} />
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.875rem', fontSize: '0.875rem', fontWeight: 700 }}>Quick Actions</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around' }}>
          <QuickAction href="/team" icon={<Users size={22} color="#0d9488" />} label="My Team" color="#0d9488" />
          <QuickAction href="/leave" icon={<Calendar size={22} color="#6366f1" />} label="Approvals" color="#6366f1" />
          <QuickAction href="/performance" icon={<TrendingUp size={22} color="#f97316" />} label="Goals" color="#f97316" />
          <QuickAction href="/analytics" icon={<BarChart3 size={22} color="#8b5cf6" />} label="Analytics" color="#8b5cf6" />
        </div>
      </div>

      {/* Todo list */}
      <HomeTodosWidget userId="emp-002" />

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Approval Queue</p>
        </div>
        {pendingLeaves > 0 && (
          <Link href="/leave" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.2)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={16} color="#d97706" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600 }}>{pendingLeaves} Leave Requests</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Vikram Nair, Lisa Park</p>
            </div>
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>Pending</span>
          </Link>
        )}
        {pendingExpenses > 0 && (
          <Link href="/expenses" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={16} color="#7c3aed" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600 }}>{pendingExpenses} Expense Claims</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Sarah Johnson, Vikram Nair</p>
            </div>
            <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '3px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>Pending</span>
          </Link>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Team Attendance Today</p>
          <Link href="/analytics" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgb(var(--color-primary))', textDecoration: 'none' }}>Details</Link>
        </div>
        {['Vikram Nair', 'Lisa Park', 'Sarah Johnson'].map((name, i) => {
          const statuses = ['Present', 'Present', 'Present'];
          const colors = ['#16a34a', '#16a34a', '#16a34a'];
          return (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.625rem 1rem', borderBottom: i < 2 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: ['#8b5cf6', '#0891b2', '#0d9488'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>{name.split(' ').map(n => n[0]).join('')}</div>
              <span style={{ flex: 1, fontSize: '0.8125rem', fontWeight: 600 }}>{name}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: colors[i], background: `${colors[i]}15`, padding: '3px 8px', borderRadius: 999 }}>{statuses[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// HR home
function HRHome() {
  const openJobs = 3;
  const newCandidates = 5;
  return (
    <div style={{ padding: '0 1rem 1rem' }}>
      <div style={{ display: 'flex', gap: 10, marginTop: '1rem', marginBottom: '1rem' }}>
        <StatCard label="Headcount" value="10" sub="Active employees" color="#0d9488" icon={<Users size={14} color="#0d9488" />} />
        <StatCard label="Open Roles" value={openJobs} sub="Active postings" color="#f97316" icon={<UserCheck size={14} color="#f97316" />} />
        <StatCard label="New Cands." value={newCandidates} sub="This week" color="#6366f1" icon={<Activity size={14} color="#6366f1" />} />
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.875rem', fontSize: '0.875rem', fontWeight: 700 }}>Quick Actions</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around' }}>
          <QuickAction href="/recruitment" icon={<UserCheck size={22} color="#0d9488" />} label="Recruit" color="#0d9488" />
          <QuickAction href="/announcements" icon={<Megaphone size={22} color="#f97316" />} label="Announce" color="#f97316" />
          <QuickAction href="/analytics" icon={<BarChart3 size={22} color="#6366f1" />} label="Analytics" color="#6366f1" />
          <QuickAction href="/training" icon={<BookOpen size={22} color="#8b5cf6" />} label="Training" color="#8b5cf6" />
        </div>
      </div>

      {/* Todo list */}
      <HomeTodosWidget userId="emp-003" />

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>HR Actions Needed</p>
        </div>
        {[
          { icon: <UserCheck size={16} color="#0d9488" />, bg: '#ccfbf1', title: '3 candidates in interview stage', sub: 'Awaiting status update', href: '/recruitment' },
          { icon: <Bell size={16} color="#f97316" />, bg: '#fff7ed', title: 'WFH Policy acknowledgment pending', sub: '156 / 312 acknowledged', href: '/announcements' },
          { icon: <CheckCircle2 size={16} color="#7c3aed" />, bg: '#ede9fe', title: 'Security training compliance', sub: '88% completion rate', href: '/training' },
        ].map((item, i) => (
          <Link key={i} href={item.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', borderBottom: i < 2 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600 }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{item.sub}</p>
            </div>
            <ChevronRight size={16} color="rgb(var(--color-muted-foreground))" />
          </Link>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Latest Announcements</p>
        </div>
        {announcements.slice(0, 2).map((a, i) => (
          <Link key={a.id} href="/announcements" style={{ textDecoration: 'none', display: 'flex', gap: 12, padding: '0.75rem 1rem', borderBottom: i === 0 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.priority === 'critical' ? '#dc2626' : a.priority === 'high' ? '#f97316' : '#0d9488', flexShrink: 0, marginTop: 5 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600 }} className="line-clamp-1">{a.title}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{a.views} views · {a.likes} likes</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Admin home
function AdminHome() {
  return (
    <div style={{ padding: '0 1rem 1rem' }}>
      <div style={{ display: 'flex', gap: 10, marginTop: '1rem', marginBottom: '1rem' }}>
        <StatCard label="Employees" value="10" sub="Total workforce" color="#0d9488" icon={<Users size={14} color="#0d9488" />} />
        <StatCard label="Attendance" value="86%" sub="Org avg this month" color="#f97316" icon={<Activity size={14} color="#f97316" />} />
        <StatCard label="Training" value="67%" sub="Completion rate" color="#6366f1" icon={<BookOpen size={14} color="#6366f1" />} />
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.875rem', fontSize: '0.875rem', fontWeight: 700 }}>Quick Actions</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around' }}>
          <QuickAction href="/analytics" icon={<BarChart3 size={22} color="#0d9488" />} label="Analytics" color="#0d9488" />
          <QuickAction href="/team" icon={<Users size={22} color="#6366f1" />} label="All Staff" color="#6366f1" />
          <QuickAction href="/announcements" icon={<Megaphone size={22} color="#f97316" />} label="Announce" color="#f97316" />
          <QuickAction href="/payroll" icon={<DollarSign size={22} color="#8b5cf6" />} label="Payroll" color="#8b5cf6" />
        </div>
      </div>

      {/* Todo list */}
      <HomeTodosWidget userId="emp-004" />

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Key Metrics</p>
          <Link href="/analytics" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: 'rgb(var(--color-primary))', textDecoration: 'none' }}>View Full <ArrowUpRight size={12} /></Link>
        </div>
        {[
          { label: 'Payroll Processing', value: '₹12.5L', sub: 'June 2026 total payout', color: '#0d9488' },
          { label: 'Open Positions', value: '3', sub: 'Active job postings', color: '#f97316' },
          { label: 'Compliance Score', value: '92%', sub: 'All statutory filings', color: '#16a34a' },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', borderBottom: i < 2 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))' }}>{m.label}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: m.color }}>{m.value}</p>
              <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>{m.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { activeRole, setCurrentView } = useHrmsStore();
  useEffect(() => { setCurrentView('home'); }, [setCurrentView]);

  const nameByRole: Record<string, string> = {
    Employee: currentEmployee.name, Manager: 'Michael Chen',
    HR: 'Priya Sharma', Admin: 'David Williams',
  };
  const designationByRole: Record<string, string> = {
    Employee: currentEmployee.designation, Manager: 'Engineering Manager',
    HR: 'HR Specialist', Admin: 'Chief People Officer',
  };

  return (
    <div className="animate-fade-in">
      <GreetingBanner name={nameByRole[activeRole]} role={designationByRole[activeRole]} />
      {activeRole === 'Employee' && <EmployeeHome />}
      {activeRole === 'Manager' && <ManagerHome />}
      {activeRole === 'HR' && <HRHome />}
      {activeRole === 'Admin' && <AdminHome />}
    </div>
  );
}
