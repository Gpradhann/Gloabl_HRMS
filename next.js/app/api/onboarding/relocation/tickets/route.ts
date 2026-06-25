import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject } = body;

    if (!subject || typeof subject !== 'string') {
      return NextResponse.json({ success: false, error: 'Subject is required' }, { status: 400 });
    }

    const onboardingData = db.get('onboardingData') as any;
    if (onboardingData) {
      if (!onboardingData.relocationSupport) {
        onboardingData.relocationSupport = {
          visaStatus: 'Not Required',
          accommodationAddress: 'Prestige Shantiniketan, Whitefield, Bangalore - 560048',
          accommodationStatus: 'Confirmed',
          travelBookingStatus: 'Confirmed',
          allowanceAmount: 50000,
          currency: 'INR',
          localBuddy: 'Vikram Nair',
          localBuddyContact: '+91 98765 77777',
          tickets: []
        };
      }

      const tickets = onboardingData.relocationSupport.tickets || [];
      const newTicketId = `rt-00${tickets.length + 1}`;
      const newTicket = { id: newTicketId, subject, status: 'in-progress' };
      
      tickets.push(newTicket);
      onboardingData.relocationSupport.tickets = tickets;
      
      db.set('onboardingData', onboardingData);
      
      return NextResponse.json({ success: true, data: newTicket });
    }

    return NextResponse.json({ success: false, error: 'Onboarding data not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
