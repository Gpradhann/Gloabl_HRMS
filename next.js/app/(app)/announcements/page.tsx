'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { announcements as defaultAnnouncements } from '../../../data/announcements';
import { Bell, CheckCircle2, ChevronRight, Eye, AlertCircle, Megaphone, Plus, X } from 'lucide-react';
import type { Announcement } from '../../../data/types';
import { useAnnouncements } from '../../../hooks/useAnnouncements';

const priorityConfig: Record<string, { color: string; bg: string; badge: string }> = {
  critical: { color: '#dc2626', bg: '#fee2e2', badge: '🚨 Critical' },
  high:     { color: '#f97316', bg: '#fff7ed', badge: '⚡ High' },
  medium:   { color: '#0891b2', bg: '#f0f9ff', badge: '📢 Medium' },
  low:      { color: '#6b7280', bg: '#f3f4f6', badge: '💬 Low' },
};
const categoryEmoji: Record<string, string> = {
  policy: '📋', event: '🎉', celebration: '🏆', compliance: '⚠️', 'hr-update': '📢', system: '🔧', general: '📰',
};

interface AnnouncementDetailProps {
  ann: any;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onLike: (id: string) => void;
  liked: boolean;
}

function AnnouncementDetail({ ann, onClose, onAcknowledge, onLike, liked }: AnnouncementDetailProps) {
  const priority = priorityConfig[ann.priority] || priorityConfig.medium;
  return (
    <div className="modal-overlay modal-center">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: priority.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
            {categoryEmoji[ann.category] || '📰'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: priority.color, background: priority.bg, padding: '2px 8px', borderRadius: 999 }}>{priority.badge}</span>
              {ann.requiresAcknowledgment && !ann.acknowledged && (
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: 999 }}>Action Required</span>
              )}
              {ann.acknowledged && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', background: '#d1fae5', padding: '2px 8px', borderRadius: 999 }}>✓ Acknowledged</span>}
            </div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, lineHeight: 1.3 }}>{ann.title}</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>
              {ann.publishedBy} · {new Date(ann.publishedDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem', maxHeight: 200, overflowY: 'auto' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--foreground)' }}>{ann.content}</p>
        </div>

        {ann.expiryDate && (
          <div style={{ display: 'flex', gap: 8, padding: '0.625rem', background: '#fff7ed', borderRadius: 'var(--radius-md)', marginBottom: '0.875rem' }}>
            <AlertCircle size={15} color="#f97316" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: '#c2410c' }}>Action required by: <b>{new Date(ann.expiryDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</b></span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginBottom: '1rem' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{ann.views}</p>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>Views</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{ann.likes}</p>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>Likes</p>
          </div>
          {ann.requiresAcknowledgment && (
            <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{ann.acknowledgments || 0}</p>
              <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>Ack'd</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.875rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid rgb(var(--color-border))', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Close</button>
          
          <button onClick={() => onLike(ann.id)} style={{ flex: 1, padding: '0.875rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #0d9488', background: liked ? '#e6fffa' : '#fff', color: '#0d9488', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {liked ? '❤️ Liked' : '🤍 Like'}
          </button>
          
          {ann.requiresAcknowledgment && !ann.acknowledged && (
            <button onClick={() => { onAcknowledge(ann.id); onClose(); }} style={{ flex: 2, padding: '0.875rem', borderRadius: 'var(--radius-lg)', border: 'none', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
              ✓ Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
  const { setCurrentView, activeRole } = useHrmsStore();
  const { announcements: apiAnns, acknowledgeAnnouncement, likeAnnouncement, createAnnouncement } = useAnnouncements('emp-001');
  const rawAnns = apiAnns.length > 0 ? apiAnns : defaultAnnouncements;
  const anns = rawAnns.map((a: any) => ({
    ...a,
    acknowledged: Array.isArray(a.acknowledgedBy) ? a.acknowledgedBy.includes('emp-001') : !!a.acknowledged,
    liked: Array.isArray(a.likedBy) ? a.likedBy.includes('emp-001') : !!a.liked
  }));

  const [selectedAnn, setSelectedAnn] = useState<any | null>(null);
  const [tab, setTab] = useState<'all' | 'action' | 'critical'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newPriority, setNewPriority] = useState('medium');
  const [newRequiresAck, setNewRequiresAck] = useState(false);
  const [newExpiryDate, setNewExpiryDate] = useState('');

  useEffect(() => { setCurrentView('announcements'); }, [setCurrentView]);

  const canPost = activeRole === 'HR' || activeRole === 'Admin';
  const pendingAction = anns.filter(a => a.requiresAcknowledgment && !a.acknowledged).length;

  const handleAck = (id: string) => {
    acknowledgeAnnouncement({ id, employeeId: 'emp-001' }).then(() => {
      if (selectedAnn && selectedAnn.id === id) {
        setSelectedAnn((prev: any) => prev ? { ...prev, acknowledged: true, acknowledgments: (prev.acknowledgments || 0) + 1 } : null);
      }
    });
  };

  const handleLike = (id: string) => {
    likeAnnouncement({ id, employeeId: 'emp-001' }).then((res: any) => {
      if (selectedAnn && selectedAnn.id === id) {
        setSelectedAnn((prev: any) => prev ? { ...prev, liked: res.liked, likes: res.likesCount } : null);
      }
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    await createAnnouncement({
      title: newTitle,
      content: newContent,
      category: newCategory,
      priority: newPriority,
      requiresAcknowledgment: newRequiresAck,
      expiryDate: newExpiryDate || undefined,
      publishedBy: activeRole === 'HR' ? 'Priya Sharma (HR)' : 'David Williams (Admin)',
      visibilityScope: 'global',
      targetDepartments: []
    });
    setIsCreateOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewCategory('general');
    setNewPriority('medium');
    setNewRequiresAck(false);
    setNewExpiryDate('');
  };

  const filtered = tab === 'all' ? anns : tab === 'action' ? anns.filter(a => a.requiresAcknowledgment && !a.acknowledged) : anns.filter(a => a.priority === 'critical');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {selectedAnn && (
        <AnnouncementDetail
          ann={selectedAnn}
          liked={anns.find(a => a.id === selectedAnn.id)?.liked || false}
          onClose={() => setSelectedAnn(null)}
          onAcknowledge={handleAck}
          onLike={handleLike}
        />
      )}

      {isCreateOpen && (
        <div className="modal-overlay modal-center">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Create Announcement</h2>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Title</label>
                <input type="text" required placeholder="Enter title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Content</label>
                <textarea required rows={4} placeholder="Enter announcement details..." value={newContent} onChange={e => setNewContent(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'white' }}>
                    <option value="general">General</option>
                    <option value="policy">Policy</option>
                    <option value="event">Event</option>
                    <option value="celebration">Celebration</option>
                    <option value="compliance">Compliance</option>
                    <option value="hr-update">HR Update</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Priority</label>
                  <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'white' }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input type="checkbox" id="requiresAck" checked={newRequiresAck} onChange={e => setNewRequiresAck(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <label htmlFor="requiresAck" style={{ fontSize: '0.8rem', color: '#334155', cursor: 'pointer', fontWeight: 500 }}>Requires Employee Acknowledgment</label>
              </div>
              {newRequiresAck && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Expiry / Action Due Date</label>
                  <input type="date" required={newRequiresAck} value={newExpiryDate} onChange={e => setNewExpiryDate(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                </div>
              )}
              <button type="submit" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-lg)', border: 'none', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', marginTop: 10 }}>
                Publish Announcement
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ background: 'linear-gradient(160deg, #0f766e 0%, #0d9488 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Announcements</h1>
            <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>
              {pendingAction > 0 ? `⚠️ ${pendingAction} action${pendingAction > 1 ? 's' : ''} required` : 'All caught up! ✅'}
            </p>
          </div>
          {canPost && (
            <button
              onClick={() => setIsCreateOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', background: 'white', color: '#0d9488', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>
              <Plus size={16} /> Post
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          <button className={`tab-item ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All ({anns.length})</button>
          <button className={`tab-item ${tab === 'action' ? 'active' : ''}`} onClick={() => setTab('action')}>Action Required{pendingAction > 0 ? ` (${pendingAction})` : ''}</button>
          <button className={`tab-item ${tab === 'critical' ? 'active' : ''}`} onClick={() => setTab('critical')}>Critical</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(ann => {
            const priority = priorityConfig[ann.priority] || priorityConfig.medium;
            return (
              <div key={ann.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: `1px solid ${ann.requiresAcknowledgment && !ann.acknowledged ? '#fed7aa' : 'rgb(var(--color-border)/0.5)'}`, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onClick={() => setSelectedAnn(ann)}>
                {ann.requiresAcknowledgment && !ann.acknowledged && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: priority.color }} />
                )}
                <div style={{ paddingLeft: ann.requiresAcknowledgment && !ann.acknowledged ? '0.5rem' : 0 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: '0.625rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: priority.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', flexShrink: 0 }}>
                      {categoryEmoji[ann.category] || '📰'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: priority.color, background: priority.bg, padding: '2px 7px', borderRadius: 999 }}>{priority.badge}</span>
                        {ann.acknowledged && <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700 }}>✓ Ack'd</span>}
                      </div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>{ann.title}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>
                        {ann.publishedBy} · {new Date(ann.publishedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <ChevronRight size={18} color="rgb(var(--color-muted-foreground))" style={{ flexShrink: 0 }} />
                  </div>
                  <p style={{ margin: '0 0 0.625rem', fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))', lineHeight: 1.4 }} className="line-clamp-2">{ann.content}</p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))', display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={12} />{ann.views}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>❤️ {ann.likes}</span>
                    {ann.requiresAcknowledgment && (
                      <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, color: ann.acknowledged ? '#16a34a' : '#f97316', background: ann.acknowledged ? '#d1fae5' : '#fff7ed', padding: '3px 8px', borderRadius: 999 }}>
                        {ann.acknowledged ? '✓ Acknowledged' : '⚡ Action Needed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
