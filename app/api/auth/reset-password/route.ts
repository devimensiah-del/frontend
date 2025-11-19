import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// IMPORTANT: Rate limiting is now handled by the backend middleware
// See: backend/internal/api/middleware/rate_limiter.go
// This ensures consistent rate limiting across all instances in production

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Determine redirect URL based on environment
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUrl = `${appUrl}/auth/update-password`;

    console.log(`Sending password reset email to: ${email}`);
    console.log(`Redirect URL: ${redirectUrl}`);

    // Call Supabase resetPasswordForEmail
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    // Log error but don't expose it to prevent email enumeration
    if (error) {
      console.error('Supabase reset password error:', error.message);
      // Still return success to prevent email enumeration attacks
      // (don't reveal whether email exists or not)
    }

    // Always return success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: 'Se o email existir em nossa base, você receberá instruções de recuperação'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset API error:', error);

    // Generic error message to prevent information leakage
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar solicitação. Tente novamente mais tarde.'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Método não permitido' },
    { status: 405 }
  );
}
