import type { Document } from './types';

export const documents: Document[] = [
  { id: 'doc-001', employeeId: 'emp-001', name: 'Aadhaar Card', category: 'identity', status: 'verified', fileName: 'aadhaar_card.pdf', fileSize: 245780, fileType: 'application/pdf', uploadDate: '2022-03-10', verifiedDate: '2022-03-12', isRequired: true },
  { id: 'doc-002', employeeId: 'emp-001', name: 'PAN Card', category: 'tax', status: 'verified', fileName: 'pan_card.pdf', fileSize: 189200, fileType: 'application/pdf', uploadDate: '2022-03-10', verifiedDate: '2022-03-12', isRequired: true },
  { id: 'doc-003', employeeId: 'emp-001', name: 'Passport', category: 'identity', status: 'verified', fileName: 'passport.pdf', fileSize: 1245000, fileType: 'application/pdf', uploadDate: '2022-03-10', verifiedDate: '2022-03-15', expiryDate: '2030-06-15', isRequired: false },
  { id: 'doc-004', employeeId: 'emp-001', name: 'Offer Letter', category: 'employment', status: 'verified', fileName: 'offer_letter_signed.pdf', fileSize: 320000, fileType: 'application/pdf', uploadDate: '2022-03-01', verifiedDate: '2022-03-01', isRequired: true },
  { id: 'doc-005', employeeId: 'emp-001', name: 'B.Tech Certificate', category: 'education', status: 'verified', fileName: 'btech_degree.pdf', fileSize: 890000, fileType: 'application/pdf', uploadDate: '2022-03-10', verifiedDate: '2022-03-18', isRequired: true },
  { id: 'doc-006', employeeId: 'emp-001', name: 'Form 16 (FY 2025-26)', category: 'tax', status: 'uploaded', fileName: 'form16_2526.pdf', fileSize: 456000, fileType: 'application/pdf', uploadDate: '2026-06-10', isRequired: true },
  { id: 'doc-007', employeeId: 'emp-001', name: 'Professional Certification (AWS)', category: 'education', status: 'uploaded', fileName: 'aws_cert.pdf', fileSize: 234000, fileType: 'application/pdf', uploadDate: '2026-05-01', expiryDate: '2027-05-01', isRequired: false },
  { id: 'doc-008', employeeId: 'emp-001', name: 'Bank Account Proof', category: 'employment', status: 'rejected', fileName: 'bank_passbook.jpg', fileSize: 178000, fileType: 'image/jpeg', uploadDate: '2022-03-10', rejectionReason: 'Image is blurry. Please re-upload a clear scan.', isRequired: true },
  { id: 'doc-009', employeeId: 'emp-001', name: 'Address Proof', category: 'identity', status: 'missing', isRequired: true },
  { id: 'doc-010', employeeId: 'emp-001', name: 'Previous Employment Relieving Letter', category: 'employment', status: 'verified', fileName: 'relieving_letter.pdf', fileSize: 198000, fileType: 'application/pdf', uploadDate: '2022-03-10', verifiedDate: '2022-03-15', isRequired: true },
];
