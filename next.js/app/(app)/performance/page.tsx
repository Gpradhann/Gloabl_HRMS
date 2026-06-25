'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { goals as defaultGoals, performanceReviews as defaultReviews, feedbacks } from '../../../data/performance';
import { Target, TrendingUp, Star, ChevronRight, CheckCircle2, AlertCircle, Clock, Plus, X, Trash2 } from 'lucide-react';
import { usePerformance } from '../../../hooks/usePerformance';

const statusStyle: Record<string, { color: string; bg: string }> = {
  'on-track': { color: '#16a34a', bg: '#dcfce7' },
  'at-risk': { color: '#ea580c', bg: '#ffedd5' },
  'completed': { color: '#7c3aed', bg: '#ede9fe' },
  'in-progress': { color: '#0891b2', bg: '#cffafe' },
  'not-started': { color: '#6b7280', bg: '#f3f4f6' },
  'cancelled': { color: '#dc2626', bg: '#fee2e2' },
};

function GoalCard({ goal, onUpdateKr }: { goal: any; onUpdateKr: (goalId: string, krId: string, val: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const s = statusStyle[goal.status] || statusStyle['in-progress'];
  const keyResultsList: any[] = typeof goal.keyResults === 'string' ? JSON.parse(goal.keyResults) : (goal.keyResults || []);

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: s.color, background: s.bg, padding: '2px 7px', borderRadius: 999, textTransform: 'capitalize' }}>{goal.status.replace('-', ' ')}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))', background: '#f1f5f9', padding: '2px 7px', borderRadius: 999, fontWeight: 600 }}>{goal.category}</span>
            </div>
            <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.3 }}>{goal.title}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Due {new Date(goal.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · Weight {goal.weight}%</p>
          </div>
          <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="24" cy="24" r="19" fill="none" stroke="#f1f5f9" strokeWidth="4" />
              <circle cx="24" cy="24" r="19" fill="none" stroke={s.color} strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 19}`}
                strokeDashoffset={`${2 * Math.PI * 19 * (1 - goal.progress / 100)}`}
                strokeLinecap="round" />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 800, color: s.color }}>{goal.progress}%</span>
          </div>
        </div>

        <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: s.color, borderRadius: 999, width: `${goal.progress}%`, transition: 'width 0.6s ease-out' }} />
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>{keyResultsList.filter(kr => kr.completed).length}/{keyResultsList.length} key results completed</p>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid rgb(var(--color-border)/0.3)', padding: '0.875rem 1rem', background: '#fafafa' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{goal.description}</p>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'rgb(var(--color-muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Key Results</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {keyResultsList.map((kr, idx) => (
              <div key={kr.id || idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.5rem 0', borderBottom: idx < keyResultsList.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                {kr.completed ? <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} /> : <Clock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, textDecoration: kr.completed ? 'line-through' : 'none', color: kr.completed ? '#94a3b8' : 'inherit' }}>{kr.title}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>Target: {kr.target}{kr.unit}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: kr.completed ? '#16a34a' : '#0891b2' }}>Current: {kr.current}{kr.unit}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpdateKr(goal.id, kr.id, kr.current - 1); }}
                    disabled={kr.current <= 0}
                    style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >-</button>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, width: 22, textAlign: 'center' }}>{kr.current}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpdateKr(goal.id, kr.id, kr.current + 1); }}
                    disabled={kr.completed}
                    style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PerformancePage() {
  const { setCurrentView } = useHrmsStore();
  const [tab, setTab] = useState<'goals' | 'review' | 'feedback'>('goals');
  const { goals: apiGoals, reviews: apiReviews, createGoal, updateGoal } = usePerformance('emp-001');

  // Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('individual');
  const [newType, setNewType] = useState('quarterly');
  const [newWeight, setNewWeight] = useState(25);
  const [newDueDate, setNewDueDate] = useState('');
  const [newKrs, setNewKrs] = useState<{ title: string; target: number; unit: string }[]>([
    { title: '', target: 10, unit: '%' }
  ]);

  useEffect(() => { setCurrentView('performance'); }, [setCurrentView]);

  const displayGoals = apiGoals.length > 0 ? apiGoals : defaultGoals;
  const displayReviews = apiReviews.length > 0 ? apiReviews : defaultReviews;
  const review = displayReviews[0];
  const atRisk = displayGoals.filter(g => g.status === 'at-risk').length;

  const categoryRatingsList: any[] = review ? (typeof review.categoryRatings === 'string' ? JSON.parse(review.categoryRatings) : (review.categoryRatings || [])) : [];
  const strengthsList: string[] = review ? (typeof review.strengths === 'string' ? JSON.parse(review.strengths) : (review.strengths || [])) : [];
  const improvementsList: string[] = review ? (typeof review.areasOfImprovement === 'string' ? JSON.parse(review.areasOfImprovement) : (review.areasOfImprovement || [])) : [];

  const handleUpdateKr = async (goalId: string, krId: string, newValue: number) => {
    const goal = displayGoals.find(g => g.id === goalId);
    if (!goal) return;

    let krs: any[] = typeof goal.keyResults === 'string' ? JSON.parse(goal.keyResults) : (goal.keyResults || []);
    krs = krs.map(kr => {
      if (kr.id === krId) {
        const current = Math.max(0, Math.min(kr.target, newValue));
        return {
          ...kr,
          current,
          completed: current >= kr.target
        };
      }
      return kr;
    });

    // Calculate overall progress
    const totalTargetSum = krs.reduce((acc, k) => acc + k.target, 0);
    const totalCurrentSum = krs.reduce((acc, k) => acc + k.current, 0);
    const progress = totalTargetSum > 0 ? Math.round((totalCurrentSum / totalTargetSum) * 100) : 0;
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';

    await updateGoal({
      id: goalId,
      progress,
      keyResults: krs,
      status
    });
  };

  const handleAddKrInput = () => {
    setNewKrs(prev => [...prev, { title: '', target: 10, unit: '%' }]);
  };

  const handleRemoveKrInput = (index: number) => {
    setNewKrs(prev => prev.filter((_, i) => i !== index));
  };

  const handleKrChange = (index: number, field: string, val: any) => {
    setNewKrs(prev => prev.map((kr, i) => i === index ? { ...kr, [field]: val } : kr));
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newKrs.some(k => !k.title.trim())) return;

    const keyResults = newKrs.map((kr, idx) => ({
      id: `kr-${Date.now()}-${idx}`,
      title: kr.title,
      target: Number(kr.target),
      current: 0,
      unit: kr.unit,
      completed: false
    }));

    await createGoal({
      employeeId: 'emp-001',
      title: newTitle,
      description: newDesc,
      category: newCategory,
      type: newType,
      weight: Number(newWeight),
      dueDate: newDueDate,
      keyResults
    });

    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewCategory('individual');
    setNewType('quarterly');
    setNewWeight(25);
    setNewDueDate('');
    setNewKrs([{ title: '', target: 10, unit: '%' }]);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Create Goal Modal */}
      {isCreateOpen && (
        <div className="modal-overlay modal-center">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Create New OKR Goal</h2>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Goal Title</label>
                <input type="text" required placeholder="e.g. Improve API Performance" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Description</label>
                <textarea rows={2} placeholder="Enter details..." value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'white' }}>
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                    <option value="company">Company</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'white' }}>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Weight (%)</label>
                  <input type="number" required min={1} max={100} value={newWeight} onChange={e => setNewWeight(Number(e.target.value))} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Due Date</label>
                  <input type="date" required value={newDueDate} onChange={e => setNewDueDate(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Key Results</label>
                  <button type="button" onClick={handleAddKrInput} style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ Add Key Result</button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {newKrs.map((kr, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        type="text"
                        required
                        placeholder={`Key Result #${idx + 1} Title`}
                        value={kr.title}
                        onChange={e => handleKrChange(idx, 'title', e.target.value)}
                        style={{ flex: 2, padding: '0.5rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}
                      />
                      <input
                        type="number"
                        required
                        placeholder="Target"
                        value={kr.target}
                        onChange={e => handleKrChange(idx, 'target', e.target.value)}
                        style={{ width: 60, padding: '0.5rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Unit"
                        value={kr.unit}
                        onChange={e => handleKrChange(idx, 'unit', e.target.value)}
                        style={{ width: 50, padding: '0.5rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}
                      />
                      {newKrs.length > 1 && (
                        <button type="button" onClick={() => handleRemoveKrInput(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-lg)', border: 'none', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', marginTop: 10 }}>
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ background: 'linear-gradient(160deg, #0f766e 0%, #0d9488 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Performance & Goals</h1>
            <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>Track your OKRs and performance reviews</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', background: 'white', color: '#0d9488', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>
            <Plus size={16} /> New Goal
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: '1rem' }}>
          {[
            { label: 'Active Goals', value: displayGoals.filter(g => ['on-track', 'in-progress'].includes(g.status)).length, color: '#86efac' },
            { label: 'Completed', value: displayGoals.filter(g => g.status === 'completed').length, color: '#86efac' },
            { label: 'At Risk', value: atRisk, color: atRisk > 0 ? '#fde68a' : '#86efac' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgb(255 255 255 / 0.15)', borderRadius: 'var(--radius-lg)', padding: '0.625rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: s.color }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(255 255 255 / 0.8)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          <button className={`tab-item ${tab === 'goals' ? 'active' : ''}`} onClick={() => setTab('goals')}>Goals</button>
          <button className={`tab-item ${tab === 'review' ? 'active' : ''}`} onClick={() => setTab('review')}>Review</button>
          <button className={`tab-item ${tab === 'feedback' ? 'active' : ''}`} onClick={() => setTab('feedback')}>Feedback</button>
        </div>

        {tab === 'goals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {atRisk > 0 && (
              <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 'var(--radius-xl)', padding: '0.875rem', display: 'flex', gap: 10 }}>
                <AlertCircle size={18} color="#f97316" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#c2410c' }}>{atRisk} goal{atRisk > 1 ? 's' : ''} at risk</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#9a3412' }}>Review and update progress to stay on track.</p>
                </div>
              </div>
            )}
            {displayGoals.map(g => <GoalCard key={g.id} goal={g} onUpdateKr={handleUpdateKr} />)}
          </div>
        )}

        {tab === 'review' && review && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #0d9488, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={24} color="white" fill="white" />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem', color: '#0d9488', lineHeight: 1 }}>{review.overallRating}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Overall Rating / {review.maxRating} · {review.period}</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#0d9488', fontWeight: 700 }}>{review.goalsAchieved}/{review.totalGoals}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>Goals achieved</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {categoryRatingsList.map((cr, idx) => (
                  <div key={cr.category || idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{cr.category}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{cr.rating}/{cr.maxRating}</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: cr.rating >= 4 ? '#0d9488' : cr.rating >= 3 ? '#f97316' : '#dc2626', borderRadius: 999, width: `${(cr.rating / cr.maxRating) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.875rem', color: '#16a34a' }}>💪 Strengths</p>
              {strengthsList.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '0.375rem 0', borderBottom: i < strengthsList.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                  <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ margin: 0, fontSize: '0.8125rem' }}>{s}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.875rem', color: '#f97316' }}>📈 Areas to Improve</p>
              {improvementsList.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '0.375rem 0', borderBottom: i < improvementsList.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                  <TrendingUp size={15} color="#f97316" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ margin: 0, fontSize: '0.8125rem' }}>{s}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1.5px solid #99f6e4' }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '0.875rem', color: '#0f766e' }}>🚀 Manager Recommendation</p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#0f766e', lineHeight: 1.5 }}>{review.recommendations}</p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#14b8a6' }}>— {review.reviewerName} · {new Date(review.reviewDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        )}

        {tab === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedbacks.map(fb => (
              <div key={fb.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.625rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {fb.fromEmployee.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{fb.fromEmployee}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>{fb.type} feedback · {new Date(fb.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  {fb.rating && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} color={i <= fb.rating! ? '#f97316' : '#e2e8f0'} fill={i <= fb.rating! ? '#f97316' : 'none'} />)}
                    </div>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))', lineHeight: 1.5, fontStyle: 'italic' }}>&quot;{fb.message}&quot;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
