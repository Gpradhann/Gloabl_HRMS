'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { recognitions as defaultRecognitions } from '../../../data/recognition';
import { employees } from '../../../data/employees';
import { Heart, MessageCircle, Send, Plus, X } from 'lucide-react';
import type { RecognitionCategory } from '../../../data/types';
import { useRecognition } from '../../../hooks/useRecognition';

const categoryConfig: Record<RecognitionCategory, { emoji: string; color: string; bg: string; label: string }> = {
  excellence: { emoji: '🌟', color: '#d97706', bg: '#fef3c7', label: 'Excellence' },
  'team-player': { emoji: '🤝', color: '#0891b2', bg: '#cffafe', label: 'Team Player' },
  innovation: { emoji: '💡', color: '#7c3aed', bg: '#ede9fe', label: 'Innovation' },
  leadership: { emoji: '🚀', color: '#dc2626', bg: '#fee2e2', label: 'Leadership' },
  'customer-focus': { emoji: '❤️', color: '#db2777', bg: '#fce7f3', label: 'Customer Focus' },
};

function SendRecognitionModal({ onClose, onSend }: { onClose: () => void; onSend: (data: object) => void }) {
  const [recipient, setRecipient] = useState('');
  const [category, setCategory] = useState<RecognitionCategory>('excellence');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>🏆 Recognize a Colleague</h2>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#64748b" /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Recognize</label>
            <select value={recipient} onChange={e => setRecipient(e.target.value)} className="input-field">
              <option value="">Select a colleague...</option>
              {employees.filter(e => e.id !== 'emp-001').map(e => <option key={e.id} value={e.id}>{e.name} · {e.designation}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(Object.keys(categoryConfig) as RecognitionCategory[]).map(cat => {
                const c = categoryConfig[cat];
                return (
                  <button key={cat} onClick={() => setCategory(cat)} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.875rem',
                    borderRadius: 999, border: `2px solid ${category === cat ? c.color : 'transparent'}`,
                    background: category === cat ? c.bg : '#f8fafc',
                    cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', color: category === cat ? c.color : '#64748b',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    <span>{c.emoji}</span>{c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Your Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Share what they did that made a difference..." rows={4} className="input-field" style={{ resize: 'none' }} />
            <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>{message.length}/500 characters</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.625rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
            <input type="checkbox" id="public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            <label htmlFor="public" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Make this recognition public (visible to everyone)</label>
          </div>

          <button
            onClick={() => { if (recipient && message) { onSend({ recipient, category, message, isPublic }); onClose(); } }}
            disabled={!recipient || !message}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.875rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: (!recipient || !message) ? 0.5 : 1 }}
          >
            <Send size={18} /> Send Recognition 🎉
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecognitionPage() {
  const { setCurrentView } = useHrmsStore();
  const { recognitions: apiRecs, postRecognition, likeRecognition } = useRecognition();
  const recs = apiRecs.length > 0 ? apiRecs : defaultRecognitions;
  const [showModal, setShowModal] = useState(false);
  useEffect(() => { setCurrentView('recognition'); }, [setCurrentView]);

  const likedIds = new Set(
    recs
      .filter((r: any) => (Array.isArray(r.likedBy) ? r.likedBy.includes('emp-001') : r.liked))
      .map(r => r.id)
  );

  const toggleLike = (id: string) => {
    likeRecognition({ id, employeeId: 'emp-001' });
  };

  const handleSend = (data: any) => {
    const d = data as { recipient: string; category: RecognitionCategory; message: string; isPublic: boolean };
    const recipient = employees.find(e => e.id === d.recipient);
    postRecognition({
      fromEmployeeId: 'emp-001',
      fromEmployeeName: 'Sarah Johnson',
      fromEmployeeInitials: 'SJ',
      toEmployeeId: d.recipient,
      toEmployeeName: recipient?.name || '',
      toEmployeeInitials: recipient?.initials || '',
      category: d.category,
      message: d.message,
      isPublic: d.isPublic,
      fromColor: '#0d9488',
      toColor: recipient?.color || '#6366f1',
    });
  };

  return (
    <div className="animate-fade-in">
      {showModal && <SendRecognitionModal onClose={() => setShowModal(false)} onSend={handleSend} />}

      <div style={{ background: 'linear-gradient(160deg, #db2777 0%, #ec4899 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Recognition</h1>
            <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>Celebrate your colleagues</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', background: 'white', color: '#db2777', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>
            <Plus size={16} /> Recognize
          </button>
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        {/* Category legend */}
        <div className="scroll-row" style={{ marginBottom: '1rem' }}>
          {(Object.values(categoryConfig)).map(c => (
            <div key={c.label} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '0.35rem 0.75rem', borderRadius: 999, background: c.bg, border: `1px solid ${c.color}30` }}>
              <span style={{ fontSize: '0.8rem' }}>{c.emoji}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: c.color }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recs.map(r => {
            const cat = categoryConfig[r.category as RecognitionCategory] || categoryConfig['excellence'];
            const liked = likedIds.has(r.id);
            return (
              <div key={r.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', boxShadow: 'var(--shadow-card)' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: r.fromColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{r.fromEmployeeInitials}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 800 }}>{r.fromEmployeeName}</span>
                      <span style={{ color: 'rgb(var(--color-muted-foreground))' }}> recognized </span>
                      <span style={{ fontWeight: 800, color: r.toColor }}>{r.toEmployeeName}</span>
                    </p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>{new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: cat.bg, color: cat.color, padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                    {cat.emoji} {cat.label}
                  </span>
                </div>

                {/* Message */}
                <p style={{ margin: '0 0 0.875rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--foreground)' }}>{r.message}</p>

                {/* Reactions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: '0.625rem', borderTop: '1px solid rgb(var(--color-border)/0.3)' }}>
                  <button onClick={() => toggleLike(r.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '0.375rem 0.75rem', borderRadius: 999,
                    border: `1.5px solid ${liked ? '#ec4899' : 'rgb(var(--color-border))'}`,
                    background: liked ? '#fce7f3' : 'transparent', cursor: 'pointer',
                    color: liked ? '#db2777' : 'rgb(var(--color-muted-foreground))', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s',
                  }}>
                    <Heart size={14} fill={liked ? '#db2777' : 'none'} color={liked ? '#db2777' : 'rgb(var(--color-muted-foreground))'} />
                    {r.likesCount + (liked && !(r as any).liked ? 1 : 0)}
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.375rem 0.75rem', borderRadius: 999, border: '1.5px solid rgb(var(--color-border))', background: 'transparent', cursor: 'pointer', color: 'rgb(var(--color-muted-foreground))', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
                    <MessageCircle size={14} />{r.commentsCount}
                  </button>
                  {!r.isPublic && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>🔒 Private</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
