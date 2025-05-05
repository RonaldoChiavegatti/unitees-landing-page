import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/reset-password/route';
import { nonNullAuth as auth, suppressConsole } from '@/tests/utils';
import { EmailService } from '@/lib/services/email-service';

// Mock das dependências
jest.mock('@/lib/firebase-admin');
jest.mock('@/lib/services/email-service');

// Suprimir mensagens de console durante os testes
suppressConsole();

describe('API de Redefinição de Senha', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mock para o Firebase Auth
    (auth.generatePasswordResetLink as jest.Mock).mockResolvedValue('https://exemplo.com/redefinir-senha');
  });

  it('deve retornar 400 para dados inválidos', async () => {
    // Criar uma requisição com email inválido
    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'email-invalido' }),
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

  it('deve processar com sucesso a solicitação de redefinição de senha', async () => {
    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'usuario@exemplo.com' }),
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
    expect(auth.generatePasswordResetLink).toHaveBeenCalledWith(
      'usuario@exemplo.com',
      expect.any(Object)
    );
    expect(EmailService.sendPasswordReset).toHaveBeenCalledWith(
      'usuario@exemplo.com',
      'https://exemplo.com/redefinir-senha'
    );
  });

  it('deve tratar erro quando o Firebase retorna user-not-found', async () => {
    // Configurar o mock para simular o erro
    (auth.generatePasswordResetLink as jest.Mock).mockRejectedValue({
      code: 'auth/user-not-found',
      message: 'Usuário não encontrado',
    });

    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'naoexiste@exemplo.com' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Chamar a rota
    const response = await POST(request);
    const responseData = await response.json();

    // Para usuários não existentes, ainda retornamos sucesso por questões de segurança
    expect(response.status).toBe(200);
    expect(responseData.success).toBe(true);
    
    // Verificar se o método do Firebase foi chamado
    expect(auth.generatePasswordResetLink).toHaveBeenCalledWith(
      'naoexiste@exemplo.com',
      expect.any(Object)
    );
    
    // Verificar que não tentamos enviar email
    expect(EmailService.sendPasswordReset).not.toHaveBeenCalled();
  });
}); 