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
