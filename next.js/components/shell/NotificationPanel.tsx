'use client';
import { useNotifications } from '../../hooks/useNotifications';
import { useHrmsStore } from '../../stores/hrmsStore';
import { Bell, Check, Trash2, X } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const activeRole = useHrmsStore((s) => s.activeRole);
  const { notifications, unreadCount, markAllRead, markRead, isLoading } = useNotifications(activeRole);

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'onboarding': return '#0d9488';
      case 'leave': return '#8b5cf6';
      case 'payroll': return '#f59e0b';
      case 'expense': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 56, right: 0, width: 340, maxHeight: 420,
      background: 'white', border: '1px solid rgb(var(--color-border)/0.8)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
      display: 'flex', flexDirection: 'column', zIndex: 100, overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid rgb(var(--color-border)/0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} color="#0d9488" />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Notifications ({unreadCount})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              style={{
                background: 'none', border: 'none', color: '#0d9488', fontSize: '0.75rem',
                fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
              }}
              title="Mark all read"
            >
              <Check size={12} />
              Read all
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 4 }}>
        {isLoading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', display: 'flex', justifyContent: 'center' }}>
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Bell size={32} color="#cbd5e1" />
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>All caught up!</span>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              style={{
                padding: '10px 12px', margin: '4px', borderRadius: 'var(--radius-md)',
                background: n.read ? 'transparent' : 'rgb(13 148 136 / 0.04)',
                borderLeft: `3px solid ${n.read ? 'transparent' : getCategoryColor(n.category)}`,
                cursor: n.read ? 'default' : 'pointer', transition: 'all 0.15s',
                display: 'flex', gap: 10, alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: getCategoryColor(n.category),
                marginTop: 6, flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontWeight: n.read ? 500 : 600, fontSize: '0.8125rem', color: '#1e293b' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8', flexShrink: 0 }}>
                    {n.timestamp ? n.timestamp.split('T')[0] : ''}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                  {n.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
