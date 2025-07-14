import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, full_name } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Opsis Intelligence <noreply@opsisintel.com>',
      to: [email],
      subject: 'Welcome to Opsis Intelligence - Your 14-Day Trial Has Started!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ea580c;">Welcome to Opsis Intelligence!</h1>
          <p>Hi ${full_name},</p>
          <p>Thank you for signing up for Opsis Intelligence! Your 14-day free trial has started.</p>
          
          <h2>What's Next?</h2>
          <ul>
            <li>✅ Set up your supplier portfolio</li>
            <li>✅ Configure threat monitoring alerts</li>
            <li>✅ Explore real-time threat intelligence</li>
            <li>✅ Generate your first risk assessment report</li>
          </ul>
          
          <p>
            <a href="https://www.opsisintel.com" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Your Dashboard
            </a>
          </p>
          
          <p>Need help? Reply to this email or contact our support team.</p>
          
          <p>Best regards,<br>The Opsis Intelligence Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
