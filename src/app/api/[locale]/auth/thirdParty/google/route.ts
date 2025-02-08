import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const text = await request.text();

    let body;
    console.log('text', text);
    
    try {
      body = JSON.parse(text);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { token } = body;
    console.log('user token', token);
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: payload });

    console.log('user payload response', response);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Server error', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}