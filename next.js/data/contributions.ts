import type { ValueContribution, ContributionItem, ContributionLeaderboard } from './types';

export const contributions: ValueContribution[] = [
  {
    id: 'cn-001', employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ',
    title: 'Automated CI/CD Pipeline Optimization',
    description: 'Redesigned the CI/CD pipeline reducing build time by 60% using parallel jobs and Docker layer caching.',
    type: 'self-initiated', category: 'process-improvement',
    suggestedPoints: 150, finalPoints: 160,
    impactLevel: 'high', tags: ['devops', 'automation', 'cicd'],
    status: 'completed',
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'approved', date: '2026-05-15', comment: 'Excellent work! Saved significant build time.' },
    ],
    createdDate: '2026-05-01',
  },
  {
    id: 'cn-002', employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ',
    title: 'Peer Knowledge Sharing Sessions',
    description: 'Running weekly internal tech talks on React best practices, attended by 15 engineers.',
    type: 'committed', category: 'team-building',
    suggestedPoints: 80, finalPoints: 85,
    impactLevel: 'medium', tags: ['mentorship', 'learning'],
    status: 'in-progress',
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'approved', date: '2026-04-20' },
    ],
    createdDate: '2026-04-18',
  },
  {
    id: 'cn-003', employeeId: 'emp-008', employeeName: 'Vikram Nair', employeeInitials: 'VN',
    title: 'Customer Dashboard Re-architecture',
    description: 'Proposed and executed a full re-architecture of the customer dashboard improving load time by 3x.',
    type: 'assigned', category: 'quality',
    suggestedPoints: 200, finalPoints: 200,
    impactLevel: 'critical', tags: ['performance', 'architecture'],
    status: 'under-review',
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'pending' },
    ],
    createdDate: '2026-06-01',
  },
  {
    id: 'cn-004', employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ',
    title: 'AI-powered Code Review Tool Proposal',
    description: 'Drafted a proposal for integrating AI-based code review to reduce review cycle time.',
    type: 'self-initiated', category: 'innovation',
    suggestedPoints: 120, impactLevel: 'high',
    tags: ['ai', 'innovation', 'productivity'],
    status: 'proposal-pending',
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'pending' },
    ],
    createdDate: '2026-06-20',
  },
];

export const contributionItems: ContributionItem[] = [
  { id: 'ci-001', title: 'Document API Endpoints', description: 'Create comprehensive Swagger documentation for all REST APIs', category: 'quality', suggestedPoints: 60, isAvailable: true, impactLevel: 'medium' },
  { id: 'ci-002', title: 'Onboard New Joiner as Buddy', description: 'Serve as a buddy mentor for the upcoming new joiner batch', category: 'team-building', suggestedPoints: 90, isAvailable: true, impactLevel: 'medium' },
  { id: 'ci-003', title: 'Optimize Database Indexes', description: 'Analyze slow queries and add appropriate indexes to improve performance', category: 'process-improvement', suggestedPoints: 100, isAvailable: true, impactLevel: 'high' },
  { id: 'ci-004', title: 'Create Onboarding Tutorial Video', description: 'Record a walkthrough video for the new HRMS mobile app features', category: 'team-building', suggestedPoints: 75, isAvailable: true, impactLevel: 'medium' },
  { id: 'ci-005', title: 'Security Audit Participation', description: 'Participate in the Q3 application security audit and fix identified issues', category: 'quality', suggestedPoints: 150, isAvailable: false, claimedBy: 'emp-008', impactLevel: 'critical' },
];

export const leaderboard: ContributionLeaderboard[] = [
  { employeeId: 'emp-006', employeeName: 'Rajesh Kumar', employeeInitials: 'RK', department: 'Design', totalPoints: 620, rank: 1, badges: ['🏆 Top Contributor', '🌟 Innovator'], averageRating: 4.8, color: '#f97316' },
  { employeeId: 'emp-002', employeeName: 'Michael Chen', employeeInitials: 'MC', department: 'Engineering', totalPoints: 540, rank: 2, badges: ['🥈 Team Builder'], averageRating: 4.6, color: '#6366f1' },
  { employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ', department: 'Engineering', totalPoints: 415, rank: 3, badges: ['🥉 Process Hero'], averageRating: 4.5, color: '#0d9488' },
  { employeeId: 'emp-008', employeeName: 'Vikram Nair', employeeInitials: 'VN', department: 'Engineering', totalPoints: 380, rank: 4, badges: [], averageRating: 4.3, color: '#8b5cf6' },
  { employeeId: 'emp-005', employeeName: 'Ananya Reddy', employeeInitials: 'AR', department: 'Design', totalPoints: 290, rank: 5, badges: [], averageRating: 4.1, color: '#ec4899' },
];
