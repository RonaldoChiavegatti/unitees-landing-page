import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/firebase-admin';
import { EmailService } from '@/lib/services/email-service';

// Esquema de validação para o corpo da requisição
const requestSchema = z.object({
  email: z.string().email('Email inválido'),
  userId: z.string().min(1, 'ID de usuário é obrigatório'),
});

/**
 * Rota de API para enviar email de verificação
 * POST /api/auth/verify-email
 */
export async function POST(request: NextRequest) {
  try {
    // Extrair e validar o corpo da requisição
    const body = await request.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, userId } = result.data;

    // Verificar se o Firebase Admin está configurado
    if (!auth) {
      return NextResponse.json(
        { error: 'Serviço de autenticação não configurado' },
        { status: 500 }
      );
    }

    try {
      // Verificar se o usuário existe
      await auth.getUser(userId);
      
      // Gerar link de verificação usando Firebase Admin
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login?verification=success`,
        handleCodeInApp: true,
      };
      
      const verificationLink = await auth.generateEmailVerificationLink(email, actionCodeSettings);
      
      // Enviar email com o link de verificação
      await EmailService.sendVerificationEmail(email, verificationLink);

      // Resposta de sucesso
      return NextResponse.json(
        { success: true, message: 'Email de verificação enviado com sucesso' },
        { status: 200 }
      );
    } catch (firebaseError: any) {
      console.error('Erro do Firebase:', firebaseError);

      // Verificar limites de taxa (rate limits)
      if (firebaseError.code === 'auth/too-many-requests') {
        return NextResponse.json(
          { error: 'Muitas solicitações. Tente novamente mais tarde.' },
          { status: 429 }
        );
      }

      // Se o usuário não existe
      if (firebaseError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      throw firebaseError;
    }
  } catch (error: any) {
    console.error('Erro ao enviar email de verificação:', error);

    // Outros erros
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const oobCode = searchParams.get('oobCode');
  
  if (!oobCode) {
    return NextResponse.redirect(new URL('/verificacao-email?error=missing-code', request.url));
  }
  
  try {
    // Verificar o código oob do Firebase
    // Este código não é diretamente verificável no servidor, então vamos redirecionar para
    // uma página que usa o SDK do cliente para validar
    return NextResponse.redirect(new URL(`/verificacao-email?oobCode=${oobCode}`, request.url));
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return NextResponse.redirect(new URL('/verificacao-email?error=invalid-code', request.url));
  }
} 