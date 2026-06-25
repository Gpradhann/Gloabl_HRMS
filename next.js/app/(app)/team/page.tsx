'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { employees } from '../../../data/employees';
import { Users, Phone, Mail, MapPin, ChevronRight, Search, X } from 'lucide-react';

export default function TeamPage() {
  const { setCurrentView, activeRole } = useHrmsStore();
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<typeof employees[0] | null>(null);
  useEffect(() => { setCurrentView('team'); }, [setCurrentView]);

  const title = activeRole === 'Admin' ? 'All Employees' : activeRole === 'Manager' ? 'My Team' : 'Org Directory';
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.designation.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const departments = [...new Set(employees.map(e => e.department))];

  return (
    <div className="animate-fade-in">
      {selectedEmp && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Profile header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <button onClick={() => setSelectedEmp(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#64748b" /></button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: selectedEmp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: '0 auto 0.875rem' }}>{selectedEmp.initials}</div>
              <h2 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 800 }}>{selectedEmp.name}</h2>
              <p style={{ margin: '0 0 2px', fontSize: '0.875rem', color: 'rgb(var(--color-muted-foreground))' }}>{selectedEmp.designation}</p>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', background: selectedEmp.color, padding: '3px 12px', borderRadius: 999 }}>{selectedEmp.department}</span>
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: '1.25rem' }}>
              <a href={`tel:${selectedEmp.phone}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', background: '#f0fdfa', border: '1px solid #99f6e4', textDecoration: 'none' }}>
                <Phone size={18} color="#0d9488" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d9488' }}>Call</span>
              </a>
              <a href={`mailto:${selectedEmp.email}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', background: '#f0fdfa', border: '1px solid #99f6e4', textDecoration: 'none' }}>
                <Mail size={18} color="#0d9488" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d9488' }}>Email</span>
              </a>
            </div>

            {/* Info */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden', marginBottom: '1rem' }}>
              {[
                { label: 'Employee ID', value: selectedEmp.employeeCode },
                { label: 'Email', value: selectedEmp.email },
                { label: 'Phone', value: selectedEmp.phone },
                { label: 'Location', value: selectedEmp.location },
                { label: 'Employment Type', value: selectedEmp.employmentType.charAt(0).toUpperCase() + selectedEmp.employmentType.slice(1) },
                { label: 'Joining Date', value: new Date(selectedEmp.dateOfJoining).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) },
                { label: 'Reporting To', value: selectedEmp.reportingManager || 'Self' },
                { label: 'Status', value: selectedEmp.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: i < arr.length - 1 ? '1px solid rgb(var(--color-border)/0.25)' : 'none' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))' }}>{row.label}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            {selectedEmp.skills && selectedEmp.skills.length > 0 && (
              <div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'rgb(var(--color-muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedEmp.skills.map(s => <span key={s} style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ background: 'linear-gradient(160deg, #3730a3 0%, #4338ca 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>{title}</h1>
        <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: '0 0 1rem' }}>{employees.length} members across {departments.length} departments</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem', background: 'rgb(255 255 255 / 0.15)', borderRadius: 'var(--radius-lg)', border: '1px solid rgb(255 255 255 / 0.25)' }}>
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role, or department..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }} />
          {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}><X size={14} color="rgba(255,255,255,0.7)" /></button>}
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        {/* Department stats */}
        {!search && (
          <div className="scroll-row" style={{ marginBottom: '1rem' }}>
            {departments.map(dept => {
              const count = employees.filter(e => e.department === dept).length;
              return (
                <div key={dept} style={{ flexShrink: 0, background: 'white', borderRadius: 'var(--radius-lg)', padding: '0.625rem 0.875rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{count}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>{dept}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Employee list */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgb(var(--color-muted-foreground))' }}>
              <Users size={36} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
              <p>No employees found</p>
            </div>
          )}
          {filtered.map((emp, i) => (
            <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem 1rem', borderBottom: i < filtered.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
              onClick={() => setSelectedEmp(emp)}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: emp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, color: 'white', flexShrink: 0, position: 'relative' }}>
                {emp.initials}
                <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid white', background: emp.status === 'active' ? '#16a34a' : '#94a3b8' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{emp.name}</p>
                <p style={{ margin: '1px 0 0', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{emp.designation}</p>
                <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                  <span style={{ fontSize: '0.65rem', background: '#f0f9ff', color: '#0891b2', padding: '1px 6px', borderRadius: 999, fontWeight: 600 }}>{emp.department}</span>
                  <span style={{ fontSize: '0.65rem', color: 'rgb(var(--color-muted-foreground))' }}>📍 {emp.location.split(',')[0]}</span>
                </div>
              </div>
              <ChevronRight size={18} color="rgb(var(--color-muted-foreground))" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
