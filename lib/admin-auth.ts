import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN_KEY = 'admin-token';

// Simple token generation (base64 encoded username:timestamp)
export function generateToken(username: string): string {
  const payload = `${username}:${Date.now()}:${process.env.ADMIN_PASSWORD}`;
  return Buffer.from(payload).toString('base64');
}

// Validate credentials
export function validateCredentials(username: string, password: string): boolean {
  return (
    username === (process.env.ADMIN_USERNAME || 'admin') &&
    password === (process.env.ADMIN_PASSWORD || 'admin123')
  );
}

// Check admin auth from request headers
export function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, , password] = decoded.split(':');
    return username === (process.env.ADMIN_USERNAME || 'admin') && 
           password === (process.env.ADMIN_PASSWORD || 'admin123');
  } catch {
    return false;
  }
}

// Return unauthorized response
export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
