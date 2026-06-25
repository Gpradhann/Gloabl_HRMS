import type { Goal, PerformanceReview, Feedback } from './types';

export const goals: Goal[] = [
  {
    id: 'goal-001', employeeId: 'emp-001',
    title: 'Reduce API Response Time by 40%',
    description: 'Optimize backend APIs to reduce average response time from 500ms to 300ms through caching and query optimization.',
    category: 'individual', type: 'quarterly', weight: 30,
    dueDate: '2026-06-30', status: 'on-track', progress: 72,
    keyResults: [
      { id: 'kr-001', title: 'Implement Redis caching layer', target: 100, current: 100, unit: '%', completed: true },
      { id: 'kr-002', title: 'Optimize database queries', target: 20, current: 14, unit: 'queries', completed: false },
      { id: 'kr-003', title: 'Achieve avg response time < 300ms', target: 300, current: 340, unit: 'ms', completed: false },
    ],
  },
  {
    id: 'goal-002', employeeId: 'emp-001',
    title: 'Lead Mobile App Feature Launch',
    description: 'Successfully deliver the mobile attendance module with selfie verification by Q2 end.',
    category: 'team', type: 'quarterly', weight: 25,
    dueDate: '2026-06-30', status: 'completed', progress: 100,
    keyResults: [
      { id: 'kr-004', title: 'Feature development completed', target: 100, current: 100, unit: '%', completed: true },
      { id: 'kr-005', title: 'QA testing passed', target: 100, current: 100, unit: '%', completed: true },
      { id: 'kr-006', title: 'Deployed to production', target: 1, current: 1, unit: 'deployment', completed: true },
    ],
  },
  {
    id: 'goal-003', employeeId: 'emp-001',
    title: 'Achieve AWS Solutions Architect Certification',
    description: 'Complete AWS SAA-C03 certification to improve cloud expertise.',
    category: 'individual', type: 'annual', weight: 20,
    dueDate: '2026-09-30', status: 'in-progress', progress: 45,
    keyResults: [
      { id: 'kr-007', title: 'Complete all study modules', target: 12, current: 5, unit: 'modules', completed: false },
      { id: 'kr-008', title: 'Practice exams score > 85%', target: 85, current: 72, unit: '%', completed: false },
      { id: 'kr-009', title: 'Pass certification exam', target: 1, current: 0, unit: 'exam', completed: false },
    ],
  },
  {
    id: 'goal-004', employeeId: 'emp-001',
    title: 'Mentor 2 Junior Developers',
    description: 'Conduct weekly 1:1 sessions and code reviews to upskill junior team members.',
    category: 'team', type: 'annual', weight: 15,
    dueDate: '2026-12-31', status: 'at-risk', progress: 30,
    keyResults: [
      { id: 'kr-010', title: 'Weekly 1:1 sessions conducted', target: 48, current: 14, unit: 'sessions', completed: false },
      { id: 'kr-011', title: 'Code reviews completed', target: 50, current: 8, unit: 'reviews', completed: false },
    ],
  },
  {
    id: 'goal-005', employeeId: 'emp-001',
    title: 'Improve Code Test Coverage to 85%',
    description: 'Write unit and integration tests to bring coverage from 62% to 85% for the core engineering module.',
    category: 'departmental', type: 'quarterly', weight: 10,
    dueDate: '2026-06-30', status: 'at-risk', progress: 55,
    keyResults: [
      { id: 'kr-012', title: 'Unit test coverage', target: 80, current: 58, unit: '%', completed: false },
      { id: 'kr-013', title: 'Integration test coverage', target: 90, current: 62, unit: '%', completed: false },
    ],
  },
];

export const performanceReviews: PerformanceReview[] = [
  {
    id: 'rev-001', employeeId: 'emp-001',
    reviewType: 'quarterly', period: 'Q1 2026 (Jan–Mar)',
    overallRating: 4.2, maxRating: 5,
    categoryRatings: [
      { category: 'Technical Skills', rating: 4.5, maxRating: 5 },
      { category: 'Productivity', rating: 4.2, maxRating: 5 },
      { category: 'Collaboration', rating: 4.0, maxRating: 5 },
      { category: 'Communication', rating: 3.8, maxRating: 5 },
      { category: 'Innovation', rating: 4.5, maxRating: 5 },
    ],
    strengths: [
      'Exceptional technical problem-solving skills',
      'Consistently delivers quality code ahead of deadlines',
      'Strong initiative in proposing technical improvements',
    ],
    areasOfImprovement: [
      'Documentation of technical decisions could be more detailed',
      'Improve proactive communication on blockers to manager',
    ],
    goalsAchieved: 3,
    totalGoals: 4,
    recommendations: 'Sarah is ready for a Senior Lead role. Recommend for fast-track promotion consideration in Q3.',
    employeeComments: 'I feel I\'ve grown significantly this quarter. Looking forward to taking on more leadership responsibilities.',
    reviewDate: '2026-04-05',
    reviewerName: 'Michael Chen',
  },
];

export const feedbacks: Feedback[] = [
  { id: 'fb-001', fromEmployee: 'Vikram Nair', toEmployee: 'emp-001', type: 'peer', message: 'Sarah is an incredible collaborator. Her code reviews are thorough and always constructive.', rating: 5, date: '2026-04-01' },
  { id: 'fb-002', fromEmployee: 'Ananya Reddy', toEmployee: 'emp-001', type: 'peer', message: 'Great to work with. Always willing to help debug design-engineering integration issues.', rating: 4, date: '2026-04-02' },
  { id: 'fb-003', fromEmployee: 'emp-001', toEmployee: 'Michael Chen', type: 'upward', message: 'Michael provides clear direction and shields the team from unnecessary interruptions.', rating: 4, date: '2026-04-03' },
];
