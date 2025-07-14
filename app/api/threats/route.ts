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
