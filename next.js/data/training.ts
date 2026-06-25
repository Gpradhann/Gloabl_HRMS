import type { TrainingModule } from './types';

export const trainingModules: TrainingModule[] = [
  {
    id: 'tr-001', title: 'WorkFlow HRMS New Employee Orientation',
    description: 'Complete introduction to WorkFlow culture, policies, processes, and tools.',
    category: 'orientation', durationMinutes: 120, dueDate: '2026-07-15',
    isMandatory: true, isCertificateEligible: true,
    progress: 80, status: 'in-progress',
    contents: [
      { id: 'c1', title: 'Welcome to WorkFlow', type: 'video', duration: 15, completed: true },
      { id: 'c2', title: 'Our Culture & Values', type: 'document', duration: 20, completed: true },
      { id: 'c3', title: 'HR Policies Overview', type: 'document', duration: 30, completed: true },
      { id: 'c4', title: 'Benefits & Perks Guide', type: 'interactive', duration: 25, completed: true },
      { id: 'c5', title: 'Orientation Quiz', type: 'quiz', duration: 30, completed: false },
    ],
  },
  {
    id: 'tr-002', title: 'Information Security & Data Privacy',
    description: 'Mandatory security training covering GDPR, data handling, phishing awareness and access policies.',
    category: 'compliance', durationMinutes: 90, dueDate: '2026-07-01',
    isMandatory: true, isCertificateEligible: true,
    progress: 100, status: 'completed',
    contents: [
      { id: 'c6', title: 'Data Privacy Fundamentals', type: 'video', duration: 20, completed: true },
      { id: 'c7', title: 'GDPR Compliance', type: 'document', duration: 25, completed: true },
      { id: 'c8', title: 'Phishing Simulation', type: 'interactive', duration: 20, completed: true },
      { id: 'c9', title: 'Security Assessment', type: 'quiz', duration: 25, completed: true },
    ],
    certificateId: 'cert-002',
  },
  {
    id: 'tr-003', title: 'Advanced React & Next.js Patterns',
    description: 'Deep dive into React 19, Next.js App Router, RSC patterns, and performance optimization.',
    category: 'technical', durationMinutes: 240, dueDate: '2026-08-31',
    isMandatory: false, isCertificateEligible: true,
    progress: 35, status: 'in-progress',
    contents: [
      { id: 'c10', title: 'React 19 New Features', type: 'video', duration: 45, completed: true },
      { id: 'c11', title: 'Server Components Deep Dive', type: 'video', duration: 60, completed: true },
      { id: 'c12', title: 'State Management Patterns', type: 'document', duration: 40, completed: false },
      { id: 'c13', title: 'Performance Optimization Lab', type: 'interactive', duration: 60, completed: false },
      { id: 'c14', title: 'Advanced Quiz', type: 'quiz', duration: 35, completed: false },
    ],
  },
  {
    id: 'tr-004', title: 'Effective Communication & Presentation',
    description: 'Build skills in stakeholder communication, technical presentations, and written communication.',
    category: 'soft-skills', durationMinutes: 150, dueDate: '2026-09-15',
    isMandatory: false, isCertificateEligible: false,
    progress: 0, status: 'not-started',
    contents: [
      { id: 'c15', title: 'Communication Fundamentals', type: 'video', duration: 30, completed: false },
      { id: 'c16', title: 'Presentation Skills', type: 'interactive', duration: 45, completed: false },
      { id: 'c17', title: 'Written Communication', type: 'document', duration: 35, completed: false },
      { id: 'c18', title: 'Practice Scenarios', type: 'interactive', duration: 40, completed: false },
    ],
  },
  {
    id: 'tr-005', title: 'WorkFlow Product Deep Dive',
    description: 'Comprehensive training on WorkFlow HRMS product features, roadmap, and customer use cases.',
    category: 'product', durationMinutes: 180, dueDate: '2026-07-30',
    isMandatory: true, isCertificateEligible: true,
    progress: 0, status: 'not-started',
    contents: [
      { id: 'c19', title: 'Product Overview', type: 'video', duration: 40, completed: false },
      { id: 'c20', title: 'Feature Walkthrough', type: 'interactive', duration: 60, completed: false },
      { id: 'c21', title: 'Customer Stories', type: 'video', duration: 45, completed: false },
      { id: 'c22', title: 'Product Assessment', type: 'quiz', duration: 35, completed: false },
    ],
  },
];
