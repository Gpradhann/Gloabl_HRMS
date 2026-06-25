'use client';
import { useEffect, useState } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { onboardingData as defaultOnboarding } from '../../../data/onboarding';
import { CheckCircle2, Clock, AlertCircle, Play, X, ChevronDown, ChevronUp, MapPin, Users } from 'lucide-react';
import type { OnboardingTask } from '../../../data/types';
import { useOnboarding } from '../../../hooks/useOnboarding';

const phaseConfig: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  'pre-joining': { color: '#7c3aed', bg: '#ede9fe', label: 'Pre-Joining', icon: '📋' },
  'day-1':       { color: '#0d9488', bg: '#ccfbf1', label: 'Day 1', icon: '🎉' },
  'week-1':      { color: '#0891b2', bg: '#cffafe', label: 'Week 1', icon: '🚀' },
  'month-1':     { color: '#f97316', bg: '#ffedd5', label: 'Month 1', icon: '⭐' },
};

function TaskItem({ task, onComplete }: { task: OnboardingTask; onComplete: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '0.75rem', background: task.status === 'completed' ? '#f0fdfa' : '#f8fafc', borderRadius: 'var(--radius-lg)', border: `1px solid ${task.status === 'completed' ? '#99f6e4' : 'rgb(var(--color-border)/0.5)'}`, marginBottom: 8 }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>
        {task.status === 'completed' ? <CheckCircle2 size={18} color="#0d9488" /> : task.status === 'in-progress' ? <Clock size={18} color="#d97706" /> : <AlertCircle size={18} color="#94a3b8" />}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.875rem', textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? '#94a3b8' : 'inherit' }}>{task.title}</p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{task.description}</p>
        {task.dueDate && <p style={{ margin: '3px 0 0', fontSize: '0.7rem', color: task.status !== 'completed' ? '#d97706' : 'rgb(var(--color-muted-foreground))' }}>📅 Due {new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>}
      </div>
      {task.status !== 'completed' && (
        <button onClick={() => onComplete(task.id)} style={{
          flexShrink: 0, padding: '0.375rem 0.625rem', borderRadius: 999, border: 'none',
          background: '#0d9488', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.7rem',
        }}>Done</button>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const { setCurrentView } = useHrmsStore();
  const { onboardingData: apiOnboarding, completeTask } = useOnboarding('emp-011');
  const onboardingData = apiOnboarding || defaultOnboarding;

  const tasks = onboardingData.tasks || [];
  const [expandedPhase, setExpandedPhase] = useState<string | null>('pre-joining');
  const [tab, setTab] = useState<'tasks' | 'welcome' | 'team' | 'milestones'>('tasks');
  useEffect(() => { setCurrentView('onboarding'); }, [setCurrentView]);

  const handleComplete = (taskId: string) => {
    completeTask({ taskId });
  };
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : onboardingData.progressPercent;
  const phases = ['pre-joining', 'day-1', 'week-1', 'month-1'] as const;

  return (
    <div className="animate-fade-in">
      {/* Onboarding header */}
      <div style={{ background: 'linear-gradient(160deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)', padding: '1.5rem 1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgb(255 255 255 / 0.06)' }} />
        <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Welcome, {onboardingData.name}! 🎉</h1>
        <p style={{ color: 'rgb(255 255 255 / 0.8)', fontSize: '0.8125rem', margin: '0 0 1rem' }}>{onboardingData.designation} · {onboardingData.department}</p>

        {/* Progress ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r="27" fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="5" />
              <circle cx="32" cy="32" r="27" fill="none" stroke="#fde68a" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 27}`}
                strokeDashoffset={`${2 * Math.PI * 27 * (1 - progress / 100)}`}
                strokeLinecap="round" />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.875rem', color: 'white' }}>{progress}%</span>
          </div>
          <div>
            <p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '0.9375rem' }}>{completedCount}/{tasks.length} tasks done</p>
            <p style={{ margin: '2px 0 0', color: 'rgb(255 255 255 / 0.8)', fontSize: '0.8rem' }}>Joining: {new Date(onboardingData.joiningDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <p style={{ margin: '2px 0 0', color: 'rgb(255 255 255 / 0.8)', fontSize: '0.8rem' }}>Buddy: {onboardingData.buddy}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          <button className={`tab-item ${tab === 'tasks' ? 'active' : ''}`} onClick={() => setTab('tasks')}>Tasks</button>
          <button className={`tab-item ${tab === 'welcome' ? 'active' : ''}`} onClick={() => setTab('welcome')}>Welcome</button>
          <button className={`tab-item ${tab === 'team' ? 'active' : ''}`} onClick={() => setTab('team')}>Meet Team</button>
          <button className={`tab-item ${tab === 'milestones' ? 'active' : ''}`} onClick={() => setTab('milestones')}>Milestones</button>
        </div>

        {tab === 'tasks' && (
          <div>
            {phases.map(phase => {
              const phaseTasks = tasks.filter(t => t.phase === phase);
              const doneCount = phaseTasks.filter(t => t.status === 'completed').length;
              const cfg = phaseConfig[phase];
              const isExpanded = expandedPhase === phase;

              return (
                <div key={phase} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: 10, overflow: 'hidden' }}>
                  <button onClick={() => setExpandedPhase(isExpanded ? null : phase)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0.875rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.125rem' }}>{cfg.icon}</span>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>{cfg.label}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{doneCount}/{phaseTasks.length} completed</p>
                    </div>
                    <div style={{ width: 48, height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden', marginRight: 8 }}>
                      <div style={{ height: '100%', background: cfg.color, borderRadius: 999, width: `${phaseTasks.length > 0 ? (doneCount / phaseTasks.length) * 100 : 0}%` }} />
                    </div>
                    {isExpanded ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                  </button>
                  {isExpanded && (
                    <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid rgb(var(--color-border)/0.3)' }}>
                      <div style={{ marginTop: '0.75rem' }}>
                        {phaseTasks.map(t => <TaskItem key={t.id} task={t as any} onComplete={handleComplete} />)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {onboardingData.welcomeMessages.map(msg => (
              <div key={msg.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>{msg.avatarInitials}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem' }}>{msg.senderName}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{msg.senderRole}</p>
                  </div>
                  {msg.hasVideo && <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: '#fee2e2', color: '#dc2626', fontSize: '0.7rem', fontWeight: 700, height: 'fit-content' }}><Play size={12} fill="#dc2626" />Video</span>}
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, fontStyle: 'italic', color: 'rgb(var(--color-muted-foreground))' }}>&quot;{msg.message}&quot;</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'team' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {onboardingData.teamIntroductions.map(member => (
              <div key={member.employeeId} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>{member.initials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem' }}>{member.name}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{member.designation}</p>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: member.introductionStatus === 'done' ? '#d1fae5' : '#f1f5f9', color: member.introductionStatus === 'done' ? '#059669' : '#64748b', height: 'fit-content' }}>
                    {member.introductionStatus === 'done' ? '✓ Met' : 'Pending'}
                  </span>
                </div>
                <p style={{ margin: '0 0 0.625rem', fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))', lineHeight: 1.4 }}>{member.bio}</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {(member.expertise || []).map((e: any) => <span key={e} style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600 }}>{e}</span>)}
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#8b5cf6', background: '#f5f3ff', padding: '0.375rem 0.625rem', borderRadius: 8 }}>🎯 Fun fact: {member.funFact}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'milestones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)', marginBottom: 4 }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '0.875rem', color: 'rgb(var(--color-muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Relocation Support</p>
              {[
                { label: 'Accommodation', value: onboardingData.relocationSupport?.accommodationAddress || 'N/A' },
                { label: 'Travel Booking', value: onboardingData.relocationSupport?.travelBookingStatus || 'N/A' },
                { label: 'Allowance', value: `₹${onboardingData.relocationSupport?.allowanceAmount.toLocaleString()}` },
                { label: 'Local Buddy', value: onboardingData.relocationSupport?.localBuddy || 'N/A' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 3 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{r.label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, maxWidth: '55%', textAlign: 'right' }}>{r.value}</span>
                </div>
              ))}
            </div>
            {onboardingData.milestones.map(m => (
              <div key={m.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '0.875rem 1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.25rem' }}>{m.type === 'celebration' ? '🎉' : m.type === 'check-in' ? '💬' : '📋'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{m.title}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{m.description}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>📅 {new Date(m.scheduledDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '3px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>Upcoming</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
