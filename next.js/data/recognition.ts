import type { Recognition } from './types';

export const recognitions: Recognition[] = [
  {
    id: 'rg-001',
    fromEmployeeId: 'emp-002', fromEmployeeName: 'Michael Chen', fromEmployeeInitials: 'MC', fromColor: '#6366f1',
    toEmployeeId: 'emp-001', toEmployeeName: 'Sarah Johnson', toEmployeeInitials: 'SJ', toColor: '#0d9488',
    category: 'excellence',
    message: '🌟 Sarah\'s work on the CI/CD pipeline optimization was absolutely outstanding! She reduced build times by 60% — a massive productivity win for the entire engineering team. This is the kind of initiative that makes WorkFlow a great place to work!',
    isPublic: true, likesCount: 14, commentsCount: 5, date: '2026-06-21', liked: false,
  },
  {
    id: 'rg-002',
    fromEmployeeId: 'emp-005', fromEmployeeName: 'Ananya Reddy', fromEmployeeInitials: 'AR', fromColor: '#ec4899',
    toEmployeeId: 'emp-001', toEmployeeName: 'Sarah Johnson', toEmployeeInitials: 'SJ', toColor: '#0d9488',
    category: 'team-player',
    message: 'Sarah spent 3 hours helping me debug a complex React integration issue even though it wasn\'t her task. Her patience and expertise saved the sprint! Thank you, Sarah! 🙏',
    isPublic: true, likesCount: 8, commentsCount: 2, date: '2026-06-19', liked: true,
  },
  {
    id: 'rg-003',
    fromEmployeeId: 'emp-001', fromEmployeeName: 'Sarah Johnson', fromEmployeeInitials: 'SJ', fromColor: '#0d9488',
    toEmployeeId: 'emp-008', toEmployeeName: 'Vikram Nair', toEmployeeInitials: 'VN', toColor: '#8b5cf6',
    category: 'innovation',
    message: 'Vikram\'s dashboard re-architecture was genius! He took on one of our most complex legacy codebases and completely transformed it. The performance improvements speak for themselves. Proud to have him on the team! 🚀',
    isPublic: true, likesCount: 11, commentsCount: 3, date: '2026-06-18', liked: false,
  },
  {
    id: 'rg-004',
    fromEmployeeId: 'emp-003', fromEmployeeName: 'Priya Sharma', fromEmployeeInitials: 'PS', fromColor: '#f97316',
    toEmployeeId: 'emp-006', toEmployeeName: 'Rajesh Kumar', toEmployeeInitials: 'RK', toColor: '#14b8a6',
    category: 'leadership',
    message: 'Rajesh led the design sprint with incredible clarity and calm. The new design system he created is already being adopted across product teams. Exceptional leadership! 🎨',
    isPublic: true, likesCount: 22, commentsCount: 7, date: '2026-06-17', liked: true,
  },
  {
    id: 'rg-005',
    fromEmployeeId: 'emp-002', fromEmployeeName: 'Michael Chen', fromEmployeeInitials: 'MC', fromColor: '#6366f1',
    toEmployeeId: 'emp-007', toEmployeeName: 'Lisa Park', toEmployeeInitials: 'LP', toColor: '#0891b2',
    category: 'customer-focus',
    message: 'Lisa went above and beyond to analyze customer churn data and presented actionable insights that saved us 2 major accounts. Data-driven excellence at its best! 📊',
    isPublic: true, likesCount: 16, commentsCount: 4, date: '2026-06-15', liked: false,
  },
];
