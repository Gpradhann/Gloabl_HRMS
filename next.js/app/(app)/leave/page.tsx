'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { leaveBalances as defaultBalances, leaveRequests } from '../../../data/leave';
import { Plus, Calendar, CheckCircle2, XCircle, Clock, ChevronRight, X } from 'lucide-react';
import type { LeaveType } from '../../../data/types';
import { useLeave } from '../../../hooks/useLeave';

const typeLabels: Record<string, string> = { casual: 'Casual', sick: 'Sick', personal: 'Personal', maternity: 'Maternity', paternity: 'Paternity', lwp: 'LWP', 'comp-off': 'Comp-off' };
const statusStyle: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#fef3c7', color: '#d97706' },
  approved: { bg: '#d1fae5', color: '#059669' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
  cancelled: { bg: '#f3f4f6', color: '#6b7280' },
};

function NewLeaveModal({ onClose, onSubmit, balances }: { onClose: () => void; onSubmit: (data: { type: LeaveType; start: string; end: string; reason: string }) => void; balances: any[] }) {
  const [type, setType] = useState<LeaveType>('casual');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');
  const balance = balances.find(b => b.type === type);
  const days = start && end ? Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1 : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>New Leave Request</h2>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#64748b" /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Leave Type</label>
            <select value={type} onChange={e => setType(e.target.value as LeaveType)} className="input-field">
              {balances.map(b => <option key={b.type} value={b.type}>{b.label} ({b.available} days available)</option>)}
            </select>
          </div>

          {balance && (
            <div style={{ background: `${balance.color}12`, border: `1px solid ${balance.color}30`, borderRadius: 'var(--radius-lg)', padding: '0.75rem', display: 'flex', gap: 10 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: balance.color }}>{balance.available}</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>Available</p>
              </div>
              <div style={{ width: 1, background: `${balance.color}20` }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>{balance.used}</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>Used</p>
              </div>
              <div style={{ width: 1, background: `${balance.color}20` }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>{balance.total}</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>Total</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Start Date</label>
              <input type="date" value={start} onChange={e => setStart(e.target.value)} className="input-field" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>End Date</label>
              <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="input-field" min={start} />
            </div>
          </div>

          {days > 0 && (
            <div style={{ background: '#f0fdfa', borderRadius: 'var(--radius-md)', padding: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Calendar size={14} color="#0d9488" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0d9488' }}>{days} day{days > 1 ? 's' : ''} selected</span>
              {days > (balance?.available || 0) && <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>⚠ Exceeds balance</span>}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Brief reason for your leave request..." rows={3} className="input-field" style={{ resize: 'none' }} />
          </div>

          <button
            onClick={() => { if (start && end && reason && days > 0) { onSubmit({ type, start, end, reason }); onClose(); } }}
            disabled={!start || !end || !reason || days <= 0}
            style={{ padding: '0.875rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: (!start || !end || !reason || days <= 0) ? 0.5 : 1 }}
          >
            Submit Request ({days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '—'})
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeavePage() {
  const { setCurrentView, activeRole } = useHrmsStore();
  const [tab, setTab] = useState<'balance' | 'requests' | 'approvals'>('balance');
  const [showNewLeave, setShowNewLeave] = useState(false);
  
  const { balances, requests, submitLeave, approveRejectLeave } = useLeave();

  useEffect(() => { setCurrentView('leave'); }, [setCurrentView]);

  const displayBalances = balances.length > 0 ? balances : defaultBalances;
  const displayRequests = requests.length > 0 ? requests : leaveRequests;

  const myRequests = displayRequests.filter(r => r.employeeId === 'emp-001');
  const pendingApprovals = displayRequests.filter(r => r.status === 'pending' && r.employeeId !== 'emp-001');
  const canApprove = activeRole === 'Manager' || activeRole === 'HR' || activeRole === 'Admin';

  return (
    <div className="animate-fade-in">
      {showNewLeave && (
        <NewLeaveModal
          onClose={() => setShowNewLeave(false)}
          balances={displayBalances}
          onSubmit={async (data) => {
            await submitLeave({
              employeeId: 'emp-001',
              employeeName: 'Sarah Johnson',
              employeeInitials: 'SJ',
              leaveType: data.type,
              startDate: data.start,
              endDate: data.end,
              totalDays: Math.ceil((new Date(data.end).getTime() - new Date(data.start).getTime()) / 86400000) + 1,
              reason: data.reason,
            });
          }}
        />
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #4338ca 0%, #6366f1 100%)', padding: '1.5rem 1.25rem 1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Leave Management</h1>
            <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>Manage your time off requests</p>
          </div>
          <button onClick={() => setShowNewLeave(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', background: 'white', color: '#6366f1', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>
            <Plus size={16} /> Apply
          </button>
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        {/* Tab bar */}
        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          <button className={`tab-item ${tab === 'balance' ? 'active' : ''}`} onClick={() => setTab('balance')}>Balances</button>
          <button className={`tab-item ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>My Requests</button>
          {canApprove && <button className={`tab-item ${tab === 'approvals' ? 'active' : ''}`} onClick={() => setTab('approvals')}>Approvals{pendingApprovals.length > 0 ? ` (${pendingApprovals.length})` : ''}</button>}
        </div>

        {tab === 'balance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {displayBalances.map(b => (
              <div key={b.type} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>{b.label}</p>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: b.color }}>{b.available}</span>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, marginBottom: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: b.color, borderRadius: 999, width: `${b.total > 0 ? (b.used / b.total) * 100 : 0}%` }} />
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>
                  <span>Total: <b>{b.total}</b></span>
                  <span>Used: <b>{b.used}</b></span>
                  <span>Pending: <b>{b.pending}</b></span>
                  {b.carriedForward !== undefined && <span>CF: <b>{b.carriedForward}</b></span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myRequests.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'rgb(var(--color-muted-foreground))' }}><Calendar size={40} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} /><p>No leave requests yet</p></div>}
            {myRequests.map(r => {
              const s = statusStyle[r.status];
              return (
                <div key={r.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>{typeLabels[r.leaveType]} Leave</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>
                        {new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        {r.startDate !== r.endDate && ` – ${new Date(r.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`}
                        {' · '}{r.totalDays} day{r.totalDays > 1 ? 's' : ''}
                      </p>
                    </div>
                    <span style={{ ...s, padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))' }}>{r.reason}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {r.approvalFlow.map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem' }}>
                        {step.status === 'approved' && <CheckCircle2 size={12} color="#16a34a" />}
                        {step.status === 'rejected' && <XCircle size={12} color="#dc2626" />}
                        {step.status === 'pending' && <Clock size={12} color="#d97706" />}
                        <span style={{ color: 'rgb(var(--color-muted-foreground))' }}>{step.approver.split(' ')[0]} ({step.role})</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'approvals' && canApprove && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingApprovals.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'rgb(var(--color-muted-foreground))' }}><CheckCircle2 size={40} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} /><p>No pending approvals</p></div>}
            {pendingApprovals.map(r => (
              <div key={r.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>{r.employeeInitials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>{r.employeeName}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{typeLabels[r.leaveType]} · {r.totalDays} day{r.totalDays > 1 ? 's' : ''}</p>
                  </div>
                  <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>Pending</span>
                </div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>
                  📅 {new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – {new Date(r.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
                <p style={{ margin: '0 0 0.875rem', fontSize: '0.8125rem' }}>{r.reason}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={async () => {
                      await approveRejectLeave({ id: r.id, action: 'reject', comment: 'Rejected by manager' });
                    }}
                    style={{ flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #fca5a5', background: '#fff', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                    ✕ Reject
                  </button>
                  <button
                    onClick={async () => {
                      await approveRejectLeave({ id: r.id, action: 'approve', comment: 'Approved by manager' });
                    }}
                    style={{ flex: 2, padding: '0.625rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                    ✓ Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
