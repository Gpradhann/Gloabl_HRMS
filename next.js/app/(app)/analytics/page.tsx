'use client';
import { useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { employees } from '../../../data/employees';
import { attendanceSummary, weeklyHours } from '../../../data/attendance';
import { leaveRequests } from '../../../data/leave';
import { goals } from '../../../data/performance';
import { trainingModules } from '../../../data/training';
import { reimbursements } from '../../../data/expenses';
import { BarChart3, TrendingUp, Users, Clock, Calendar, BookOpen, DollarSign, Target } from 'lucide-react';

function BarChart({ data, maxVal, color = '#0d9488' }: { data: { label: string; value: number }[]; maxVal: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
      {data.map((d) => (
        <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', height: `${maxVal > 0 ? (d.value / maxVal) * 72 : 0}px`, background: color, borderRadius: '4px 4px 0 0', minHeight: d.value > 0 ? 3 : 0, transition: 'height 0.5s ease-out' }} />
          <span style={{ fontSize: '0.6rem', color: 'rgb(var(--color-muted-foreground))', fontWeight: 600 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ title, value, sub, change, icon, color }: { title: string; value: string | number; sub?: string; change?: string; icon: React.ReactNode; color: string }) {
  const isPositive = change?.startsWith('+');
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgb(var(--color-muted-foreground))' }}>{title}</span>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      </div>
      <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'rgb(var(--color-muted-foreground))' }}>{sub}</p>}
      {change && <p style={{ margin: '4px 0 0', fontSize: '0.72rem', fontWeight: 700, color: isPositive ? '#16a34a' : '#dc2626' }}>{change} vs last month</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const { setCurrentView, activeRole } = useHrmsStore();
  useEffect(() => { setCurrentView('analytics'); }, [setCurrentView]);

  const canAccess = activeRole !== 'Employee';
  if (!canAccess) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
        <BarChart3 size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
        <h2>Analytics Access Restricted</h2>
        <p style={{ color: 'rgb(var(--color-muted-foreground))' }}>Analytics is available for Managers, HR, and Admins only.</p>
      </div>
    );
  }

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalLeaveRequests = leaveRequests.length;
  const approvedLeaves = leaveRequests.filter(l => l.status === 'approved').length;
  const totalExpenses = reimbursements.reduce((s, e) => s + e.amount, 0);
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const trainingCompletion = Math.round((trainingModules.filter(m => m.status === 'completed').length / trainingModules.length) * 100);

  const deptData = [...new Set(employees.map(e => e.department))].map(dept => ({
    label: dept.split(' ')[0].substring(0, 5),
    value: employees.filter(e => e.department === dept).length,
  }));

  const leaveByType = [
    { label: 'Casual', value: leaveRequests.filter(l => l.leaveType === 'casual').length },
    { label: 'Sick', value: leaveRequests.filter(l => l.leaveType === 'sick').length },
    { label: 'Personal', value: leaveRequests.filter(l => l.leaveType === 'personal').length },
    { label: 'Comp', value: leaveRequests.filter(l => l.leaveType === 'comp-off').length },
  ];

  const attendanceData = weeklyHours.map(w => ({ label: w.day, value: w.hours }));
  const maxHours = Math.max(...weeklyHours.map(w => w.hours));

  return (
    <div className="animate-fade-in">
      <div style={{ background: 'linear-gradient(160deg, #0f766e 0%, #0d9488 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Analytics Dashboard</h1>
        <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>
          {activeRole === 'Admin' ? 'Organization-wide insights' : activeRole === 'Manager' ? 'Team performance insights' : 'HR Workforce Analytics'}
        </p>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        {/* Key metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem' }}>
          <MetricCard title="Total Headcount" value={activeEmployees} sub={`${employees.length} total`} change="+1" icon={<Users size={15} color="#0d9488" />} color="#0d9488" />
          <MetricCard title="Attendance Rate" value={`${Math.round((attendanceSummary.present / (attendanceSummary.present + attendanceSummary.absent + attendanceSummary.late)) * 100)}%`} sub={`${attendanceSummary.present} present days`} change="+2%" icon={<Clock size={15} color="#6366f1" />} color="#6366f1" />
          <MetricCard title="Goal Completion" value={`${completedGoals}/${goals.length}`} sub={`${Math.round((completedGoals / goals.length) * 100)}% rate`} change="+8%" icon={<Target size={15} color="#f97316" />} color="#f97316" />
          <MetricCard title="Training" value={`${trainingCompletion}%`} sub="Completion rate" change="+12%" icon={<BookOpen size={15} color="#8b5cf6" />} color="#8b5cf6" />
        </div>

        {/* Headcount by department */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 1rem', fontWeight: 700, fontSize: '0.875rem' }}>Headcount by Department</p>
          <BarChart data={deptData} maxVal={Math.max(...deptData.map(d => d.value), 1)} color="#0d9488" />
        </div>

        {/* Leave analytics */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>Leave Requests by Type</p>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0d9488' }}>Total: {totalLeaveRequests}</span>
          </div>
          <BarChart data={leaveByType} maxVal={Math.max(...leaveByType.map(d => d.value), 1)} color="#6366f1" />
          <div style={{ display: 'flex', gap: 16, marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Approved', value: approvedLeaves, color: '#16a34a' },
              { label: 'Pending', value: leaveRequests.filter(l => l.status === 'pending').length, color: '#d97706' },
              { label: 'Rejected', value: leaveRequests.filter(l => l.status === 'rejected').length, color: '#dc2626' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                <span style={{ fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{s.label}: <b>{s.value}</b></span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance this week */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 1rem', fontWeight: 700, fontSize: '0.875rem' }}>Weekly Attendance Hours</p>
          <BarChart data={attendanceData} maxVal={maxHours || 10} color="#f97316" />
        </div>

        {/* Expense breakdown */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>Expense Summary</p>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f97316' }}>₹{totalExpenses.toLocaleString('en-IN')}</span>
          </div>
          <BarChart
            data={[...new Set(reimbursements.map(e => e.category))].map(cat => ({
              label: cat.split('-')[0].substring(0, 5),
              value: reimbursements.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
            }))}
            maxVal={Math.max(...[...new Set(reimbursements.map(e => e.category))].map(cat => reimbursements.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)), 1)}
            color="#8b5cf6"
          />
        </div>

        {/* Goal distribution */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
          <p style={{ margin: '0 0 0.875rem', fontWeight: 700, fontSize: '0.875rem' }}>Goal Status Distribution</p>
          {[
            { label: 'Completed', value: goals.filter(g => g.status === 'completed').length, color: '#7c3aed' },
            { label: 'On Track', value: goals.filter(g => g.status === 'on-track').length, color: '#16a34a' },
            { label: 'In Progress', value: goals.filter(g => g.status === 'in-progress').length, color: '#0891b2' },
            { label: 'At Risk', value: goals.filter(g => g.status === 'at-risk').length, color: '#f97316' },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{s.label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color }}>{s.value}/{goals.length}</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: s.color, borderRadius: 999, width: `${goals.length > 0 ? (s.value / goals.length) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
