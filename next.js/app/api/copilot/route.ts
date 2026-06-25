import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const RESPONSES: Record<string, string> = {
  leave: `📅 **Leave Information**\n\nHere's a quick summary of your leave balances:\n• **Casual Leave**: 6 days available (5 used of 12)\n• **Sick Leave**: 8 days available\n• **Personal Leave**: 5 days available\n• **Comp-off**: 3 days available\n\nTo apply for leave, go to the **Leave** module and tap "+ New Request". Your manager will be notified for approval.\n\nNeed help with anything else?`,

  payslip: `💰 **Payroll Information**\n\nYour latest payslip:\n• **Pay Period**: June 2026\n• **Pay Date**: June 30, 2026\n• **Gross Pay**: ₹1,42,500\n• **Net Pay**: ₹1,19,280\n• **Status**: ✅ Paid\n\nYou can view the full payslip breakdown in the **Payroll** module. Tax documents (Form 16) are also available for download there.\n\nAnything else I can help with?`,

  attendance: `🕐 **Attendance & Clock-In**\n\nTo clock in/out:\n1. Go to **Attendance** in the bottom nav\n2. Tap "Clock In" — you can use Selfie, Geolocation, or IP verification\n3. Your hours are tracked automatically\n\nYour current month summary: 18 present days, 86% attendance rate. Shift: General Shift (9:00 AM – 6:00 PM).\n\nIs there a specific attendance issue I can help with?`,

  policy: `📋 **HR Policies**\n\nHere are some key policies:\n• **WFH**: Up to 3 days/week (effective July 1)\n• **Leave**: 12 casual, 10 sick, 6 personal days/year\n• **Expenses**: Travel ₹5K limit, meals ₹1.5K/day\n• **Probation**: 90 days for new joiners\n\nFor the complete policy handbook, visit **Documents** or check the latest **Announcements**. You can also acknowledge policy updates there.\n\nWhat specific policy would you like to know about?`,

  expense: `💳 **Expense & Reimbursements**\n\nTo submit an expense:\n1. Go to **Expenses** module\n2. Tap "+ New Expense"\n3. Select category (travel, food, medical, etc.)\n4. Upload receipt and fill details\n5. Submit for manager approval\n\n**Limits**: Travel ₹5,000 | Meals ₹1,500 | Medical ₹5,000 per claim\n\nYou have 2 pending reimbursements in approval. Anything specific you need help with?`,

  onboarding: `🚀 **Onboarding Guide**\n\nWelcome to WorkFlow! Here's what to focus on:\n\n**Immediate (Pre-joining)**:\n• ✅ Sign offer letter\n• ✅ Submit tax declaration\n• 🔄 Upload identity documents (in progress)\n• ⏳ Complete background verification consent\n\n**Day 1**: Welcome session with HR + meet your manager + get laptop\n\n**Week 1**: Complete security training + set up dev environment\n\nYour onboarding is 45% complete. Need help with any specific task?`,

  performance: `🎯 **Performance & Goals**\n\nYour current Q2 goals:\n• **CI/CD Optimization** — 72% complete (On Track ✅)\n• **Mobile App Launch** — 100% complete (Done ✅)\n• **AWS Certification** — 45% complete (In Progress 🔄)\n• **Mentor Juniors** — 30% complete (At Risk ⚠️)\n\nYour Q1 overall rating was **4.2/5**. Your manager recommends you for a Senior Lead role.\n\nWould you like tips on improving at-risk goals?`,

  training: `📚 **Training & Learning**\n\n**Upcoming deadlines**:\n• Security Training — Due July 1 (✅ Completed!)\n• Orientation Module — Due July 15 (80% done)\n• WorkFlow Product Dive — Due July 30 (Not started)\n\n**Tip**: Complete mandatory courses first to avoid policy violations. You can earn certificates for eligible modules.\n\nShall I help you find a specific training course?`,

  recognition: `🏆 **Recognition**\n\nYou've received 2 recognitions this week:\n• 🌟 **Excellent work** from Michael Chen on CI/CD optimization\n• 🤝 **Team Player** from Ananya Reddy for debugging help\n\nTo recognize a colleague:\n1. Go to **Recognition** module\n2. Tap "+ Recognize"\n3. Select colleague, category, and write a message\n\nRecognitions boost morale and are linked to your contribution score!`,

  compoff: `🔄 **Comp-off (Compensatory Leave)**\n\nYou currently have **3 comp-off days** available.\n\nTo apply:\n1. Go to **Leave** module\n2. Select "Comp-off" as leave type\n3. Submit your request with dates\n\nComp-off is earned when you work on weekends/holidays (visible in overtime records in Attendance). Your manager approves comp-off requests just like regular leaves.\n\nAnything else?`,
};

const FALLBACK = `I'm here to help with your HR questions! I can assist with:\n\n• 📅 Leave balances & requests\n• 💰 Payroll & payslips\n• 🕐 Attendance & clock-in\n• 📋 HR policies\n• 💳 Expense reimbursements\n• 🎯 Goals & performance\n• 📚 Training modules\n• 🏆 Recognition\n• 🚀 Onboarding tasks\n\nJust ask me anything and I'll do my best to help!`;

function getResponse(message: string, role: string, view: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('leave') || lower.includes('vacation') || lower.includes('time off') || lower.includes('casual') || lower.includes('sick')) return RESPONSES.leave;
  if (lower.includes('payslip') || lower.includes('salary') || lower.includes('pay') || lower.includes('ctc') || lower.includes('tax') || lower.includes('pf')) return RESPONSES.payslip;
  if (lower.includes('attendance') || lower.includes('clock') || lower.includes('punch') || lower.includes('shift')) return RESPONSES.attendance;
  if (lower.includes('policy') || lower.includes('policies') || lower.includes('wfh') || lower.includes('work from home') || lower.includes('rule')) return RESPONSES.policy;
  if (lower.includes('expense') || lower.includes('reimburse') || lower.includes('receipt') || lower.includes('mileage')) return RESPONSES.expense;
  if (lower.includes('onboard') || lower.includes('new joiner') || lower.includes('joining') || lower.includes('task')) return RESPONSES.onboarding;
  if (lower.includes('goal') || lower.includes('performance') || lower.includes('review') || lower.includes('okr') || lower.includes('rating')) return RESPONSES.performance;
  if (lower.includes('train') || lower.includes('learning') || lower.includes('course') || lower.includes('certif') || lower.includes('module')) return RESPONSES.training;
  if (lower.includes('recogni') || lower.includes('appreciat') || lower.includes('award') || lower.includes('kudos')) return RESPONSES.recognition;
  if (lower.includes('comp') || lower.includes('compensat') || lower.includes('overtime') || lower.includes('extra day')) return RESPONSES.compoff;

  // Context-based responses
  if (view === 'recruitment' && (role === 'HR' || role === 'Admin')) {
    return `🎯 **Recruitment Assistant** (${role} view)\n\nI can see you're on the Recruitment page. Here are some things I can help with:\n\n• **Pipeline**: You have 7 active candidates across 4 job postings\n• **Urgent**: Riya Joshi (Product Designer) has a pending offer that expires in 3 days\n• **Interview**: 2 interviews scheduled this week\n\nTo update a candidate status, click on any candidate card and use the status dropdown. Need help with anything specific?`;
  }

  if (view === 'analytics' && (role === 'Manager' || role === 'HR' || role === 'Admin')) {
    return `📊 **Analytics Assistant** (${role} view)\n\nKey insights this month:\n\n• **Headcount**: 10 employees (8 active, 1 on leave, 1 onboarding)\n• **Attendance Rate**: 86% org-wide\n• **Leave Utilization**: 45% of casual leave used\n• **Training Completion**: 67% on mandatory courses\n\nI can also help you interpret any specific metric or generate a custom report summary. What would you like to know?`;
  }

  return FALLBACK;
}

export async function POST(req: NextRequest) {
  try {
    const { message, currentView, userRole } = await req.json();
    const response = getResponse(message || '', userRole || 'Employee', currentView || 'home');

    // Simulate slight delay for realism
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    return NextResponse.json({ response, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ response: 'Sorry, I encountered an error. Please try again.', timestamp: new Date().toISOString() }, { status: 200 });
  }
}
