import type { Announcement } from './types';

export const announcements: Announcement[] = [
  {
    id: 'ann-001', title: '🎉 Q2 All-Hands Meeting — July 5th',
    content: 'Join us for our Q2 All-Hands on July 5th at 3:00 PM IST / 5:30 AM EST. We\'ll cover Q2 performance highlights, product roadmap for H2, and celebrate our team wins. Lunch will be provided at all offices. Virtual attendees will receive a lunch voucher. Meeting link will be shared 30 minutes before start.',
    category: 'event', priority: 'high', visibilityScope: 'global',
    publishedDate: '2026-06-22', publishedBy: 'Priya Sharma (HR)',
    views: 248, likes: 67, acknowledgments: 180, comments: 12,
    requiresAcknowledgment: false, acknowledged: false,
  },
  {
    id: 'ann-002', title: '📋 Updated Work From Home Policy — Effective July 1',
    content: 'Effective July 1, 2026, the WFH policy is updated to allow up to 3 days per week for all eligible roles. Employees must maintain a minimum attendance of 2 office days per week. Roles that require physical presence (IT Support, Facilities) are exempt. Please read the full policy document attached and acknowledge receipt by June 30.',
    category: 'policy', priority: 'critical', visibilityScope: 'global',
    attachments: ['WFH_Policy_v3.pdf'],
    expiryDate: '2026-07-01',
    publishedDate: '2026-06-20', publishedBy: 'David Williams (Admin)',
    views: 312, likes: 89, acknowledgments: 156, comments: 28,
    requiresAcknowledgment: true, acknowledged: false,
  },
  {
    id: 'ann-003', title: '🏆 Engineering Team — Quarterly Awards!',
    content: 'Congratulations to our Engineering team for an exceptional Q2! Special shoutouts: 🥇 Sarah Johnson for CI/CD optimization saving 60% build time. 🥈 Vikram Nair for the customer dashboard re-architecture. 🥉 The entire backend team for zero P0 incidents this quarter. Keep up the phenomenal work! The full awards ceremony will be held at the Q2 All-Hands.',
    category: 'celebration', priority: 'medium', visibilityScope: 'department',
    targetDepartments: ['Engineering'],
    publishedDate: '2026-06-18', publishedBy: 'Michael Chen (Manager)',
    views: 87, likes: 45, acknowledgments: 0, comments: 18,
    requiresAcknowledgment: false, acknowledged: false,
  },
  {
    id: 'ann-004', title: '⚠️ Mandatory Cybersecurity Training — Deadline June 30',
    content: 'All employees must complete the Information Security & Data Privacy training module by June 30, 2026. Non-completion will be flagged in your performance record. The training covers GDPR updates, phishing awareness, and new data handling protocols. Access the training via the Training module in WorkFlow. Total time: 90 minutes.',
    category: 'compliance', priority: 'critical', visibilityScope: 'global',
    expiryDate: '2026-06-30',
    publishedDate: '2026-06-10', publishedBy: 'Priya Sharma (HR)',
    views: 425, likes: 12, acknowledgments: 390, comments: 8,
    requiresAcknowledgment: true, acknowledged: true,
  },
  {
    id: 'ann-005', title: '🏥 Health Insurance Renewal — Action Required',
    content: 'Annual health insurance enrollment window opens July 1–15. Review your current coverage, add/remove dependents, and upgrade plans if needed. New plan options include dental and vision coverage. HR will host benefit orientation webinars on July 2nd (India) and July 3rd (US). Contact benefits@workflow.com for assistance.',
    category: 'hr-update', priority: 'high', visibilityScope: 'global',
    publishedDate: '2026-06-15', publishedBy: 'Priya Sharma (HR)',
    views: 276, likes: 34, acknowledgments: 0, comments: 15,
    requiresAcknowledgment: false, acknowledged: false,
  },
];
