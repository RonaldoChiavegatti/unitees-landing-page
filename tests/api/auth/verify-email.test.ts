import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/verify-email/route';
import { nonNullAuth as auth, suppressConsole } from '@/tests/utils';
import { EmailService } from '@/lib/services/email-service';

// Mock das dependências
jest.mock('@/lib/firebase-admin');
jest.mock('@/lib/services/email-service');

// Suprimir mensagens de console durante os testes
suppressConsole();

describe('API de Verificação de Email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mock para o Firebase Auth
    (auth.getUser as jest.Mock).mockResolvedValue({ uid: 'user123', email: 'usuario@exemplo.com' });
    (auth.generateEmailVerificationLink as jest.Mock).mockResolvedValue('https://exemplo.com/verificar-email');
    
    // Configurar mock para o serviço de email
    (EmailService.sendVerificationEmail as jest.Mock).mockResolvedValue({ success: true });
  });

  it('deve retornar 400 para dados inválidos', async () => {
    // Criar uma requisição com email inválido
    const request = new NextRequest('http://localhost:3000/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'email-invalido' }), // Faltando userId
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Chamar a rota
    const response = await POST(request);
    const responseData = await response.json();

    // Verificar resposta
    expect(response.status).toBe(400);
    expect(responseData.error).toBe('Dados inválidos');
  });

  it('deve processar com sucesso o envio de email de verificação', async () => {
    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ 
        email: 'usuario@exemplo.com',
        userId: 'user123'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Chamar a rota
    const response = await POST(request);
    const responseData = await response.json();

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(200);
    expect(responseData.success).toBe(true);
    
    // Verificar se os métodos corretos foram chamados
    expect(auth.getUser).toHaveBeenCalledWith('user123');
    expect(auth.generateEmailVerificationLink).toHaveBeenCalledWith(
      'usuario@exemplo.com',
      expect.any(Object)
    );
    expect(EmailService.sendVerificationEmail).toHaveBeenCalledWith(
      'usuario@exemplo.com',
      'https://exemplo.com/verificar-email'
    );
  });

  it('deve retornar 404 quando o usuário não existe', async () => {
    // Configurar o mock para simular o erro
    (auth.getUser as jest.Mock).mockRejectedValue({
      code: 'auth/user-not-found',
      message: 'Usuário não encontrado',
    });

    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ 
        email: 'naoexiste@exemplo.com',
        userId: 'user-inexistente'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Chamar a rota
    const response = await POST(request);
    const responseData = await response.json();

    // Verificar resposta
    expect(response.status).toBe(404);
    expect(responseData.error).toBe('Usuário não encontrado');
    
    // Verificar se o método do Firebase foi chamado
    expect(auth.getUser).toHaveBeenCalledWith('user-inexistente');
    
    // Verificar que não tentamos gerar link ou enviar email
    expect(auth.generateEmailVerificationLink).not.toHaveBeenCalled();
    expect(EmailService.sendVerificationEmail).not.toHaveBeenCalled();
  });

  it('deve retornar 429 quando há muitas requisições (rate limit)', async () => {
    // Configurar o mock para simular erro de rate limit
    (auth.getUser as jest.Mock).mockResolvedValue({ uid: 'user123', email: 'usuario@exemplo.com' });
    (auth.generateEmailVerificationLink as jest.Mock).mockRejectedValue({
      code: 'auth/too-many-requests',
      message: 'Muitas solicitações. Tente novamente mais tarde.',
    });

    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ 
        email: 'usuario@exemplo.com',
        userId: 'user123'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Chamar a rota
    const response = await POST(request);
    const responseData = await response.json();

    // Verificar resposta
    expect(response.status).toBe(429);
    expect(responseData.error).toBe('Muitas solicitações. Tente novamente mais tarde.');
    
    // Verificar que não tentamos enviar email
    expect(EmailService.sendVerificationEmail).not.toHaveBeenCalled();
  });
}); 