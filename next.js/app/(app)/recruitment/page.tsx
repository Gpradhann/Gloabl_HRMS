'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { jobPostings as defaultJobs, candidates as defaultCandidates } from '../../../data/recruitment';
import { Briefcase, Users, Star, ChevronRight, X, Calendar, MapPin, DollarSign, Clock, Plus } from 'lucide-react';
import type { Candidate, CandidateStatus } from '../../../data/types';
import { useRecruitment } from '../../../hooks/useRecruitment';

const statusColors: Record<CandidateStatus, { bg: string; color: string }> = {
  new: { bg: '#f1f5f9', color: '#64748b' },
  screening: { bg: '#dbeafe', color: '#1d4ed8' },
  shortlisted: { bg: '#cffafe', color: '#0891b2' },
  'interview-scheduled': { bg: '#fef3c7', color: '#d97706' },
  interviewed: { bg: '#ede9fe', color: '#7c3aed' },
  'offer-extended': { bg: '#fce7f3', color: '#be185d' },
  hired: { bg: '#d1fae5', color: '#059669' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
};

function CandidateDetail({ candidate, onClose, onStatusChange }: { candidate: Candidate; onClose: () => void; onStatusChange: (id: string, status: CandidateStatus) => void }) {
  const statusFlow: CandidateStatus[] = ['new', 'screening', 'shortlisted', 'interview-scheduled', 'interviewed', 'offer-extended', 'hired'];
  const currentIdx = statusFlow.indexOf(candidate.status as CandidateStatus);

  return (
    <div className="modal-overlay modal-center">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: candidate.color || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>{candidate.initials}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>{candidate.name}</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{candidate.appliedRole}</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#64748b" /></button>
        </div>

        <div style={{ display: 'flex', gap: 2, marginBottom: '0.75rem' }}>
          {[1,2,3,4,5].map(i => <Star key={i} size={18} color={i <= Math.round(candidate.rating) ? '#f97316' : '#e2e8f0'} fill={i <= Math.round(candidate.rating) ? '#f97316' : 'none'} />)}
          <span style={{ marginLeft: 6, fontSize: '0.875rem', fontWeight: 700 }}>{candidate.rating}/5</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
          {[
            { icon: <Briefcase size={14} color="#64748b" />, label: 'Experience', value: `${candidate.experienceYears} years` },
            { icon: <DollarSign size={14} color="#64748b" />, label: 'Expected CTC', value: `${candidate.currency === 'INR' ? '₹' : '$'}${candidate.expectedSalary.toLocaleString()}` },
            { icon: <Clock size={14} color="#64748b" />, label: 'Notice Period', value: `${candidate.noticePeriodDays} days` },
            { icon: <Calendar size={14} color="#64748b" />, label: 'Applied', value: new Date(candidate.appliedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) },
          ].map((d, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>{d.icon}<span style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>{d.label}</span></div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{d.value}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '0.875rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'rgb(var(--color-muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Skills</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {candidate.skills.map(s => <span key={s} style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>{s}</span>)}
          </div>
        </div>

        {candidate.notes && (
          <div style={{ marginBottom: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: '0.75rem' }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: 700, color: 'rgb(var(--color-muted-foreground))' }}>NOTES</p>
            <p style={{ margin: 0, fontSize: '0.8125rem' }}>{candidate.notes}</p>
          </div>
        )}

        {candidate.status !== 'hired' && candidate.status !== 'rejected' && (
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>Update Status</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { onStatusChange(candidate.id, 'rejected'); onClose(); }}
                style={{ flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #fca5a5', background: '#fff', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                ✕ Reject
              </button>
              {currentIdx < statusFlow.length - 1 && (
                <button
                  onClick={() => { onStatusChange(candidate.id, statusFlow[currentIdx + 1]); onClose(); }}
                  style={{ flex: 2, padding: '0.625rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                  → {statusFlow[currentIdx + 1].replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecruitmentPage() {
  const { setCurrentView, activeRole } = useHrmsStore();
  const [tab, setTab] = useState<'jobs' | 'pipeline'>('jobs');
  const { jobs: apiJobs, candidates: apiCandidates, addCandidate, updateCandidate } = useRecruitment();

  // Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newJobId, setNewJobId] = useState('');
  const [newExp, setNewExp] = useState(3);
  const [newSalary, setNewSalary] = useState(120000);
  const [newNotice, setNewNotice] = useState(30);
  const [newNotes, setNewNotes] = useState('');
  const [newSkillsStr, setNewSkillsStr] = useState('');

  const jobPostings = apiJobs.length > 0 ? apiJobs : defaultJobs;
  const cands = apiCandidates.length > 0 ? apiCandidates : defaultCandidates;

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  useEffect(() => { setCurrentView('recruitment'); }, [setCurrentView]);

  const canAccess = activeRole === 'HR' || activeRole === 'Admin';
  
  const handleStatusChange = (id: string, status: CandidateStatus) => {
    updateCandidate({ id, status });
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newJobId) return;

    const job = jobPostings.find(j => j.id === newJobId);
    const skills = newSkillsStr.split(',').map(s => s.trim()).filter(Boolean);

    await addCandidate({
      jobPostingId: newJobId,
      name: newName,
      email: newEmail,
      phone: newPhone,
      appliedRole: job?.title || 'Engineer',
      experienceYears: Number(newExp),
      expectedSalary: Number(newSalary),
      noticePeriodDays: Number(newNotice),
      notes: newNotes,
      skills,
      currency: 'USD',
      rating: 4.0,
      initials: newName.split(' ').map(n => n[0]).join('').toUpperCase()
    });

    setIsCreateOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewJobId('');
    setNewExp(3);
    setNewSalary(120000);
    setNewNotice(30);
    setNewNotes('');
    setNewSkillsStr('');
  };

  if (!canAccess) {
    return (
      <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
        <div style={{ background: 'linear-gradient(160deg, #0f766e 0%, #0d9488 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
          <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Internal Job Board</h1>
          <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>Explore internal opportunities</p>
        </div>
        <div style={{ padding: '0 1rem 1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {jobPostings.filter(j => j.status === 'active').map(job => (
            <div key={job.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem' }}>{job.title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{job.department}</p>
                </div>
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>Active</span>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}><MapPin size={12} />{job.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}><Briefcase size={12} />{job.experienceMin}–{job.experienceMax} yrs</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {job.requirements.slice(0, 4).map(r => <span key={r} style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600 }}>{r}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {selectedCandidate && (
        <CandidateDetail
          candidate={(cands.find(c => c.id === selectedCandidate.id) || selectedCandidate) as any}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Add Candidate Modal */}
      {isCreateOpen && (
        <div className="modal-overlay modal-center">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Add New Candidate</h2>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Full Name</label>
                <input type="text" required placeholder="John Doe" value={newName} onChange={e => setNewName(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Email</label>
                  <input type="email" required placeholder="john@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Phone</label>
                  <input type="text" placeholder="+1 555-0199" value={newPhone} onChange={e => setNewPhone(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Apply For Job</label>
                <select required value={newJobId} onChange={e => setNewJobId(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'white' }}>
                  <option value="">Select an open job...</option>
                  {jobPostings.map(j => <option key={j.id} value={j.id}>{j.title} ({j.department})</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Experience (Years)</label>
                  <input type="number" required min={0} value={newExp} onChange={e => setNewExp(Number(e.target.value))} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Notice Period (Days)</label>
                  <input type="number" required min={0} value={newNotice} onChange={e => setNewNotice(Number(e.target.value))} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Expected Salary ($)</label>
                <input type="number" required value={newSalary} onChange={e => setNewSalary(Number(e.target.value))} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Skills (comma-separated)</label>
                <input type="text" placeholder="React, Node.js, AWS" value={newSkillsStr} onChange={e => setNewSkillsStr(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Notes</label>
                <textarea rows={2} placeholder="Add interviewer feedback or notes..." value={newNotes} onChange={e => setNewNotes(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid rgb(var(--color-border))', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-lg)', border: 'none', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', marginTop: 10 }}>
                Submit Candidate Application
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ background: 'linear-gradient(160deg, #0f766e 0%, #0d9488 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Recruitment</h1>
            <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>Manage hiring pipeline</p>
          </div>
          {canAccess && (
            <button
              onClick={() => setIsCreateOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', background: 'white', color: '#0d9488', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>
              <Plus size={16} /> Add Candidate
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: '1rem' }}>
          {[
            { label: 'Active Jobs', value: jobPostings.filter(j => j.status === 'active').length },
            { label: 'Total Candidates', value: cands.length },
            { label: 'Offers Out', value: cands.filter(c => c.status === 'offer-extended').length },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgb(255 255 255 / 0.15)', borderRadius: 'var(--radius-lg)', padding: '0.625rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'white' }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(255 255 255 / 0.8)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          <button className={`tab-item ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>Job Postings</button>
          <button className={`tab-item ${tab === 'pipeline' ? 'active' : ''}`} onClick={() => setTab('pipeline')}>Pipeline</button>
        </div>

        {tab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobPostings.map(job => (
              <div key={job.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid rgb(var(--color-border)/0.5)', cursor: 'pointer' }} onClick={() => { setSelectedJobId(job.id); setTab('pipeline'); }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem' }}>{job.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))' }}>{job.department} · {job.location}</p>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: job.status === 'active' ? '#dcfce7' : '#fef3c7', color: job.status === 'active' ? '#16a34a' : '#d97706', flexShrink: 0, marginLeft: 8 }}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}><Users size={12} />{job.applicantsCount} applied</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}><Star size={12} />{job.shortlistedCount} shortlisted</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}><Calendar size={12} />{job.interviewingCount} interviewing</span>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {job.requirements.slice(0, 3).map(r => <span key={r} style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 600 }}>{r}</span>)}
                  {job.requirements.length > 3 && <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 600 }}>+{job.requirements.length - 3}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'pipeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="scroll-row" style={{ marginBottom: 4 }}>
              {(['new', 'screening', 'shortlisted', 'interview-scheduled', 'interviewed', 'offer-extended', 'hired', 'rejected'] as CandidateStatus[]).map(status => {
                const s = statusColors[status] || statusColors.new;
                const count = cands.filter(c => c.status === status).length;
                return (
                  <button key={status} style={{
                    flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: 999,
                    border: `1.5px solid ${s.color}30`, background: `${s.bg}`,
                    color: s.color, fontWeight: 700, cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    {status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    {count > 0 && <span style={{ background: s.color, color: 'white', width: 16, height: 16, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>{count}</span>}
                  </button>
                );
              })}
            </div>

            {cands.map(c => {
              const s = statusColors[c.status as CandidateStatus] || statusColors['new'];
              return (
                <div key={c.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '0.875rem 1rem', border: '1px solid rgb(var(--color-border)/0.5)', cursor: 'pointer' }} onClick={() => setSelectedCandidate(c as any)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: c.color || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>{c.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{c.appliedRole} · {c.experienceYears}yr exp</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ ...s, padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {c.status.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase())}
                      </span>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} color={i <= Math.round(c.rating) ? '#f97316' : '#e2e8f0'} fill={i <= Math.round(c.rating) ? '#f97316' : 'none'} />)}
                      </div>
                    </div>
                    <ChevronRight size={16} color="rgb(var(--color-muted-foreground))" />
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
