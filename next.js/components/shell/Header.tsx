'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useHrmsStore } from '../../stores/hrmsStore';
import { RoleSwitcher } from './RoleSwitcher';
import { Bell, Zap } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationPanel } from './NotificationPanel';

export function Header() {
  const { activeRole, isOnboarding } = useHrmsStore();
  const { unreadCount } = useNotifications(activeRole);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="app-header" role="banner">
      {/* Logo */}
      <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 'auto' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg, #0d9488, #f97316)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgb(13 148 136 / 0.35)',
        }}>
          <Zap size={18} color="white" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ color: '#000000' }}>Work</span><span style={{ color: '#000000' }}>Flow</span>
        </span>
        {isOnboarding && (
          <span style={{
            fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999,
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: 'white',
            boxShadow: '0 2px 6px rgb(124 58 237 / 0.2)',
          }}>Onboarding</span>
        )}
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <RoleSwitcher />
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'relative', width: 38, height: 38,
            borderRadius: 'var(--radius-lg)', border: '1px solid rgb(var(--color-border)/0.6)',
            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          aria-label={`Notifications (${unreadCount} unread)`}
          onMouseEnter={e => (e.currentTarget.style.background = '#f0fdfa')}
          onMouseLeave={e => (e.currentTarget.style.background = 'white')}
        >
          <Bell size={18} color="#64748b" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: '#f97316', border: '1.5px solid white',
            }} />
          )}
        </button>

        {isOpen && (
          <NotificationPanel onClose={() => setIsOpen(false)} />
        )}
      </div>
    </header>
  );
}
