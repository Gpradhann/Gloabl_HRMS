'use client';
import { useEffect, useState } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { onboardingData as defaultOnboarding } from '../../../data/onboarding';
import { CheckCircle2, Clock, AlertCircle, Play, X, ChevronDown, ChevronUp, MapPin, Users, Phone, FileText, ClipboardList, BookOpen, Send, Plus } from 'lucide-react';
import type { OnboardingTask } from '../../../data/types';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';

const phaseConfig: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  'pre-joining': { color: '#7c3aed', bg: '#ede9fe', label: 'Pre-Joining', icon: '📋' },
  'day-1':       { color: '#0d9488', bg: '#ccfbf1', label: 'Day 1', icon: '🎉' },
  'week-1':      { color: '#0891b2', bg: '#cffafe', label: 'Week 1', icon: '🚀' },
  'week-2':      { color: '#3b82f6', bg: '#dbeafe', label: 'Week 2', icon: '📅' },
  'month-1':     { color: '#f97316', bg: '#ffedd5', label: 'Month 1', icon: '⭐' },
};

function TaskItem({ task, onComplete, isEmployeeTask, isCompleted }: { task: OnboardingTask; onComplete: (id: string) => void; isEmployeeTask: boolean; isCompleted: boolean }) {
  const priorityColor: Record<string, string> = {
    high: '#ef4444',
    medium: '#f97316',
    low: '#64748b'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '0.875rem',
      background: isCompleted ? 'rgba(13, 148, 136, 0.03)' : 'white',
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${isCompleted ? '#99f6e4' : 'rgb(var(--color-border)/0.5)'}`,
      marginBottom: 10,
      boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
    }}>
      <div style={{ marginTop: 2, flexShrink: 0 }}>
        {isCompleted ? (
          <CheckCircle2 size={18} color="#0d9488" />
        ) : task.status === 'in-progress' ? (
          <Clock size={18} color="#d97706" />
        ) : (
          <AlertCircle size={18} color="#94a3b8" />
        )}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
          <p style={{
            margin: 0,
            fontWeight: 700,
            fontSize: '0.875rem',
            textDecoration: isCompleted ? 'line-through' : 'none',
            color: isCompleted ? '#94a3b8' : 'var(--foreground)'
          }}>
            {task.title}
          </p>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '1px 5px',
            borderRadius: 4,
            background: `${priorityColor[task.priority || 'medium']}15`,
            color: priorityColor[task.priority || 'medium']
          }}>
            {task.priority || 'medium'}
          </span>
        </div>
        
        <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))', lineHeight: 1.4 }}>
          {task.description}
        </p>
        
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
          <span>👤 Assignee: <strong style={{ color: '#334155' }}>{task.assignee}</strong></span>
          {task.dueDate && <span>📅 Due {new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>}
          {isCompleted && task.completedDate && (
            <span style={{ color: '#0d9488', fontWeight: 600 }}>
              ✓ Completed {new Date(task.completedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
      
      {!isCompleted && (
        <div style={{ flexShrink: 0 }}>
          {isEmployeeTask ? (
            <button onClick={() => onComplete(task.id)} style={{
              padding: '0.375rem 0.75rem',
              borderRadius: 999,
              border: 'none',
              background: '#0d9488',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.7rem',
              boxShadow: '0 2px 4px rgba(13, 148, 136, 0.15)'
            }}>Done</button>
          ) : (
            <span style={{
              fontSize: '0.65rem',
              color: '#64748b',
              background: '#f1f5f9',
              padding: '3px 8px',
              borderRadius: 999,
              fontWeight: 600
            }}>
              Pending {task.assignee.split(' ')[0]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function WelcomeVideoModal({ senderName, messageText, onClose }: { senderName: string; messageText: string; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return 100;
          }
          return p + 1;
        });
      }, 450);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlaying) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(messageText);
          const voices = window.speechSynthesis.getVoices();
          const engVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) || voices.find(v => v.lang.startsWith('en'));
          if (engVoice) utterance.voice = engVoice;
          
          utterance.rate = 1.0;
          utterance.onend = () => {
            setIsPlaying(false);
            setProgress(100);
          };
          window.speechSynthesis.speak(utterance);
        }
      } else {
        window.speechSynthesis.pause();
      }
    }
    
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, messageText]);

  return (
    <div className="modal-overlay modal-center" style={{ zIndex: 1000 }}>
      <div style={{
        width: '90%',
        maxWidth: 380,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem', color: '#1e1b4b' }}>Video Message from {senderName}</p>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="#64748b" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#090514', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {senderName === 'Arun Krishnamurthy' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/arun_ceo.png" alt="Arun Krishnamurthy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isPlaying ? 0.9 : 0.6, transition: 'opacity 0.3s' }} />
          ) : (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, #7c3aed 0%, #090514 100%)',
              opacity: isPlaying ? 0.75 : 0.4,
              transition: 'opacity 0.5s'
            }} />
          )}

          {/* Scanline Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            opacity: 0.15
          }} />
          
          {isPlaying ? (
            <div style={{ position: 'absolute', bottom: 15, right: 15, display: 'flex', gap: 4, alignItems: 'center', zIndex: 2, background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 6 }}>
              {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                <div key={i} style={{
                  width: 3,
                  height: h * 5,
                  background: '#10b981',
                  borderRadius: 1,
                  animation: `bounce-gentle 1s ${i * 0.1}s ease-in-out infinite`
                }} />
              ))}
              <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audio Playing</span>
            </div>
          ) : (
            <button onClick={() => { if (progress >= 100) setProgress(0); setIsPlaying(true); }} style={{
              position: 'absolute', zIndex: 3, width: 52, height: 52, borderRadius: '50%', background: 'white', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <Play size={20} fill="#7c3aed" color="#7c3aed" style={{ marginLeft: 3 }} />
            </button>
          )}

          <div style={{ position: 'absolute', bottom: 10, left: 12, zIndex: 3, color: 'white', fontSize: '0.65rem', fontWeight: 600, background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4 }}>
            {Math.floor((progress / 100) * 45).toString().padStart(2, '0')}:{(Math.floor(progress % 10) * 6).toString().padStart(2, '0')} / 00:45
          </div>
          <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 3, color: 'white', fontSize: '0.65rem', fontWeight: 700, background: isPlaying ? '#ef4444' : '#64748b', padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, transition: 'background 0.3s' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'inline-block', animation: isPlaying ? 'pulse 1s infinite' : 'none' }}></span> {isPlaying ? 'Streaming message' : 'Paused'}
          </div>
        </div>

        {/* Controls */}
        <div style={{ padding: '1rem' }}>
          <div style={{ width: '100%', height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden', marginBottom: '1rem', cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setProgress(Math.round((clickX / rect.width) * 100));
            }}>
            <div style={{ height: '100%', background: '#7c3aed', width: `${progress}%` }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => setIsPlaying(!isPlaying)} style={{
              padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-lg)', border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)'
            }}>
              {isPlaying ? 'Pause message' : 'Resume message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { setCurrentView, setIsOnboarding } = useHrmsStore();
  const queryClient = useQueryClient();
  const { onboardingData: apiOnboarding, completeTask, completeOnboarding } = useOnboarding('emp-011');
  const onboardingData = apiOnboarding || defaultOnboarding;

  const tasks = onboardingData.tasks || [];
  const [expandedPhase, setExpandedPhase] = useState<string | null>('pre-joining');
  const [tab, setTab] = useState<'tasks' | 'welcome' | 'team' | 'relocation' | 'milestones'>('tasks');
  const [playingVideoSender, setPlayingVideoSender] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');

  useEffect(() => { setCurrentView('onboarding'); }, [setCurrentView]);

  // Mutations for connections and tickets
  const markMetMutation = useMutation({
    mutationFn: (args: { memberId: string }) =>
      apiClient.patch<{ success: boolean; data: any }>(`/api/onboarding/team/${args.memberId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: (args: { subject: string }) =>
      apiClient.post<{ success: boolean; data: any }>(`/api/onboarding/relocation/tickets`, { subject: args.subject }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });

  const handleComplete = (taskId: string) => {
    completeTask({ taskId });
  };

  const handleCompleteOnboarding = async () => {
    await completeOnboarding();
    setIsOnboarding(false);
    setCurrentView('home');
    window.location.href = '/home';
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : onboardingData.progressPercent;
  const phases = ['pre-joining', 'day-1', 'week-1', 'week-2', 'month-1'] as const;

  const employeeTasks = tasks.filter(t => t.assignee === onboardingData.name);
  const employeeDoneCount = employeeTasks.filter(t => t.status === 'completed').length;
  const isEmployeeAllDone = employeeTasks.length > 0 && employeeDoneCount === employeeTasks.length;

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
        <div className="tab-bar" style={{ marginBottom: '1rem', overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 6 }}>
          <button className={`tab-item ${tab === 'tasks' ? 'active' : ''}`} onClick={() => setTab('tasks')} style={{ flexShrink: 0 }}>Checklist</button>
          <button className={`tab-item ${tab === 'welcome' ? 'active' : ''}`} onClick={() => setTab('welcome')} style={{ flexShrink: 0 }}>Welcomes</button>
          <button className={`tab-item ${tab === 'team' ? 'active' : ''}`} onClick={() => setTab('team')} style={{ flexShrink: 0 }}>Meet Team</button>
          <button className={`tab-item ${tab === 'relocation' ? 'active' : ''}`} onClick={() => setTab('relocation')} style={{ flexShrink: 0 }}>Relocation</button>
          <button className={`tab-item ${tab === 'milestones' ? 'active' : ''}`} onClick={() => setTab('milestones')} style={{ flexShrink: 0 }}>Milestones</button>
        </div>

        {tab === 'tasks' && (
          <div>
            {phases.map(phase => {
              const phaseTasks = tasks.filter(t => t.phase === phase);
              const doneCount = phaseTasks.filter(t => t.status === 'completed').length;
              const cfg = phaseConfig[phase];
              const isExpanded = expandedPhase === phase;

              if (phaseTasks.length === 0) return null;

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
                        {phaseTasks.map(t => (
                          <TaskItem
                            key={t.id}
                            task={t as any}
                            onComplete={handleComplete}
                            isEmployeeTask={t.assignee === onboardingData.name}
                            isCompleted={t.status === 'completed'}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Onboarding completion transition card */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #ede9fe 0%, #fae8ff 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #ddd6fe',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.05)',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '0.9375rem', color: '#5b21b6' }}>Ready to join the main team? 🚀</h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#7c3aed', lineHeight: 1.4 }}>
                {isEmployeeAllDone 
                  ? "Congratulations! You have completed all your personal onboarding checklist tasks. You can now transition into the standard employee dashboard."
                  : `You have completed ${employeeDoneCount} of ${employeeTasks.length} personal tasks. You can complete the checklist later or transition to the main portal now.`}
              </p>
              <button onClick={handleCompleteOnboarding} style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(124, 58, 237, 0.25)',
              }}>
                Complete Onboarding & Enter WorkFlow
              </button>
            </div>
          </div>
        )}

        {tab === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {onboardingData.welcomeMessages.map(msg => (
              <div key={msg.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>{msg.avatarInitials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem' }}>{msg.senderName}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{msg.senderRole}</p>
                  </div>
                  {msg.hasVideo && (
                    <button onClick={() => setPlayingVideoSender(msg.senderName)} style={{
                      marginLeft: 'auto', border: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                      borderRadius: 999, background: '#fee2e2', color: '#dc2626', fontSize: '0.7rem', fontWeight: 800,
                      cursor: 'pointer', height: 'fit-content'
                    }}>
                      <Play size={10} fill="#dc2626" color="#dc2626" /> Play Video
                    </button>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, fontStyle: 'italic', color: 'rgb(var(--color-muted-foreground))' }}>&quot;{msg.message}&quot;</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'team' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {onboardingData.teamIntroductions.map(member => {
              const isMet = member.introductionStatus === 'done';
              return (
                <div key={member.employeeId} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: '0.75rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>{member.initials}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem' }}>{member.name}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{member.designation}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: isMet ? '#e6f4ea' : '#f1f5f9', color: isMet ? '#137333' : '#5f6368', height: 'fit-content' }}>
                        {isMet ? '✓ Met' : 'Pending'}
                      </span>
                      <button
                        onClick={() => markMetMutation.mutate({ memberId: member.employeeId })}
                        disabled={markMetMutation.isPending}
                        style={{
                          border: 'none', background: isMet ? '#f8fafc' : '#7c3aed',
                          color: isMet ? '#475569' : 'white', fontSize: '0.65rem', fontWeight: 700,
                          padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                          boxShadow: isMet ? 'none' : '0 1px 4px rgba(124, 58, 237, 0.15)',
                          borderWidth: isMet ? 1 : 0, borderStyle: 'solid', borderColor: '#cbd5e1'
                        }}
                      >
                        {isMet ? 'Mark Pending' : 'Mark as Met'}
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 0.625rem', fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))', lineHeight: 1.4 }}>{member.bio}</p>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {(member.expertise || []).map((e: any) => <span key={e} style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600 }}>{e}</span>)}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#8b5cf6', background: '#f5f3ff', padding: '0.375rem 0.625rem', borderRadius: 8 }}>🎯 Fun fact: {member.funFact}</p>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'relocation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Relocation details card */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 800, fontSize: '0.875rem', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Relocation Coordination</p>
              {[
                { label: 'Relocation Support Status', value: onboardingData.relocationSupport?.accommodationStatus || 'Confirmed', badge: true, color: '#0d9488' },
                { label: 'Visa Status', value: onboardingData.relocationSupport?.visaStatus || 'Not Required', badge: true, color: '#f97316' },
                { label: 'Travel Booking', value: onboardingData.relocationSupport?.travelBookingStatus || 'Confirmed', badge: true, color: '#3b82f6' },
                { label: 'Relocation Allowance', value: onboardingData.relocationSupport ? `${onboardingData.relocationSupport.currency === 'INR' ? '₹' : '$'}${onboardingData.relocationSupport.allowanceAmount.toLocaleString('en-IN')}` : 'N/A' },
                { label: 'Local Buddy Coordinator', value: onboardingData.relocationSupport?.localBuddy || 'N/A' },
                { label: 'Buddy Contact Number', value: onboardingData.relocationSupport?.localBuddyContact || 'N/A', tel: true },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: i < 5 ? '1px solid rgb(var(--color-border)/0.15)' : 'none' }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{r.label}</span>
                  {r.badge ? (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${r.color}15`, color: r.color }}>{r.value}</span>
                  ) : r.tel ? (
                    <a href={`tel:${r.value}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed', textDecoration: 'none' }}>{r.value} 📞</a>
                  ) : (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{r.value}</span>
                  )}
                </div>
              ))}
              {onboardingData.relocationSupport?.accommodationAddress && (
                <div style={{ marginTop: '0.75rem', padding: '0.625rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
                  📍 <strong>Accommodation Address:</strong> {onboardingData.relocationSupport.accommodationAddress}
                </div>
              )}
            </div>

            {/* Support tickets card */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
              <p style={{ margin: '0 0 0.875rem', fontWeight: 800, fontSize: '0.875rem', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Relocation Support Tickets</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.25rem' }}>
                {(onboardingData.relocationSupport?.tickets || []).length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>No relocation tickets submitted.</p>
                ) : (
                  onboardingData.relocationSupport.tickets.map((t: any) => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.02)' }}>
                      <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8125rem', color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{t.subject}</p>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>ID: {t.id}</p>
                      </div>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: t.status === 'resolved' ? '#e6f4ea' : '#fff7ed',
                        color: t.status === 'resolved' ? '#137333' : '#d97706'
                      }}>
                        {t.status === 'resolved' ? 'Resolved' : 'In Progress'}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Create ticket form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!ticketSubject.trim()) return;
                createTicketMutation.mutate({ subject: ticketSubject });
                setTicketSubject('');
              }} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Need relocation help? (e.g. Bedding swap)"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  style={{
                    flex: 1,
                    fontSize: '0.75rem',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgb(var(--color-border))',
                    outline: 'none'
                  }}
                />
                <button type="submit" disabled={createTicketMutation.isPending || !ticketSubject.trim()} style={{
                  background: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  padding: '0 16px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  opacity: (!ticketSubject.trim() || createTicketMutation.isPending) ? 0.6 : 1,
                  boxShadow: '0 2px 6px rgba(124,58,237,0.15)'
                }}>
                  {createTicketMutation.isPending ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}

        {tab === 'milestones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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

      {/* Video Modal Overlay */}
      {playingVideoSender && (
        <WelcomeVideoModal
          senderName={playingVideoSender}
          messageText={onboardingData.welcomeMessages.find(m => m.senderName === playingVideoSender)?.message || ''}
          onClose={() => setPlayingVideoSender(null)}
        />
      )}
    </div>
  );
}
