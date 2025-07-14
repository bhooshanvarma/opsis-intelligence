// FILE 1: app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await sql`
      SELECT id, email, password_hash, full_name, company_name, role, subscription_tier, trial_ends_at
      FROM users WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        company_name: user.company_name,
        role: user.role,
        subscription_tier: user.subscription_tier,
        trial_ends_at: user.trial_ends_at
      }
    });

    response.cookies.set('session', JSON.stringify({ userId: user.id }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================================================

// FILE 2: app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0
  });

  return response;
}

// ============================================================================

// FILE 3: app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const session = JSON.parse(sessionCookie.value);
    
    if (!session.userId) {
      return NextResponse.json({ user: null });
    }

    const result = await sql`
      SELECT id, email, full_name, company_name, role, subscription_tier, trial_ends_at
      FROM users WHERE id = ${session.userId}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}

// ============================================================================

// FILE 4: app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    const result = await sql`
      SELECT id, email, full_name, company_name, role, subscription_tier, trial_ends_at
      FROM users WHERE id = ${session.userId}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================================================

// FILE 5: app/api/suppliers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    const result = await sql`
      SELECT id, name, location, industry, criticality, risk_score, threats, status
      FROM suppliers WHERE user_id = ${session.userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Suppliers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { name, location, industry, criticality, risk_score } = await request.json();

    const result = await sql`
      INSERT INTO suppliers (user_id, name, location, industry, criticality, risk_score)
      VALUES (${session.userId}, ${name}, ${location}, ${industry}, ${criticality}, ${risk_score})
      RETURNING *
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Create supplier error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================================================

// FILE 6: app/api/threats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT id, title, description, severity, impact, type, source, affected_suppliers, date
      FROM threats
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Threats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================================================

// FILE 7: app/api/emails/welcome/route.ts
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

// ============================================================================

// FILE 8: app/api/payments/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();
    
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    let priceId;
    switch (plan) {
      case 'professional':
        priceId = 'price_professional'; // Replace with actual Stripe price ID
        break;
      case 'team':
        priceId = 'price_team'; // Replace with actual Stripe price ID
        break;
      default:
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      metadata: {
        userId: session.userId,
        plan: plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
