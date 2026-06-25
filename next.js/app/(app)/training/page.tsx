'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { trainingModules } from '../../../data/training';
import { BookOpen, CheckCircle2, Clock, Play, FileText, HelpCircle, Zap, Award, X } from 'lucide-react';
import type { TrainingModule, TrainingContent } from '../../../data/types';
import { useTraining } from '../../../hooks/useTraining';

const contentTypeIcon: Record<string, React.ReactNode> = {
  video: <Play size={14} color="#dc2626" />,
  document: <FileText size={14} color="#0891b2" />,
  quiz: <HelpCircle size={14} color="#8b5cf6" />,
  interactive: <Zap size={14} color="#f97316" />,
};
const contentTypeBg: Record<string, string> = { video: '#fee2e2', document: '#dbeafe', quiz: '#ede9fe', interactive: '#fff7ed' };

const categoryColor: Record<string, string> = {
  orientation: '#0d9488', technical: '#6366f1', compliance: '#dc2626',
  'soft-skills': '#f97316', product: '#8b5cf6',
};

function ModuleDetailModal({ module, onClose, onProgress }: { module: TrainingModule; onClose: () => void; onProgress: (moduleId: string, contentId: string) => void }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', background: categoryColor[module.category], padding: '2px 8px', borderRadius: 999, textTransform: 'capitalize' }}>{module.category}</span>
            <h2 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1rem', fontWeight: 800 }}>{module.title}</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{module.durationMinutes} min · Due {new Date(module.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={16} color="#64748b" /></button>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Overall progress</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: categoryColor[module.category] }}>{module.progress}%</span>
          </div>
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: categoryColor[module.category], borderRadius: 999, width: `${module.progress}%` }} />
          </div>
        </div>

        {module.isCertificateEligible && module.status === 'completed' && (
          <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: 'var(--radius-lg)', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <Award size={20} color="#d97706" />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#92400e' }}>Certificate Earned! 🎉</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#92400e' }}>Tap to download your certificate</p>
            </div>
          </div>
        )}

        <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', fontWeight: 700 }}>Content ({module.contents.filter(c => c.completed).length}/{module.contents.length} completed)</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {module.contents.map((content: TrainingContent, i: number) => (
            <div key={content.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem',
              background: content.completed ? '#f0fdfa' : '#f8fafc',
              borderRadius: 'var(--radius-lg)', border: `1px solid ${content.completed ? '#99f6e4' : 'rgb(var(--color-border)/0.5)'}`,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: content.completed ? '#ccfbf1' : contentTypeBg[content.type], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {content.completed ? <CheckCircle2 size={16} color="#0d9488" /> : contentTypeIcon[content.type]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: content.completed ? '#0d9488' : 'inherit', textDecoration: content.completed ? 'line-through' : 'none' }}>{content.title}</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>
                  {content.type.charAt(0).toUpperCase() + content.type.slice(1)} · {content.duration} min
                </p>
              </div>
              {!content.completed && (
                <button
                  onClick={() => onProgress(module.id, content.id)}
                  style={{ padding: '0.375rem 0.75rem', borderRadius: 999, border: 'none', background: categoryColor[module.category], color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 }}>
                  {content.type === 'video' ? '▶ Watch' : content.type === 'quiz' ? '📝 Start' : content.type === 'interactive' ? '⚡ Launch' : '📖 Read'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TrainingPage() {
  const { setCurrentView } = useHrmsStore();
  const { modules: apiModules, updateProgress } = useTraining('emp-001');
  const modules = apiModules.length > 0 ? apiModules : trainingModules;

  const [activeTab, setActiveTab] = useState<'all' | 'mandatory' | 'in-progress' | 'completed'>('all');
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  useEffect(() => { setCurrentView('training'); }, [setCurrentView]);

  const handleProgress = (moduleId: string, contentId: string) => {
    updateProgress({ id: moduleId, contentId, completed: true });
    if (selectedModule) {
      setSelectedModule(prev => {
        if (!prev) return null;
        const updatedContents = prev.contents.map(c => c.id === contentId ? { ...c, completed: true } : c);
        const completedCount = updatedContents.filter(c => c.completed).length;
        const progress = Math.round((completedCount / updatedContents.length) * 100);
        const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';
        return { ...prev, contents: updatedContents, progress, status };
      });
    }
  };

  const filtered = activeTab === 'all' ? modules : activeTab === 'mandatory' ? modules.filter(m => m.isMandatory) : modules.filter(m => m.status === activeTab);
  const completedCount = modules.filter(m => m.status === 'completed').length;
  const mandatoryPending = modules.filter(m => m.isMandatory && m.status !== 'completed').length;

  return (
    <div className="animate-fade-in">
      {selectedModule && (
        <ModuleDetailModal
          module={(modules.find(m => m.id === selectedModule.id) || selectedModule) as any}
          onClose={() => setSelectedModule(null)}
          onProgress={handleProgress}
        />
      )}

      <div style={{ background: 'linear-gradient(160deg, #1d4ed8 0%, #3b82f6 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Training & Learning</h1>
        <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: '0 0 1rem' }}>Your learning journey</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Completed', value: completedCount, color: '#86efac' },
            { label: 'Mandatory Left', value: mandatoryPending, color: mandatoryPending > 0 ? '#fde68a' : '#86efac' },
            { label: 'Total Modules', value: modules.length, color: 'white' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgb(255 255 255 / 0.15)', borderRadius: 'var(--radius-lg)', padding: '0.625rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: s.color }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgb(255 255 255 / 0.8)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          {(['all', 'mandatory', 'in-progress', 'completed'] as const).map(t => (
            <button key={t} className={`tab-item ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ fontSize: '0.7rem' }}>
              {t === 'all' ? 'All' : t === 'mandatory' ? 'Required' : t === 'in-progress' ? 'In Progress' : 'Done'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(m => {
            const color = categoryColor[m.category];
            return (
              <div key={m.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedModule(m as any)}>
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={20} color={color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        {m.isMandatory && <span style={{ fontSize: '0.6rem', fontWeight: 700, background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: 4 }}>Required</span>}
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white', background: color, padding: '1px 6px', borderRadius: 4, textTransform: 'capitalize' }}>{m.category}</span>
                        {m.isCertificateEligible && <span style={{ fontSize: '0.6rem', fontWeight: 700, background: '#fef3c7', color: '#d97706', padding: '1px 6px', borderRadius: 4 }}>🏅 Certificate</span>}
                      </div>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>{m.title}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>
                        {m.durationMinutes} min · Due {new Date(m.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ position: 'relative', width: 42, height: 42, flexShrink: 0 }}>
                      <svg width="42" height="42" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="21" cy="21" r="17" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                        <circle cx="21" cy="21" r="17" fill="none" stroke={color} strokeWidth="3.5"
                          strokeDasharray={`${2 * Math.PI * 17}`}
                          strokeDashoffset={`${2 * Math.PI * 17 * (1 - m.progress / 100)}`}
                          strokeLinecap="round" />
                      </svg>
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color }}>
                        {m.status === 'completed' ? '✓' : `${m.progress}%`}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '0.625rem 1rem', background: '#f8fafc', borderTop: '1px solid rgb(var(--color-border)/0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{m.contents.filter(c => c.completed).length}/{m.contents.length} items done</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>
                    {m.status === 'completed' ? '✅ Completed' : m.status === 'in-progress' ? 'Continue →' : 'Start →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
