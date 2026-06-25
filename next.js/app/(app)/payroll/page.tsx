'use client';
import { useEffect, useState } from 'react';
import { useHrmsStore } from '../../../stores/hrmsStore';
import { payrollRecords as defaultRecords, complianceItems } from '../../../data/payroll';
import { Download, FileText, TrendingUp, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { usePayroll } from '../../../hooks/usePayroll';

function formatCurrency(amount: number, currency: string) {
  if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
  return `$${amount.toLocaleString('en-US')}`;
}

export default function PayrollPage() {
  const { setCurrentView, activeRole } = useHrmsStore();
  const [expandedSection, setExpandedSection] = useState<string | null>('earnings');
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const { records } = usePayroll();

  useEffect(() => { setCurrentView('payroll'); }, [setCurrentView]);

  const displayRecords = records.length > 0 ? records : defaultRecords;
  const myRecords = displayRecords.filter(r => r.employeeId === (activeRole === 'Admin' ? 'emp-004' : 'emp-001'));
  const pr = myRecords[selectedPeriod] || displayRecords[0];
  const canSeeCompliance = activeRole === 'HR' || activeRole === 'Admin';

  const toggle = (s: string) => setExpandedSection(prev => prev === s ? null : s);

  const basic = (pr as any).earnings?.basic !== undefined ? (pr as any).earnings.basic : (pr as any).basicSalary;
  const hra = (pr as any).earnings?.hra !== undefined ? (pr as any).earnings.hra : (pr as any).hra;
  const specialAllowance = (pr as any).earnings?.specialAllowance !== undefined ? (pr as any).earnings.specialAllowance : (pr as any).specialAllowance;
  const bonus = (pr as any).earnings?.bonus !== undefined ? (pr as any).earnings.bonus : (pr as any).bonus;
  const overtime = (pr as any).earnings?.overtime !== undefined ? (pr as any).earnings.overtime : (pr as any).overtimePay;
  const reimbursements = (pr as any).earnings?.reimbursements !== undefined ? (pr as any).earnings.reimbursements : (pr as any).reimbursements;

  const pf = (pr as any).deductions?.pf !== undefined ? (pr as any).deductions.pf : (pr as any).providentFund;
  const incomeTax = (pr as any).deductions?.incomeTax !== undefined ? (pr as any).deductions.incomeTax : (pr as any).incomeTax;
  const professionalTax = (pr as any).deductions?.professionalTax !== undefined ? (pr as any).deductions.professionalTax : (pr as any).professionalTax;
  const healthInsurance = (pr as any).deductions?.healthInsurance !== undefined ? (pr as any).deductions.healthInsurance : ((pr as any).healthInsurance || 0);
  const federalTax = (pr as any).deductions?.federalTax !== undefined ? (pr as any).deductions.federalTax : (pr as any).federalTax;
  const stateTax = (pr as any).deductions?.stateTax !== undefined ? (pr as any).deductions.stateTax : (pr as any).stateTax;
  const socialSecurity = (pr as any).deductions?.socialSecurity !== undefined ? (pr as any).deductions.socialSecurity : (pr as any).socialSecurity;
  const medicare = (pr as any).deductions?.medicare !== undefined ? (pr as any).deductions.medicare : (pr as any).medicare;

  const earningsItems = [
    { label: 'Basic Salary', amount: basic || 0 },
    { label: 'House Rent Allowance (HRA)', amount: hra || 0 },
    { label: 'Special Allowance', amount: specialAllowance || 0 },
    ...(bonus ? [{ label: 'Bonus', amount: bonus }] : []),
    ...(overtime ? [{ label: 'Overtime Pay', amount: overtime }] : []),
    ...(reimbursements ? [{ label: 'Reimbursements', amount: reimbursements }] : []),
  ];

  const deductionItems = [
    ...(pf ? [{ label: 'Provident Fund (PF)', amount: pf }] : []),
    ...(incomeTax ? [{ label: 'Income Tax', amount: incomeTax }] : []),
    ...(professionalTax ? [{ label: 'Professional Tax', amount: professionalTax }] : []),
    { label: 'Health Insurance', amount: healthInsurance },
    ...(federalTax ? [{ label: 'Federal Tax', amount: federalTax }] : []),
    ...(stateTax ? [{ label: 'State Tax', amount: stateTax }] : []),
    ...(socialSecurity ? [{ label: 'Social Security', amount: socialSecurity }] : []),
    ...(medicare ? [{ label: 'Medicare', amount: medicare }] : []),
  ];

  const employerItems = (pr as any).employerContributions ? [
    ...((pr as any).employerContributions.pf ? [{ label: "Employer PF Contribution", amount: (pr as any).employerContributions.pf }] : []),
    ...((pr as any).employerContributions.esi ? [{ label: "Employer ESI Contribution", amount: (pr as any).employerContributions.esi }] : []),
    ...((pr as any).employerContributions.gratuity ? [{ label: "Gratuity Provision", amount: (pr as any).employerContributions.gratuity }] : []),
  ] : (pf ? [{ label: "Employer PF Contribution", amount: pf }] : []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #7c3aed 0%, #8b5cf6 100%)', padding: '1.5rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Payroll & Compliance</h1>
            <p style={{ color: 'rgb(255 255 255 / 0.75)', fontSize: '0.8125rem', margin: 0 }}>
              {pr.country === 'IN' ? '🇮🇳 India' : '🇺🇸 United States'} · {pr.currency}
            </p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', background: 'rgb(255 255 255 / 0.2)', border: '1px solid rgb(255 255 255 / 0.3)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem', marginTop: '1rem' }}>
        {/* Period selector */}
        {myRecords.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', overflowX: 'auto' }}>
            {myRecords.map((r, i) => (
              <button key={r.id} onClick={() => setSelectedPeriod(i)} style={{
                flexShrink: 0, padding: '0.5rem 1rem', borderRadius: 999,
                border: selectedPeriod === i ? 'none' : '1.5px solid rgb(var(--color-border))',
                background: selectedPeriod === i ? '#7c3aed' : 'white',
                color: selectedPeriod === i ? 'white' : 'var(--foreground)',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem',
              }}>{r.payPeriod}</button>
            ))}
          </div>
        )}

        {/* Net pay card */}
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', borderRadius: 'var(--radius-2xl)', padding: '1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgb(255 255 255 / 0.06)' }} />
          <p style={{ color: 'rgb(255 255 255 / 0.8)', fontSize: '0.8rem', margin: '0 0 4px', fontWeight: 500 }}>Net Pay — {pr.payPeriod}</p>
          <p style={{ color: 'white', fontSize: '2rem', fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{formatCurrency(pr.netPay, pr.currency)}</p>
          <p style={{ color: 'rgb(255 255 255 / 0.7)', fontSize: '0.75rem', margin: '0 0 1rem' }}>Pay Date: {new Date(pr.payDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: 'rgb(255 255 255 / 0.15)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', flex: 1 }}>
              <p style={{ margin: 0, color: 'rgb(255 255 255 / 0.8)', fontSize: '0.65rem' }}>Gross Pay</p>
              <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>{formatCurrency(pr.grossPay, pr.currency)}</p>
            </div>
            <div style={{ background: 'rgb(255 255 255 / 0.15)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', flex: 1 }}>
              <p style={{ margin: 0, color: 'rgb(255 255 255 / 0.8)', fontSize: '0.65rem' }}>Total Deductions</p>
              <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>{formatCurrency(pr.totalDeductions, pr.currency)}</p>
            </div>
            <div style={{ background: 'rgb(255 255 255 / 0.2)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', flex: 1 }}>
              <p style={{ margin: 0, color: 'rgb(255 255 255 / 0.8)', fontSize: '0.65rem' }}>Status</p>
              <p style={{ margin: 0, color: '#86efac', fontWeight: 800, fontSize: '0.9rem' }}>✅ Paid</p>
            </div>
          </div>
        </div>

        {/* Earnings section */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden', marginBottom: 10 }}>
          <button onClick={() => toggle('earnings')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={16} color="#16a34a" /></div>
              <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Earnings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.9375rem' }}>{formatCurrency(pr.grossPay, pr.currency)}</span>
              {expandedSection === 'earnings' ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
            </div>
          </button>
          {expandedSection === 'earnings' && (
            <div style={{ borderTop: '1px solid rgb(var(--color-border)/0.3)' }}>
              {earningsItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 1rem', borderBottom: i < earningsItems.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))' }}>{item.label}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{formatCurrency(item.amount, pr.currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deductions */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden', marginBottom: 10 }}>
          <button onClick={() => toggle('deductions')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} color="#dc2626" /></div>
              <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Deductions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.9375rem' }}>- {formatCurrency(pr.totalDeductions, pr.currency)}</span>
              {expandedSection === 'deductions' ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
            </div>
          </button>
          {expandedSection === 'deductions' && (
            <div style={{ borderTop: '1px solid rgb(var(--color-border)/0.3)' }}>
              {deductionItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 1rem', borderBottom: i < deductionItems.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))' }}>{item.label}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#dc2626' }}>{formatCurrency(item.amount, pr.currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employer contributions */}
        {employerItems.length > 0 && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden', marginBottom: 10 }}>
            <button onClick={() => toggle('employer')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={16} color="#0891b2" /></div>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Employer Contributions</span>
              </div>
              {expandedSection === 'employer' ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
            </button>
            {expandedSection === 'employer' && (
              <div style={{ borderTop: '1px solid rgb(var(--color-border)/0.3)' }}>
                {employerItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 1rem', borderBottom: i < employerItems.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'rgb(var(--color-muted-foreground))' }}>{item.label}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0891b2' }}>{formatCurrency(item.amount, pr.currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compliance Dashboard (HR/Admin only) */}
        {canSeeCompliance && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid rgb(var(--color-border)/0.5)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid rgb(var(--color-border)/0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} color="#0d9488" />
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>Compliance Dashboard</p>
            </div>
            {complianceItems.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', borderBottom: i < complianceItems.length - 1 ? '1px solid rgb(var(--color-border)/0.2)' : 'none' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c.country === 'IN' ? '#f97316' : '#6366f1', background: c.country === 'IN' ? '#fff7ed' : '#ede9fe', padding: '2px 6px', borderRadius: 4 }}>{c.country}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600 }}>{c.item}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgb(var(--color-muted-foreground))' }}>Due {new Date(c.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                  background: c.status === 'completed' ? '#d1fae5' : '#fef3c7',
                  color: c.status === 'completed' ? '#059669' : '#d97706',
                }}>{c.status === 'completed' ? '✅ Done' : '⏳ Pending'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
