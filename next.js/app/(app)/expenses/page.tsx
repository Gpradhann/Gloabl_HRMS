'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { reimbursements as defaultExpenses } from '../../../data/expenses';
import { Plus, Receipt, Car, CheckCircle2, XCircle, Clock, X, AlertCircle } from 'lucide-react';
import type { ExpenseCategory, ExpenseStatus } from '../../../data/types';
import { useExpenses } from '../../../hooks/useExpenses';

const categoryEmoji: Record<ExpenseCategory, string> = { travel: '✈️', food: '🍽️', accommodation: '🏨', communication: '📱', medical: '🏥', 'office-supplies': '🖊️', other: '📦' };
const statusStyle: Record<ExpenseStatus, { bg: string; color: string; label: string }> = {
  draft: { bg: '#f3f4f6', color: '#6b7280', label: 'Draft' },
  submitted: { bg: '#dbeafe', color: '#1d4ed8', label: 'Submitted' },
  'pending-approval': { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  approved: { bg: '#d1fae5', color: '#059669', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
  paid: { bg: '#ede9fe', color: '#7c3aed', label: 'Paid' },
};

function NewExpenseModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: object) => void }) {
  const [cat, setCat] = useState<ExpenseCategory>('travel');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMileage, setIsMileage] = useState(false);
  const [km, setKm] = useState('');
  const limits: Record<ExpenseCategory, number> = { travel: 5000, food: 1500, accommodation: 15000, communication: 3000, medical: 5000, 'office-supplies': 2000, other: 5000 };
  const policyOk = !amount || parseFloat(amount) <= limits[cat];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>New Expense</h2>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#64748b" /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(['travel', 'food', 'accommodation', 'communication', 'medical', 'office-supplies', 'other'] as ExpenseCategory[]).map(c => (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '0.4rem 0.75rem', borderRadius: 999,
                  border: cat === c ? 'none' : '1.5px solid rgb(var(--color-border))',
                  background: cat === c ? '#f97316' : 'white',
                  color: cat === c ? 'white' : 'var(--foreground)',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
                }}>{categoryEmoji[c]} {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</button>
              ))}
            </div>
          </div>

          {cat === 'travel' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.625rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
              <input type="checkbox" id="mileage" checked={isMileage} onChange={e => setIsMileage(e.target.checked)} />
              <label htmlFor="mileage" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>🚗 Calculate by mileage</label>
            </div>
          )}

          {isMileage ? (
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Distance (km) @ ₹30/km</label>
              <input type="number" value={km} onChange={e => { setKm(e.target.value); setAmount(String(parseFloat(e.target.value || '0') * 30)); }} placeholder="25" className="input-field" />
              {km && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#0d9488', fontWeight: 600 }}>Calculated: ₹{(parseFloat(km) * 30).toFixed(0)}</p>}
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Amount (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="input-field" />
              {amount && !policyOk && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '0.5rem', background: '#fee2e2', borderRadius: 'var(--radius-md)' }}>
                  <AlertCircle size={14} color="#dc2626" />
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Exceeds policy limit of ₹{limits[cat].toLocaleString()} for {cat}</span>
                </div>
              )}
              {amount && policyOk && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '0.5rem', background: '#dcfce7', borderRadius: 'var(--radius-md)' }}>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Within policy limit of ₹{limits[cat].toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description of the expense..." rows={2} className="input-field" style={{ resize: 'none' }} />
          </div>

          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: '1.5px dashed rgb(var(--color-border))' }}>
            <Receipt size={18} color="#64748b" />
            <span style={{ fontSize: '0.875rem', color: 'rgb(var(--color-muted-foreground))' }}>Tap to attach receipts (photo/PDF)</span>
          </div>

          <button
            onClick={() => { if ((amount || km) && desc) { onSubmit({ cat, amount: parseFloat(amount), desc, date }); onClose(); } }}
            disabled={!(amount || km) || !desc}
            style={{ padding: '0.875rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: !(amount || km) || !desc ? 0.5 : 1 }}
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const { setCurrentView, activeRole } = useHrmsStore();
  const [tab, setTab] = useState<'my' | 'approvals'>('my');
  const [showNew, setShowNew] = useState(false);
  const { expenses, submitExpense, approveRejectExpense } = useExpenses();

  useEffect(() => { setCurrentView('expenses'); }, [setCurrentView]);

  const displayExpenses = expenses.length > 0 ? expenses : defaultExpenses;
  const myExpenses = displayExpenses.filter(e => e.employeeId === 'emp-001');
  const pendingApprovals = displayExpenses.filter(e => (e.status === 'pending-approval' || e.status === 'submitted') && e.employeeId !== 'emp-001');
  const canApprove = activeRole === 'Manager' || activeRole === 'HR' || activeRole === 'Admin';
  const totalPending = myExpenses.filter(e => e.status === 'pending-approval' || e.status === 'submitted').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="animate-fade-in">
      {showNew && (
        <NewExpenseModal
          onClose={() => setShowNew(false)}
          onSubmit={async (data: any) => {
            await submitExpense({
              employeeId: 'emp-001',
              employeeName: 'Sarah Johnson',
              employeeInitials: 'SJ',
              category: data.cat,
              amount: data.amount,
              currency: 'INR',
              description: data.desc,
              date: data.date,
              isMileage: data.isMileage || false,
              mileageKm: data.km ? parseFloat(data.km) : undefined,
              ratePerKm: data.km ? 30 : undefined,
            });
          }}
        />
      )}

      <div style={{ background: 'linear-gradient(160deg, #ea580c 0%, #f97316 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Expenses</h1>
            <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>Reimbursements & Claims</p>
          </div>
          <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', background: 'white', color: '#f97316', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>
            <Plus size={16} /> Add
          </button>
        </div>
        {totalPending > 0 && (
          <div style={{ background: 'rgb(255 255 255 / 0.2)', borderRadius: 'var(--radius-lg)', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 600 }}>Pending Reimbursement</span>
            <span style={{ color: 'white', fontWeight: 900, fontSize: '1rem' }}>₹{totalPending.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        {canApprove && (
          <div className="tab-bar" style={{ marginBottom: '1rem' }}>
            <button className={`tab-item ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>My Claims</button>
            <button className={`tab-item ${tab === 'approvals' ? 'active' : ''}`} onClick={() => setTab('approvals')}>Approvals{pendingApprovals.length > 0 ? ` (${pendingApprovals.length})` : ''}</button>
          </div>
        )}

        {tab === 'my' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myExpenses.map(e => {
              const s = statusStyle[e.status as ExpenseStatus] || statusStyle['draft'];
              return (
                <div key={e.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.25rem' }}>{categoryEmoji[e.category as ExpenseCategory] || categoryEmoji['other']}</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{e.description}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>{new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · {e.isMileage ? `${e.mileageKm}km @ ₹${e.ratePerKm}/km` : e.category}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem' }}>₹{e.amount.toLocaleString('en-IN')}</p>
                      <span style={{ ...s, padding: '2px 7px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700 }}>{s.label}</span>
                    </div>
                  </div>
                  {!e.policyValid && e.policyMessage && (
                    <div style={{ display: 'flex', gap: 6, padding: '0.5rem', background: '#fee2e2', borderRadius: 'var(--radius-md)', marginTop: 6 }}>
                      <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>{e.policyMessage}</span>
                    </div>
                  )}
                  {e.status === 'paid' && e.paidDate && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: '#7c3aed' }}>💳 Paid on {new Date(e.paidDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'approvals' && canApprove && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingApprovals.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'rgb(var(--color-muted-foreground))' }}><CheckCircle2 size={40} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} /><p>No pending approvals</p></div>}
            {pendingApprovals.map(e => (
              <div key={e.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{e.employeeInitials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{e.employeeName}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{categoryEmoji[e.category as ExpenseCategory]} {e.category} · ₹{e.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>Pending</span>
                </div>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem' }}>{e.description}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={async () => {
                      await approveRejectExpense({ id: e.id, action: 'reject', comment: 'Rejected by manager' });
                    }}
                    style={{ flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #fca5a5', background: '#fff', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                    ✕ Reject
                  </button>
                  <button
                    onClick={async () => {
                      await approveRejectExpense({ id: e.id, action: 'approve', comment: 'Approved by manager' });
                    }}
                    style={{ flex: 2, padding: '0.625rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
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
