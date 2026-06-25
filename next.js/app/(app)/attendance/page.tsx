'use client';
import { useState, useEffect, useRef } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { attendanceRecords as defaultRecords, currentShift, attendanceSummary, weeklyHours } from '../../../data/attendance';
import { Camera, MapPin, Wifi, Clock, CheckCircle2, AlertCircle, Calendar, ChevronRight, X, Play } from 'lucide-react';
import { useAttendance } from '../../../hooks/useAttendance';

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  present:  { bg: '#dcfce7', color: '#16a34a', label: 'Present' },
  absent:   { bg: '#fee2e2', color: '#dc2626', label: 'Absent' },
  late:     { bg: '#ffedd5', color: '#ea580c', label: 'Late' },
  'half-day': { bg: '#fef9c3', color: '#ca8a04', label: 'Half Day' },
  'on-leave': { bg: '#ede9fe', color: '#7c3aed', label: 'On Leave' },
  holiday:  { bg: '#f0f9ff', color: '#0891b2', label: 'Holiday' },
  weekend:  { bg: '#f8fafc', color: '#94a3b8', label: 'Weekend' },
};

function ClockInModal({ onClose, onClockIn }: { onClose: () => void; onClockIn: (method: string) => Promise<void> }) {
  const [step, setStep] = useState<'method' | 'capturing' | 'done'>('method');
  const [method, setMethod] = useState<string>('selfie');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (step === 'capturing' && method === 'selfie') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
        .then(s => { setStream(s); if (videoRef.current) videoRef.current.srcObject = s; })
        .catch(() => { /* fallback gracefully */ });
    }
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, method]);

  const handleCapture = async () => {
    stream?.getTracks().forEach(t => t.stop());
    await onClockIn(method);
    setStep('done');
  };

  return (
    <div className="modal-overlay modal-center">
      <div style={{ width: '100%', maxWidth: 360, background: 'white', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', animation: 'scale-in 0.25s ease-out' }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgb(var(--color-border)/0.5)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0d9488, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>Clock In</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="#64748b" />
            </button>
          </div>

          <div style={{ padding: '1.25rem' }}>
            {step === 'method' && (
              <>
                <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'rgb(var(--color-muted-foreground))' }}>Choose your verification method:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.25rem' }}>
                  {[
                    { key: 'selfie', icon: <Camera size={20} color="#0d9488" />, label: 'Selfie Verification', desc: 'Take a quick selfie for identity verification' },
                    { key: 'geo', icon: <MapPin size={20} color="#6366f1" />, label: 'Geolocation', desc: 'Verify via GPS location' },
                    { key: 'ip', icon: <Wifi size={20} color="#f97316" />, label: 'IP Validation', desc: 'Verify via office network IP' },
                  ].map(m => (
                    <button key={m.key} onClick={() => setMethod(m.key)} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem',
                      border: `2px solid ${method === m.key ? '#0d9488' : 'rgb(var(--color-border))'}`,
                      borderRadius: 'var(--radius-lg)', background: method === m.key ? '#f0fdfa' : 'white',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: method === m.key ? '#ccfbf1' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.icon}</div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{m.label}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', background: '#dcfce7', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>Location Verified</span>
                  </div>
                  <div style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', background: '#dcfce7', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>IP Validated</span>
                  </div>
                </div>
                <button onClick={() => setStep('capturing')} style={{
                  width: '100%', marginTop: '1rem', padding: '0.875rem', borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white',
                  border: 'none', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgb(13 148 136 / 0.35)',
                }}>
                  Continue with {method === 'selfie' ? 'Selfie' : method === 'geo' ? 'Location' : 'IP'} →
                </button>
              </>
            )}

            {step === 'capturing' && (
              <div style={{ textAlign: 'center' }}>
                {method === 'selfie' ? (
                  <>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600 }}>Position your face in the frame</p>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: '#0f172a', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                      <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {!stream && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <Camera size={40} color="#64748b" />
                          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Camera preview</p>
                        </div>
                      )}
                      <div style={{ position: 'absolute', inset: 0, border: '3px solid #0d9488', borderRadius: 'var(--radius-xl)', pointerEvents: 'none' }} />
                    </div>
                    <button onClick={handleCapture} style={{
                      width: 64, height: 64, borderRadius: '50%', border: '4px solid #0d9488',
                      background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                    }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0d9488' }} />
                    </button>
                    <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Tap the button to capture</p>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '2rem 0' }}>
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdfa', border: '3px solid #0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {method === 'geo' ? <MapPin size={32} color="#0d9488" /> : <Wifi size={32} color="#0d9488" />}
                      </div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{method === 'geo' ? 'Fetching your location...' : 'Detecting network IP...'}</p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#0d9488', animation: `bounce-gentle 1s ${d}s ease-in-out infinite` }} />)}
                      </div>
                    </div>
                    <button onClick={handleCapture} style={{ padding: '0.875rem 2rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                      Confirm
                    </button>
                  </>
                )}
              </div>
            )}

            {step === 'done' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', animation: 'scale-in 0.3s ease-out' }}>
                  <CheckCircle2 size={36} color="#16a34a" />
                </div>
                <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>Clocked In! ✅</h2>
                <p style={{ margin: '0 0 0.25rem', color: 'rgb(var(--color-muted-foreground))', fontSize: '0.875rem' }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> Location Verified</span>
                  <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> IP Validated</span>
                </div>
                <button onClick={onClose} style={{ padding: '0.875rem 2rem', borderRadius: 'var(--radius-lg)', background: '#f1f5f9', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem', color: 'var(--foreground)', width: '100%' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default function AttendancePage() {
  const { setCurrentView } = useHrmsStore();
  const [showModal, setShowModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'shift'>('today');

  const { records, clockIn, clockOut } = useAttendance('emp-001');
  const { localAttendance, addLocalAttendance } = useHrmsStore();

  const todayStr = new Date().toISOString().split('T')[0];

  // Merge server records with client local storage overrides
  const mergedRecords = [...records];
  localAttendance.forEach((localRec: any) => {
    const idx = mergedRecords.findIndex(r => r.employeeId === localRec.employeeId && r.date === localRec.date);
    if (idx !== -1) {
      mergedRecords[idx] = { ...mergedRecords[idx], ...localRec };
    } else {
      mergedRecords.unshift(localRec);
    }
  });

  const todayRecord = mergedRecords?.find(r => r.date === todayStr);
  const isClockedIn = !!(todayRecord && todayRecord.clockIn && !todayRecord.clockOut);


  useEffect(() => { setCurrentView('attendance'); }, [setCurrentView]);

  useEffect(() => {
    if (!isClockedIn || !todayRecord?.clockIn) return;
    const [h, m] = todayRecord.clockIn.split(':').map(Number);
    const start = new Date();
    start.setHours(h, m, 0, 0);
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date().getTime() - start.getTime()) / 1000));
      setElapsed(diff);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [isClockedIn, todayRecord?.clockIn]);

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const maxHours = 9;
  const displayRecords = mergedRecords.length > 0 ? mergedRecords : defaultRecords;
  const recentRecords = displayRecords.slice(0, 7);

  return (
    <div className="animate-fade-in">
      {showModal && (
        <ClockInModal
          onClose={() => { setShowModal(false); }}
          onClockIn={async (method) => {
            await clockIn({ employeeId: 'emp-001', method });
            const clockInTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            addLocalAttendance({
              id: `att-local-${Date.now()}`,
              employeeId: 'emp-001',
              userId: 'emp-001',
              date: todayStr,
              clockIn: clockInTime,
              clockOut: null,
              clockMethod: method,
              status: 'present',
              productiveHours: 0,
              breakHours: 0,
              overtimeHours: 0,
              totalHours: 0,
              locationVerified: true,
              ipValidated: true,
              shiftName: 'General Shift'
            });
          }}
        />
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #0f766e 0%, #0d9488 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Attendance</h1>
        <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        {/* Clock card */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: '1.5rem', boxShadow: 'var(--shadow-lg)', marginBottom: '1rem', border: '1px solid rgb(var(--color-border)/0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums', color: isClockedIn ? '#0d9488' : 'var(--foreground)' }}>
              {isClockedIn ? formatElapsed(elapsed) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'rgb(var(--color-muted-foreground))', fontWeight: 500 }}>
              {isClockedIn ? '⏱ Time since clock-in' : 'Current time'}
            </p>
          </div>

          {isClockedIn && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>Work progress</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0d9488' }}>{Math.round((elapsed / 3600 / maxHours) * 100)}% of {maxHours}h</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #0d9488, #14b8a6)', width: `${Math.min(100, (elapsed / 3600 / maxHours) * 100)}%`, transition: 'width 1s linear' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              flex: 1, padding: '0.5rem',
              background: isClockedIn && todayRecord?.locationVerified ? '#f0fdfa' : '#f8fafc',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 6,
              border: `1px solid ${isClockedIn && todayRecord?.locationVerified ? '#99f6e4' : 'rgb(var(--color-border)/0.5)'}`
            }}>
              {isClockedIn && todayRecord?.locationVerified ? (
                <>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>Location Verified</span>
                </>
              ) : (
                <>
                  <MapPin size={14} color="#64748b" />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Location Pending</span>
                </>
              )}
            </div>
            <div style={{
              flex: 1, padding: '0.5rem',
              background: isClockedIn && todayRecord?.ipValidated ? '#f0fdfa' : '#f8fafc',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 6,
              border: `1px solid ${isClockedIn && todayRecord?.ipValidated ? '#99f6e4' : 'rgb(var(--color-border)/0.5)'}`
            }}>
              {isClockedIn && todayRecord?.ipValidated ? (
                <>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>IP Validated</span>
                </>
              ) : (
                <>
                  <Wifi size={14} color="#64748b" />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>IP Pending</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={async () => {
              if (!isClockedIn) {
                setShowModal(true);
              } else {
                await clockOut({ employeeId: 'emp-001' });
                const clockOutTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
                const currentTodayRec = displayRecords.find(r => r.date === todayStr);
                if (currentTodayRec) {
                  const [inH, inM] = (currentTodayRec.clockIn || '09:00').split(':').map(Number);
                  const [outH, outM] = clockOutTime.split(':').map(Number);
                  const diffMs = (outH * 60 + outM) - (inH * 60 + inM);
                  const totalHours = Math.max(0, diffMs / 60);
                  addLocalAttendance({
                    ...currentTodayRec,
                    clockOut: clockOutTime,
                    totalHours: parseFloat(totalHours.toFixed(2)),
                    productiveHours: parseFloat(Math.max(0, totalHours - 0.5).toFixed(2)),
                    status: 'present'
                  });
                }
              }
            }}
            style={{
              width: '100%', marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-lg)',
              background: isClockedIn ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: isClockedIn ? '0 2px 8px rgb(220 38 38 / 0.35)' : '0 2px 8px rgb(13 148 136 / 0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Clock size={20} />
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>
        </div>

        {/* Monthly stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: '1rem' }}>
          {[
            { label: 'Present', value: attendanceSummary.present, color: '#16a34a', bg: '#dcfce7' },
            { label: 'Absent', value: attendanceSummary.absent, color: '#dc2626', bg: '#fee2e2' },
            { label: 'Late', value: attendanceSummary.late, color: '#ea580c', bg: '#ffedd5' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '0.875rem', border: '1px solid rgb(var(--color-border)/0.5)', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          {(['today', 'history', 'shift'] as const).map(t => (
            <button key={t} className={`tab-item ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t === 'today' ? 'Today' : t === 'history' ? 'History' : 'Shift'}
            </button>
          ))}
        </div>

        {activeTab === 'today' && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
            {[
              { label: 'Shift', value: currentShift.name, icon: <Calendar size={16} color="#0d9488" /> },
              { label: 'Shift Hours', value: `${currentShift.startTime} – ${currentShift.endTime}`, icon: <Clock size={16} color="#6366f1" /> },
              { label: 'Productive Hours', value: isClockedIn ? `${(elapsed / 3600).toFixed(2)}h` : '8.50h (yesterday)', icon: <CheckCircle2 size={16} color="#16a34a" /> },
              { label: 'Break Hours', value: '0.72h', icon: <AlertCircle size={16} color="#f97316" /> },
              { label: 'Overtime', value: '0.25h', icon: <Play size={16} color="#8b5cf6" /> },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem 1rem', borderBottom: i < 4 ? '1px solid rgb(var(--color-border)/0.3)' : 'none' }}>
                <span>{row.icon}</span>
                <span style={{ flex: 1, fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))' }}>{row.label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
            {recentRecords.map((r, i) => {
              const s = statusStyle[r.status] || statusStyle.present;
              return (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem 1rem', borderBottom: i < recentRecords.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                  <div style={{ width: 40, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{new Date(r.date).getDate()}</p>
                    <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgb(var(--color-muted-foreground))', textTransform: 'uppercase' }}>{new Date(r.date).toLocaleDateString('en', { weekday: 'short' })}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: s.color, background: s.bg, padding: '2px 7px', borderRadius: 999 }}>{s.label}</span>
                      {r.exceptionFlag && <span style={{ fontSize: '0.65rem', color: '#ea580c' }}>⚠ {r.exceptionFlag}</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>
                      {r.clockIn ? `${r.clockIn} – ${r.clockOut || 'Active'}` : r.status === 'on-leave' ? 'On approved leave' : r.status === 'holiday' ? 'Public holiday' : 'No record'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>{r.totalHours > 0 ? `${r.totalHours}h` : '—'}</p>
                    {r.overtimeHours > 0 && <p style={{ margin: 0, fontSize: '0.65rem', color: '#8b5cf6' }}>+{r.overtimeHours}h OT</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'shift' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1.5px solid #99f6e4' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem', color: '#0f766e' }}>Current Shift</p>
                <span style={{ background: '#0d9488', color: 'white', padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>Active</span>
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '1.125rem', fontWeight: 800 }}>{currentShift.name}</p>
              <p style={{ margin: '0 0 0.75rem', color: 'rgb(var(--color-muted-foreground))', fontSize: '0.875rem' }}>{currentShift.startTime} — {currentShift.endTime}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {currentShift.days.map(d => (
                  <span key={d} style={{ background: 'white', border: '1px solid #99f6e4', borderRadius: 999, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600, color: '#0f766e' }}>{d}</span>
                ))}
              </div>
            </div>
            {/* Weekly hours chart */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid rgb(var(--color-border)/0.5)' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 700 }}>Weekly Hours</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                {weeklyHours.map(wh => (
                  <div key={wh.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'flex-end' }}>
                      {wh.overtime > 0 && <div style={{ width: '100%', background: '#8b5cf6', borderRadius: '4px 4px 0 0', height: `${(wh.overtime / 12) * 70}px`, minHeight: 3 }} />}
                      {wh.hours > 0 && <div style={{ width: '100%', background: '#0d9488', borderRadius: wh.overtime > 0 ? 0 : '4px 4px 0 0', height: `${((wh.hours - wh.overtime) / 12) * 70}px`, minHeight: 3 }} />}
                      {wh.hours === 0 && <div style={{ width: '100%', background: '#f1f5f9', borderRadius: 4, height: 4 }} />}
                    </div>
                    <span style={{ fontSize: '0.6rem', color: 'rgb(var(--color-muted-foreground))', fontWeight: 600 }}>{wh.day}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#0d9488' }} /><span style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>Regular</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#8b5cf6' }} /><span style={{ fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>Overtime</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
