import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/firebase-admin';
import { EmailService } from '@/lib/services/email-service';

// Esquema de validação para o corpo da requisição
const requestSchema = z.object({
  email: z.string().email('Email inválido'),
});

/**
 * Rota de API para solicitar redefinição de senha
 * POST /api/auth/reset-password
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

    const { email } = result.data;

    // Verificar se o Firebase Admin está configurado
    if (!auth) {
      return NextResponse.json(
        { error: 'Serviço de autenticação não configurado' },
        { status: 500 }
      );
    }

    try {
      // Gerar link de redefinição de senha usando Firebase Admin
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`,
        handleCodeInApp: true,
      };
      
      const resetLink = await auth.generatePasswordResetLink(email, actionCodeSettings);
      
      // Enviar email com o link gerado
      await EmailService.sendPasswordReset(email, resetLink);

      // Resposta de sucesso
      return NextResponse.json(
        { success: true, message: 'Email de recuperação enviado com sucesso' },
        { status: 200 }
      );
    } catch (firebaseError: any) {
      console.error('Erro do Firebase:', firebaseError);

      // Verificar se é um erro conhecido do Firebase
      if (firebaseError.code === 'auth/user-not-found') {
        // Não informamos ao usuário que o email não existe por segurança
        return NextResponse.json(
          { success: true, message: 'Se o email estiver registrado, você receberá um link de recuperação' },
          { status: 200 }
        );
      }

      throw firebaseError;
    }
  } catch (error: any) {
    console.error('Erro ao enviar email de redefinição de senha:', error);

    // Outros erros
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação', message: error.message },
      { status: 500 }
    );
  }
} 