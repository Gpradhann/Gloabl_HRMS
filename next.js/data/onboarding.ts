import type { OnboardingEmployee } from './types';

export const onboardingData: OnboardingEmployee = {
  employeeId: 'emp-011',
  name: 'Alex Kumar',
  designation: 'Full Stack Developer',
  department: 'Engineering',
  manager: 'Michael Chen',
  buddy: 'Sarah Johnson',
  joiningDate: '2026-07-01',
  progressPercent: 45,
  isComplete: false,

  tasks: [
    // Pre-joining
    { id: 'ot-001', title: 'Sign Offer Letter', description: 'Digitally sign and return the offer letter via DocuSign.', phase: 'pre-joining', priority: 'high', dueDate: '2026-06-15', assignee: 'Alex Kumar', status: 'completed', completedDate: '2026-06-14' },
    { id: 'ot-002', title: 'Complete Tax Declaration (Form 12BB)', description: 'Submit your investment declaration for TDS computation.', phase: 'pre-joining', priority: 'high', dueDate: '2026-06-20', assignee: 'Alex Kumar', status: 'completed', completedDate: '2026-06-19' },
    { id: 'ot-003', title: 'Submit Bank Account Details', description: 'Provide your salary account number and IFSC code for payroll setup.', phase: 'pre-joining', priority: 'high', dueDate: '2026-06-22', assignee: 'Alex Kumar', status: 'completed', completedDate: '2026-06-21' },
    { id: 'ot-004', title: 'Upload Identity Documents', description: 'Upload Aadhaar, PAN card, and passport copies.', phase: 'pre-joining', priority: 'high', dueDate: '2026-06-25', assignee: 'Alex Kumar', status: 'in-progress' },
    { id: 'ot-005', title: 'Complete Background Verification Consent', description: 'Authorize the background verification process by signing the consent form.', phase: 'pre-joining', priority: 'medium', dueDate: '2026-06-28', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-006', title: 'Set Up Corporate Email', description: 'IT will provision your corporate email. Activate and set up 2FA.', phase: 'pre-joining', priority: 'high', dueDate: '2026-06-30', assignee: 'IT Department', status: 'pending' },

    // Day 1
    { id: 'ot-007', title: 'Attend Welcome Session with HR', description: 'Join the new joiner orientation with Priya from HR at 10:00 AM.', phase: 'day-1', priority: 'high', dueDate: '2026-07-01', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-008', title: 'Meet Your Manager', description: 'First 1:1 with Michael Chen to discuss role expectations and first 30 days.', phase: 'day-1', priority: 'high', dueDate: '2026-07-01', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-009', title: 'Get Laptop & Access Cards', description: 'Collect your MacBook Pro and office access card from IT helpdesk (Floor 3).', phase: 'day-1', priority: 'high', dueDate: '2026-07-01', assignee: 'IT Department', status: 'pending' },
    { id: 'ot-010', title: 'Team Introduction Lunch', description: 'Casual team lunch at 1:00 PM. Sarah (buddy) will guide you.', phase: 'day-1', priority: 'medium', dueDate: '2026-07-01', assignee: 'Alex Kumar', status: 'pending' },

    // Week 1
    { id: 'ot-011', title: 'Complete Security Training Module', description: 'Mandatory information security training. Should take ~90 minutes.', phase: 'week-1', priority: 'high', dueDate: '2026-07-05', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-012', title: 'Set Up Development Environment', description: 'Clone repos, install tools, and run the app locally with buddy\'s help.', phase: 'week-1', priority: 'high', dueDate: '2026-07-04', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-013', title: 'Attend Sprint Planning', description: 'Join the engineering sprint planning meeting to understand current work.', phase: 'week-1', priority: 'medium', dueDate: '2026-07-07', assignee: 'Alex Kumar', status: 'pending' },

    // Week 2
    { id: 'ot-016', title: 'Corporate Benefits Enrollment', description: 'Review and select your health insurance, PF options, and employee benefits in the portal', phase: 'week-2', priority: 'high', dueDate: '2026-07-08', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-017', title: '1:1 Cadence with Manager', description: 'Schedule a recurring weekly 1:1 sync with Michael Chen', phase: 'week-2', priority: 'medium', dueDate: '2026-07-07', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-018', title: 'IT Systems Access Review', description: 'Verify database, cloud accounts, and Slack access with the IT administrator', phase: 'week-2', priority: 'medium', dueDate: '2026-07-09', assignee: 'IT Department', status: 'pending' },

    // Month 1
    { id: 'ot-014', title: 'Complete First Feature Task', description: 'Pick a starter task from the backlog and submit a PR by end of week 3.', phase: 'month-1', priority: 'high', dueDate: '2026-07-22', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-015', title: '30-Day Check-in with Manager', description: 'Review first month progress, goals, and any concerns with Michael.', phase: 'month-1', priority: 'medium', dueDate: '2026-07-31', assignee: 'Alex Kumar', status: 'pending' },
    { id: 'ot-019', title: 'Resolve Relocation Claims', description: 'Submit travel bills and confirm relocation allowance has been credited in payroll', phase: 'month-1', priority: 'medium', dueDate: '2026-07-24', assignee: 'Alex Kumar', status: 'pending' },
  ],

  welcomeMessages: [
    { id: 'wm-001', senderName: 'Arun Krishnamurthy', senderRole: 'CEO & Co-Founder', message: 'Alex, welcome to WorkFlow! You\'re joining at an incredibly exciting time. We\'re building the future of work, and your skills are going to be a huge part of that journey. We\'re thrilled to have you!', hasVideo: true, avatarInitials: 'AK', color: '#0d9488' },
    { id: 'wm-002', senderName: 'Michael Chen', senderRole: 'Your Manager', message: 'Hi Alex! The team and I have been looking forward to your arrival. I\'ve set aside plenty of time in week 1 to get you settled. Don\'t hesitate to reach out anytime — my door is always open.', avatarInitials: 'MC', color: '#6366f1' },
    { id: 'wm-003', senderName: 'Sarah Johnson', senderRole: 'Your Buddy', message: 'Hey Alex! I\'m Sarah, your buddy. My job is to make sure your first 30 days are smooth and fun 😊 I\'ll be your go-to for any questions (no matter how small). Let\'s grab coffee on day 1!', avatarInitials: 'SJ', color: '#f97316' },
    { id: 'wm-004', senderName: 'Priya Sharma', senderRole: 'HR Specialist', message: 'Welcome to the WorkFlow family, Alex! The HR team is here to support you throughout your journey. Your onboarding checklist is ready — complete it at your own pace and reach out if you need anything.', avatarInitials: 'PS', color: '#ec4899' },
    { id: 'wm-005', senderName: 'Engineering Team', senderRole: 'Your Team', message: 'Hey! The whole eng team is excited you\'re here. We\'re a fun, collaborative crew. We have a daily standup at 10:30 AM, Slack is our main channel, and Fridays are usually movie-theme hoodie days 🎬', avatarInitials: 'ET', color: '#8b5cf6' },
  ],

  relocationSupport: {
    visaStatus: 'Not Required',
    accommodationAddress: 'Prestige Shantiniketan, Whitefield, Bangalore - 560048',
    accommodationStatus: 'Confirmed',
    travelBookingStatus: 'Confirmed',
    allowanceAmount: 50000,
    currency: 'INR',
    localBuddy: 'Vikram Nair',
    localBuddyContact: '+91 98765 77777',
    tickets: [
      { id: 'rt-001', subject: 'Furniture setup in temporary accommodation', status: 'resolved' },
      { id: 'rt-002', subject: 'Internet connection at accommodation', status: 'in-progress' },
    ],
  },

  teamIntroductions: [
    { employeeId: 'emp-002', name: 'Michael Chen', designation: 'Engineering Manager', department: 'Engineering', bio: 'Michael has 12 years in software engineering. He believes in servant leadership and autonomous teams.', expertise: ['System Architecture', 'Team Leadership', 'Agile'], funFact: 'Speaks 3 languages and plays tabla!', initials: 'MC', color: '#6366f1', introductionStatus: 'pending' },
    { employeeId: 'emp-001', name: 'Sarah Johnson', designation: 'Senior Software Engineer', department: 'Engineering', bio: 'Sarah is our CI/CD wizard and React expert with 4 years at WorkFlow.', expertise: ['React', 'Node.js', 'DevOps'], funFact: 'Completed a full marathon last year!', initials: 'SJ', color: '#0d9488', introductionStatus: 'done' },
    { employeeId: 'emp-008', name: 'Vikram Nair', designation: 'Full Stack Developer', department: 'Engineering', bio: 'Vikram is the go-to person for performance optimization and system design challenges.', expertise: ['TypeScript', 'PostgreSQL', 'Architecture'], funFact: 'Competitive chess player, rated 1850 Elo.', initials: 'VN', color: '#8b5cf6', introductionStatus: 'pending' },
    { employeeId: 'emp-007', name: 'Lisa Park', designation: 'Data Analyst', department: 'Analytics', bio: 'Lisa bridges the gap between data and product decisions.', expertise: ['Python', 'Tableau', 'Analytics'], funFact: 'Watercolor painter on weekends.', initials: 'LP', color: '#0891b2', introductionStatus: 'pending' },
  ],

  milestones: [
    { id: 'ms-001', title: 'Day 1 Welcome Celebration', description: 'Welcome lunch with the team!', scheduledDate: '2026-07-01', status: 'upcoming', type: 'celebration' },
    { id: 'ms-002', title: '7-Day Check-in', description: 'Quick pulse check with HR after week 1.', scheduledDate: '2026-07-08', status: 'upcoming', type: 'check-in' },
    { id: 'ms-003', title: '30-Day Review', description: 'Comprehensive 30-day performance and onboarding review with manager.', scheduledDate: '2026-07-31', status: 'upcoming', type: 'review' },
    { id: 'ms-004', title: 'End of Probation Review', description: 'Formal probation completion review at 90 days.', scheduledDate: '2026-09-29', status: 'upcoming', type: 'review' },
  ],
};
