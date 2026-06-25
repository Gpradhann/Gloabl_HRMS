'use client';
import { useState, useEffect } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { documents as defaultDocuments } from '../../../data/documents';
import { Upload, CheckCircle2, Clock, XCircle, AlertCircle, FileText, Eye } from 'lucide-react';
import type { Document, DocumentCategory } from '../../../data/types';
import { useDocuments } from '../../../hooks/useDocuments';

const categoryIcons: Record<DocumentCategory, string> = {
  identity: '🪪', employment: '💼', 'work-auth': '🛂', tax: '🧾', education: '🎓', other: '📁',
};

const statusConfig: Record<string, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
  verified:  { bg: '#d1fae5', color: '#059669', icon: <CheckCircle2 size={12} />, label: 'Verified' },
  uploaded:  { bg: '#dbeafe', color: '#1d4ed8', icon: <Clock size={12} />, label: 'Uploaded' },
  rejected:  { bg: '#fee2e2', color: '#dc2626', icon: <XCircle size={12} />, label: 'Rejected' },
  missing:   { bg: '#fef3c7', color: '#d97706', icon: <AlertCircle size={12} />, label: 'Missing' },
};

const categoryOrder: DocumentCategory[] = ['identity', 'employment', 'tax', 'education', 'work-auth', 'other'];
const categoryLabels: Record<DocumentCategory, string> = {
  identity: 'Identity Documents', employment: 'Employment Documents', 'work-auth': 'Work Authorization',
  tax: 'Tax Documents', education: 'Education & Certifications', other: 'Other',
};

export default function DocumentsPage() {
  const { setCurrentView } = useHrmsStore();
  const { documents: apiDocs, uploadDocument } = useDocuments('emp-001');
  const docs = (apiDocs && apiDocs.length > 0) ? apiDocs : defaultDocuments;
  const [selectedCat, setSelectedCat] = useState<DocumentCategory | 'all'>('all');
  useEffect(() => { setCurrentView('documents'); }, [setCurrentView]);

  const missingCount = docs.filter(d => d.status === 'missing').length;
  const rejectedCount = docs.filter(d => d.status === 'rejected').length;
  const verifiedCount = docs.filter(d => d.status === 'verified').length;

  const filteredDocs = selectedCat === 'all' ? docs : docs.filter(d => d.category === selectedCat);
  const groups = categoryOrder.map(cat => ({
    cat, label: categoryLabels[cat],
    docs: filteredDocs.filter(d => d.category === cat),
  })).filter(g => g.docs.length > 0);

  const handleUpload = (docId: string) => {
    const doc = docs.find(d => d.id === docId);
    if (doc) {
      uploadDocument({
        employeeId: 'emp-001',
        name: doc.name,
        category: doc.category,
        fileName: `${doc.name.toLowerCase().replace(/ /g, '_')}.pdf`,
        fileSize: 1048576,
        fileType: 'application/pdf',
        isRequired: doc.isRequired,
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ background: 'linear-gradient(160deg, #0891b2 0%, #06b6d4 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Documents</h1>
        <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: '0 0 1rem' }}>Your document repository</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Verified', value: verifiedCount, bg: 'rgb(255 255 255 / 0.2)', color: '#86efac' },
            { label: 'Missing', value: missingCount, bg: 'rgb(255 255 255 / 0.2)', color: '#fde68a' },
            { label: 'Rejected', value: rejectedCount, bg: 'rgb(255 255 255 / 0.2)', color: '#fca5a5' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 'var(--radius-lg)', padding: '0.625rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 900, color: s.color }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgb(255 255 255 / 0.8)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        {/* Category filter */}
        <div className="scroll-row" style={{ marginBottom: '1rem' }}>
          {(['all', ...categoryOrder] as const).map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)} style={{
              flexShrink: 0, padding: '0.4rem 0.875rem', borderRadius: 999,
              border: selectedCat === cat ? 'none' : '1.5px solid rgb(var(--color-border))',
              background: selectedCat === cat ? '#0891b2' : 'white',
              color: selectedCat === cat ? 'white' : 'var(--foreground)',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
            }}>
              {cat === 'all' ? '📋 All' : `${categoryIcons[cat]} ${categoryLabels[cat].split(' ')[0]}`}
            </button>
          ))}
        </div>

        {groups.map(group => (
          <div key={group.cat} style={{ marginBottom: '1rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', fontWeight: 700, color: 'rgb(var(--color-muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {categoryIcons[group.cat]} {group.label}
            </p>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
              {group.docs.map((doc: any, i: number) => {
                const s = statusConfig[doc.status];
                const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
                return (
                  <div key={doc.id} style={{ padding: '0.875rem 1rem', borderBottom: i < group.docs.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={18} color={s.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{doc.name}</p>
                          {doc.isRequired && <span style={{ fontSize: '0.6rem', background: '#fee2e2', color: '#dc2626', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>Required</span>}
                        </div>
                        {doc.fileName && <p style={{ margin: '2px 0', fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>{doc.fileName} · {doc.fileSize ? `${Math.round(doc.fileSize / 1024)}KB` : ''}</p>}
                        {doc.uploadDate && <p style={{ margin: '2px 0', fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>Uploaded {new Date(doc.uploadDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                        {doc.verifiedDate && <p style={{ margin: '2px 0', fontSize: '0.7rem', color: '#059669' }}>✓ Verified {new Date(doc.verifiedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                        {doc.expiryDate && (
                          <p style={{ margin: '2px 0', fontSize: '0.7rem', color: isExpired ? '#dc2626' : '#d97706' }}>
                            {isExpired ? '⚠ Expired' : '📅 Expires'} {new Date(doc.expiryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                        {doc.status === 'rejected' && doc.rejectionReason && (
                          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626', background: '#fee2e2', padding: '4px 8px', borderRadius: 6 }}>⚠ {doc.rejectionReason}</p>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <span style={{ ...s, display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {s.icon} {s.label}
                        </span>
                        {(doc.status === 'missing' || doc.status === 'rejected') && (
                          <button
                            onClick={() => handleUpload(doc.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, border: '1.5px solid #0d9488', background: 'transparent', color: '#0d9488', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <Upload size={12} /> Upload
                          </button>
                        )}
                        {doc.status === 'verified' && (
                          <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, border: '1.5px solid #e2e8f0', background: 'transparent', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                            <Eye size={12} /> View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
