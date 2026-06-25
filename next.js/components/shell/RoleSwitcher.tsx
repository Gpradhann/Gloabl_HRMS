'use client';
import { useHrmsStore, UserRole } from '../../stores/hrmsStore';
import { ChevronDown, User, Users, Shield, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const roles: { role: UserRole; label: string; icon: React.ComponentType<{ size?: number }>; color: string; desc: string }[] = [
  { role: 'Employee', label: 'Employee', icon: User, color: '#0d9488', desc: 'Sarah Johnson' },
  { role: 'Manager', label: 'Manager', icon: Users, color: '#6366f1', desc: 'Michael Chen' },
  { role: 'HR', label: 'HR Specialist', icon: Shield, color: '#f97316', desc: 'Priya Sharma' },
  { role: 'Admin', label: 'Admin', icon: Settings, color: '#8b5cf6', desc: 'David Williams' },
];

export function RoleSwitcher() {
  const { activeRole, setRole } = useHrmsStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = roles.find(r => r.role === activeRole)!;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px', borderRadius: 'var(--radius-lg)',
          border: `1.5px solid ${current.color}30`,
          background: `${current.color}10`,
          cursor: 'pointer', transition: 'all 0.2s',
        }}
        aria-label="Switch role"
        aria-expanded={open}
      >
        <span style={{
          width: 20, height: 20, borderRadius: '50%',
          background: current.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <current.icon size={11} />
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: current.color }}>
          {current.role}
        </span>
        <ChevronDown size={13} color={current.color} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'white', borderRadius: 'var(--radius-xl)',
          border: '1px solid rgb(var(--color-border) / 0.5)',
          boxShadow: 'var(--shadow-lg)', zIndex: 200, width: 200,
          animation: 'slide-down 0.2s ease-out',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '8px 12px 4px', borderBottom: '1px solid rgb(var(--color-border)/0.5)' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgb(var(--color-muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Switch Role</p>
          </div>
          {roles.map(r => (
            <button
              key={r.role}
              onClick={() => { setRole(r.role); setOpen(false); window.location.href = '/home'; }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', background: activeRole === r.role ? `${r.color}0e` : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (activeRole !== r.role) (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = activeRole === r.role ? `${r.color}0e` : 'transparent'; }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <r.icon size={14} />
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: activeRole === r.role ? r.color : 'var(--foreground)', margin: 0 }}>{r.label}</p>
                <p style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))', margin: 0 }}>{r.desc}</p>
              </div>
              {activeRole === r.role && (
                <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
