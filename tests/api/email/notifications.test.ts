import { NextRequest } from 'next/server';
import { POST } from '@/app/api/email/notifications/route';
import { suppressConsole } from '@/tests/utils';
import { EmailService } from '@/lib/services/email-service';

// Mock das dependências
jest.mock('@/lib/services/email-service');

// Suprimir mensagens de console durante os testes
suppressConsole();

describe('API de Notificações por Email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mocks para os métodos do EmailService
    (EmailService.sendWelcomeEmail as jest.Mock).mockResolvedValue({ success: true, data: { id: 'email-id' } });
    (EmailService.sendOrderConfirmation as jest.Mock).mockResolvedValue({ success: true, data: { id: 'email-id' } });
    (EmailService.notifyPrinterAboutNewOrder as jest.Mock).mockResolvedValue({ success: true, data: { id: 'email-id' } });
  });

  it('deve retornar 400 para dados inválidos', async () => {
    // Criar uma requisição com dados inválidos
    const request = new NextRequest('http://localhost:3000/api/email/notifications', {
      method: 'POST',
      body: JSON.stringify({ type: 'welcome' }), // Dados incompletos
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

  it('deve processar com sucesso o envio de email de boas-vindas', async () => {
    // Dados para teste
    const testData = {
      type: 'welcome',
      data: {
        email: 'usuario@exemplo.com',
        name: 'Usuário Teste',
      },
    };

    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/email/notifications', {
      method: 'POST',
      body: JSON.stringify(testData),
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
    
    // Verificar se o método correto foi chamado
    expect(EmailService.sendWelcomeEmail).toHaveBeenCalledWith(
      'usuario@exemplo.com',
      'Usuário Teste'
    );
  });

  it('deve processar com sucesso o envio de confirmação de pedido', async () => {
    // Dados para teste
    const orderDetails = {
      orderId: 'order123',
      items: [{ id: 'item1', name: 'Camiseta', quantity: 1 }],
      total: 99.99,
    };
    
    const testData = {
      type: 'order_confirmation',
      data: {
        email: 'cliente@exemplo.com',
        name: 'Cliente Teste',
        orderId: 'order123',
        orderDetails: orderDetails,
      },
    };

    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/email/notifications', {
      method: 'POST',
      body: JSON.stringify(testData),
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
    
    // Verificar se o método correto foi chamado
    expect(EmailService.sendOrderConfirmation).toHaveBeenCalledWith(
      'cliente@exemplo.com',
      'Cliente Teste',
      'order123',
      orderDetails
    );
  });

  it('deve processar com sucesso a notificação para gráfica', async () => {
    // Dados para teste
    const orderDetails = {
      orderId: 'order123',
      items: [{ id: 'item1', name: 'Camiseta', quantity: 1 }],
      total: 99.99,
    };
    
    const testData = {
      type: 'printer_new_order',
      data: {
        printerEmail: 'grafica@exemplo.com',
        printerName: 'Gráfica Teste',
        orderId: 'order123',
        orderDetails: orderDetails,
      },
    };

    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/email/notifications', {
      method: 'POST',
      body: JSON.stringify(testData),
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
    
    // Verificar se o método correto foi chamado
    expect(EmailService.notifyPrinterAboutNewOrder).toHaveBeenCalledWith(
      'grafica@exemplo.com',
      'Gráfica Teste',
      'order123',
      orderDetails
    );
  });

  it('deve retornar erro quando o serviço de email falha', async () => {
    // Configurar mock para simular falha
    (EmailService.sendWelcomeEmail as jest.Mock).mockResolvedValue({ 
      success: false, 
      error: 'Falha ao enviar email' 
    });
    
    // Dados para teste
    const testData = {
      type: 'welcome',
      data: {
        email: 'usuario@exemplo.com',
        name: 'Usuário Teste',
      },
    };

    // Criar uma requisição válida
    const request = new NextRequest('http://localhost:3000/api/email/notifications', {
      method: 'POST',
      body: JSON.stringify(testData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Chamar a rota
    const response = await POST(request);
    const responseData = await response.json();

    // Verificar resposta de erro
    expect(response.status).toBe(500);
    expect(responseData.error).toBe('Falha ao enviar email');
  });
}); 