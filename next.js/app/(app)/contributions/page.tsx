'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { contributions as defaultContributions, contributionItems as defaultItems, leaderboard as defaultLeaderboard } from '../../../data/contributions';
import { Plus, Trophy, Medal, Star, CheckCircle2, Clock, X } from 'lucide-react';
import type { ContributionStatus } from '../../../data/types';
import { useContributions } from '../../../hooks/useContributions';

const statusStyle: Record<ContributionStatus, { bg: string; color: string; label: string }> = {
  draft: { bg: '#f3f4f6', color: '#6b7280', label: 'Draft' },
  'proposal-pending': { bg: '#fef3c7', color: '#d97706', label: 'Proposed' },
  'approved-to-start': { bg: '#dbeafe', color: '#1d4ed8', label: 'Approved' },
  'in-progress': { bg: '#cffafe', color: '#0891b2', label: 'In Progress' },
  'under-review': { bg: '#ede9fe', color: '#7c3aed', label: 'Under Review' },
  completed: { bg: '#d1fae5', color: '#059669', label: 'Completed' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
};

const impactColors: Record<string, string> = {
  low: '#6b7280',
  medium: '#0891b2',
  high: '#f97316',
  critical: '#dc2626'
};

const categoryEmoji: Record<string, string> = {
  innovation: '💡',
  'process-improvement': '⚙️',
  'cost-saving': '💰',
  'revenue-generation': '📈',
  quality: '⭐',
  'customer-satisfaction': '🤝',
  'team-building': '👥',
  other: '📦',
};

export default function ContributionsPage() {
  const { setCurrentView, activeRole } = useHrmsStore();
  const [tab, setTab] = useState<'feed' | 'catalog' | 'leaderboard'>('feed');
  
  // Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('innovation');
  const [newPoints, setNewPoints] = useState(100);
  const [newImpact, setNewImpact] = useState('medium');
  const [newType, setNewType] = useState('self-initiated');
  const [newTagsStr, setNewTagsStr] = useState('');

  useEffect(() => { setCurrentView('contributions'); }, [setCurrentView]);

  const {
    contributions: apiContribs,
    leaderboard: apiLeaderboard,
    rewardItems: apiItems,
    submitContribution,
    approveContribution,
    claimItem
  } = useContributions('emp-001');

  const contribs = apiContribs.length > 0 ? apiContribs : defaultContributions;
  const items = apiItems.length > 0 ? apiItems : defaultItems;
  const leaderboardEntries = apiLeaderboard.length > 0 ? apiLeaderboard : defaultLeaderboard;

  const canApprove = activeRole === 'Manager' || activeRole === 'HR' || activeRole === 'Admin';
  const totalPoints = leaderboardEntries.find(l => l.employeeId === 'emp-001')?.totalPoints || 415;
  const myRank = leaderboardEntries.find(l => l.employeeId === 'emp-001')?.rank || 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const tags = newTagsStr.split(',').map(t => t.trim()).filter(Boolean);

    await submitContribution({
      employeeId: 'emp-001',
      employeeName: 'Sarah Johnson',
      employeeInitials: 'SJ',
      title: newTitle,
      description: newDesc,
      category: newCategory,
      suggestedPoints: Number(newPoints),
      impactLevel: newImpact,
      type: newType,
      tags
    });

    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewCategory('innovation');
    setNewPoints(100);
    setNewImpact('medium');
    setNewType('self-initiated');
    setNewTagsStr('');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Submit Contribution Modal */}
      {isCreateOpen && (
        <div className="modal-overlay modal-center">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Submit Value Contribution</h2>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Title</label>
                <input type="text" required placeholder="e.g. Optimized DB Queries" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Description</label>
                <textarea required rows={3} placeholder="Explain the value created, time saved or cost reduced..." value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'white' }}>
                    <option value="innovation">Innovation</option>
                    <option value="process-improvement">Process Improvement</option>
                    <option value="cost-saving">Cost Saving</option>
                    <option value="revenue-generation">Revenue Gen</option>
                    <option value="quality">Quality</option>
                    <option value="team-building">Team Building</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'white' }}>
                    <option value="self-initiated">Self-Initiated</option>
                    <option value="committed">Committed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Suggested Pts</label>
                  <input type="number" required min={10} value={newPoints} onChange={e => setNewPoints(Number(e.target.value))} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Impact Level</label>
                  <select value={newImpact} onChange={e => setNewImpact(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'white' }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Tags (comma-separated)</label>
                <input type="text" placeholder="DevOps, Automation" value={newTagsStr} onChange={e => setNewTagsStr(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-lg)', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', marginTop: 10 }}>
                Submit Contribution
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ background: 'linear-gradient(160deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Contributions</h1>
            <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>Value creation & recognition</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', background: 'white', color: '#7c3aed', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>
            <Plus size={16} /> Submit Claim
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: 'rgb(255 255 255 / 0.2)', borderRadius: 'var(--radius-lg)', padding: '0.75rem', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#fde68a' }}>{totalPoints}</p>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(255 255 255 / 0.8)', fontWeight: 600 }}>My Points</p>
          </div>
          <div style={{ flex: 1, background: 'rgb(255 255 255 / 0.2)', borderRadius: 'var(--radius-lg)', padding: '0.75rem', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#fde68a' }}>#{myRank}</p>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(255 255 255 / 0.8)', fontWeight: 600 }}>Team Rank</p>
          </div>
          <div style={{ flex: 1, background: 'rgb(255 255 255 / 0.2)', borderRadius: 'var(--radius-lg)', padding: '0.75rem', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{contribs.filter(c => c.employeeId === 'emp-001').length}</p>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(255 255 255 / 0.8)', fontWeight: 600 }}>Contributions</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          <button className={`tab-item ${tab === 'feed' ? 'active' : ''}`} onClick={() => setTab('feed')}>Feed</button>
          <button className={`tab-item ${tab === 'catalog' ? 'active' : ''}`} onClick={() => setTab('catalog')}>Catalog</button>
          <button className={`tab-item ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>Board</button>
        </div>

        {tab === 'feed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contribs.map(c => {
              const s = statusStyle[c.status as ContributionStatus] || statusStyle['draft'];
              return (
                <div key={c.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#8b5cf615', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', flexShrink: 0 }}>
                      {categoryEmoji[c.category] || '📦'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.3 }}>{c.title}</p>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: s.color, background: s.bg, padding: '2px 7px', borderRadius: 999 }}>{s.label}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: impactColors[c.impactLevel] || '#6b7280', background: `${impactColors[c.impactLevel] || '#6b7280'}15`, padding: '2px 7px', borderRadius: 999, textTransform: 'capitalize' }}>{c.impactLevel} impact</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#8b5cf6', background: '#f5f3ff', padding: '2px 7px', borderRadius: 999, textTransform: 'capitalize' }}>{c.type.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#8b5cf6' }}>{c.finalPoints || c.suggestedPoints}</p>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>pts</p>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 0.625rem', fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))', lineHeight: 1.4 }}>{c.description}</p>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {c.tags.map(t => <span key={t} style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#64748b', padding: '2px 7px', borderRadius: 999, fontWeight: 600 }}>#{t}</span>)}
                  </div>

                  {canApprove && c.status === 'proposal-pending' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgb(var(--color-border)/0.3)' }}>
                      <button onClick={() => approveContribution({ id: c.id, action: 'reject' })}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #fca5a5', background: '#fff', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>✕ Reject</button>
                      <button onClick={() => approveContribution({ id: c.id, action: 'approve', finalPoints: c.suggestedPoints })}
                        style={{ flex: 2, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>✓ Approve ({c.suggestedPoints} pts)</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'catalog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', opacity: item.isAvailable ? 1 : 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{categoryEmoji[item.category] || '🎁'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.9375rem' }}>{item.title}</p>
                    <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6', background: '#f5f3ff', padding: '2px 8px', borderRadius: 999 }}>{item.suggestedPoints} pts</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: impactColors[item.impactLevel] || '#6b7280', background: `${impactColors[item.impactLevel] || '#6b7280'}15`, padding: '2px 7px', borderRadius: 999, textTransform: 'capitalize' }}>{item.impactLevel}</span>
                    </div>
                  </div>
                  {item.isAvailable ? (
                    <button
                      onClick={() => claimItem(item.id)}
                      style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0 }}>
                      Claim
                    </button>
                  ) : (
                    <span style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', background: '#f1f5f9', color: '#94a3b8', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                      {item.claimedBy === 'emp-001' ? '✅ Claimed' : 'Taken'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'leaderboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {leaderboardEntries.map(l => {
              const isMe = l.employeeId === 'emp-001';
              const medalEmoji = l.rank === 1 ? '🥇' : l.rank === 2 ? '🥈' : l.rank === 3 ? '🥉' : `#${l.rank}`;
              return (
                <div key={l.employeeId} style={{
                  background: isMe ? 'linear-gradient(135deg, #f5f3ff, #ede9fe)' : 'white',
                  borderRadius: 'var(--radius-xl)', padding: '0.875rem 1rem',
                  border: isMe ? '1.5px solid #c4b5fd' : '1px solid rgb(var(--color-border)/0.5)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: '1.25rem', width: 32, textAlign: 'center', flexShrink: 0 }}>{medalEmoji}</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: l.color || '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>{l.employeeInitials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{l.employeeName} {isMe && <span style={{ color: '#8b5cf6', fontSize: '0.7rem' }}>(You)</span>}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>{l.department}</p>
                    {l.badges.length > 0 && <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>{l.badges.map(b => <span key={b} style={{ fontSize: '0.6rem', background: '#f0fdfa', color: '#0d9488', padding: '1px 6px', borderRadius: 999, fontWeight: 600 }}>{b}</span>)}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: '1.125rem', color: l.rank <= 3 ? l.color : 'var(--foreground)' }}>{l.totalPoints}</p>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>⭐ {l.averageRating}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
