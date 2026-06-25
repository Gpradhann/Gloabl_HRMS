import type { Reimbursement } from './types';

export const reimbursements: Reimbursement[] = [
  {
    id: 'exp-001', employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ',
    category: 'travel', amount: 4500, currency: 'INR', description: 'Cab to client office - Whitefield to MG Road',
    date: '2026-06-20', receiptUrls: ['receipt1.jpg'], isMileage: false,
    isTaxable: false, status: 'approved',
    policyValid: true, policyMessage: 'Within ₹5,000 travel limit',
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'approved', date: '2026-06-21', comment: 'Verified' },
    ],
    paidDate: '2026-06-30',
  },
  {
    id: 'exp-002', employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ',
    category: 'food', amount: 1200, currency: 'INR', description: 'Team lunch during sprint planning',
    date: '2026-06-18', receiptUrls: ['receipt2.jpg'],
    isMileage: false, isTaxable: false, status: 'pending-approval',
    policyValid: true, policyMessage: 'Within ₹1,500 meal limit',
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'pending' },
    ],
  },
  {
    id: 'exp-003', employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ',
    category: 'travel', amount: 750, currency: 'INR', description: 'Mileage reimbursement - home to office',
    date: '2026-06-16', receiptUrls: [],
    isMileage: true, mileageKm: 25, mileageFrom: 'Electronic City', mileageTo: 'Koramangala', ratePerKm: 30,
    isTaxable: false, status: 'submitted',
    policyValid: true,
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'pending' },
    ],
  },
  {
    id: 'exp-004', employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ',
    category: 'accommodation', amount: 12000, currency: 'INR', description: 'Hotel stay for Delhi conference',
    date: '2026-06-10', receiptUrls: ['receipt3.jpg', 'receipt4.jpg'],
    isMileage: false, isTaxable: false, status: 'paid',
    policyValid: true, policyMessage: 'Pre-approved conference expense',
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'approved', date: '2026-06-11' },
      { approver: 'Priya Sharma', role: 'HR', status: 'approved', date: '2026-06-12' },
    ],
    paidDate: '2026-06-15',
  },
  {
    id: 'exp-005', employeeId: 'emp-008', employeeName: 'Vikram Nair', employeeInitials: 'VN',
    category: 'communication', amount: 2500, currency: 'INR', description: 'Internet reimbursement - June',
    date: '2026-06-22', receiptUrls: ['receipt5.jpg'],
    isMileage: false, isTaxable: false, status: 'pending-approval',
    policyValid: true,
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'pending' },
    ],
  },
  {
    id: 'exp-006', employeeId: 'emp-001', employeeName: 'Sarah Johnson', employeeInitials: 'SJ',
    category: 'medical', amount: 8500, currency: 'INR', description: 'Medical consultation and medicines',
    date: '2026-06-05', receiptUrls: ['receipt6.jpg'],
    isMileage: false, isTaxable: false, status: 'rejected',
    policyValid: false, policyMessage: 'Exceeds ₹5,000 single claim limit without pre-approval',
    approvalFlow: [
      { approver: 'Michael Chen', role: 'Manager', status: 'rejected', date: '2026-06-06', comment: 'Please split into multiple claims or seek pre-approval for large medical expenses.' },
    ],
  },
];
