import { NextRequest } from 'next/server';
import { POST, PATCH } from '@/app/api/orders/route';
import { nonNullAuth as auth, nonNullDb as db, suppressConsole } from '@/tests/utils';

// Mock das dependências
jest.mock('@/lib/firebase-admin');

// Suprimir mensagens de console durante os testes
suppressConsole();

describe('API de Pedidos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mock para autenticação
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user123' });
    
    // Configurar mocks para Firestore
    const mockUserDoc = {
      data: jest.fn().mockReturnValue({
        displayName: 'Usuário Teste',
        email: 'usuario@exemplo.com'
      }),
      exists: true
    };
    
    const mockPrinterDoc = {
      data: jest.fn().mockReturnValue({
        businessName: 'Gráfica Teste',
        email: 'grafica@exemplo.com'
      }),
      exists: true
    };
    
    const mockOrderDoc = {
      data: jest.fn().mockReturnValue({
        userId: 'user123',
        printerId: 'printer456',
        status: 'pending',
        items: [],
        totalAmount: 100,
        createdAt: Date.now()
      }),
      exists: true
    };
    
    const mockNonexistentDoc = {
      exists: false
    };
    
    // Mock para referências e consultas
    const mockDocRef = {
      get: jest.fn().mockResolvedValue(mockUserDoc),
      update: jest.fn().mockResolvedValue({}),
    };
    
    const mockCollection = {
      doc: jest.fn().mockReturnValue(mockDocRef),
      add: jest.fn().mockResolvedValue({ id: 'order789' }),
    };
    
    // Configurar mock para db.collection
    (db.collection as jest.Mock).mockImplementation((collectionName) => {
      if (collectionName === 'users') {
        return {
          doc: jest.fn().mockImplementation((id) => {
            if (id === 'user123') {
              return { get: jest.fn().mockResolvedValue(mockUserDoc) };
            } else if (id === 'printer456') {
              return { get: jest.fn().mockResolvedValue(mockPrinterDoc) };
            } else {
              return { get: jest.fn().mockResolvedValue(mockNonexistentDoc) };
            }
          })
        };
      } else if (collectionName === 'orders') {
        return {
          doc: jest.fn().mockImplementation((id) => {
            if (id === 'order123') {
              return { 
                get: jest.fn().mockResolvedValue(mockOrderDoc),
                update: jest.fn().mockResolvedValue({})
              };
            } else {
              return { 
                get: jest.fn().mockResolvedValue(mockNonexistentDoc) 
              };
            }
          }),
          add: jest.fn().mockResolvedValue({ id: 'order789' })
        };
      }
      return mockCollection;
    });
  });

  describe('POST - Criar Pedido', () => {
    it('deve retornar 401 quando não há token de autenticação', async () => {
      // Criar uma requisição sem token
      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Chamar a rota
      const response = await POST(request);
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Token não fornecido');
    });

    it('deve retornar 400 para dados de pedido inválidos', async () => {
      // Dados de pedido incompletos
      const invalidOrderData = {
        // Faltando campos obrigatórios
        printerId: 'printer456',
        items: []
      };
      
      // Criar uma requisição com token mas dados inválidos
      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(invalidOrderData),
        headers: {
          'Authorization': 'Bearer valid-token',
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

    it('deve criar um pedido com sucesso', async () => {
      // Dados de pedido válidos
      const validOrderData = {
        printerId: 'printer456',
        items: [
          {
            designId: 'design123',
            designTitle: 'Camiseta Personalizada',
            designImage: 'https://exemplo.com/imagem.jpg',
            quantity: 2,
            size: 'M',
            color: 'Preto',
            price: 59.90
          }
        ],
        totalAmount: 119.80,
        shippingAddress: {
          name: 'Cliente Teste',
          street: 'Rua Exemplo, 123',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '01234-567',
          country: 'Brasil'
        },
        paymentMethod: 'pix'
      };
      
      // Criar uma requisição válida
      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
      });

      // Chamar a rota
      const response = await POST(request);
      const responseData = await response.json();

      // Verificar se a resposta foi bem-sucedida
      expect(response.status).toBe(201);
      expect(responseData.id).toBe('order789');
      expect(responseData.userId).toBe('user123');
      expect(responseData.printerId).toBe('printer456');
      expect(responseData.status).toBe('pending');
      
      // Verificar se os métodos corretos foram chamados
      expect(auth.verifyIdToken).toHaveBeenCalledWith('valid-token');
      expect(db.collection).toHaveBeenCalledWith('users');
      expect(db.collection).toHaveBeenCalledWith('orders');
    });

    it('deve retornar 404 quando a gráfica não existe', async () => {
      // Dados com uma gráfica que não existe
      const orderData = {
        printerId: 'nonexistent',  // ID de gráfica que não existe
        items: [
          {
            designId: 'design123',
            designTitle: 'Camiseta Personalizada',
            designImage: 'https://exemplo.com/imagem.jpg',
            quantity: 2,
            size: 'M',
            color: 'Preto',
            price: 59.90
          }
        ],
        totalAmount: 119.80,
        shippingAddress: {
          name: 'Cliente Teste',
          street: 'Rua Exemplo, 123',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '01234-567',
          country: 'Brasil'
        },
        paymentMethod: 'pix'
      };
      
      // Criar uma requisição válida com ID inválido
      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
      });

      // Chamar a rota
      const response = await POST(request);
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(404);
      expect(responseData.error).toBe('Gráfica não encontrada');
    });
  });

  describe('PATCH - Atualizar Pedido', () => {
    it('deve atualizar o status de um pedido com sucesso (como gráfica)', async () => {
      // Simular que o usuário autenticado é a gráfica (printerId)
      (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'printer456' });
      
      // Dados para atualização
      const updateData = {
        status: 'accepted',
        trackingNumber: 'TRACK123456',
        comments: 'Pedido aceito e em produção'
      };
      
      // Criar uma requisição válida
      const request = new NextRequest('http://localhost:3000/api/orders/order123', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
      });

      // Parâmetros da rota
      const params = { id: 'order123' };

      // Chamar a rota
      const response = await PATCH(request, { params });
      const responseData = await response.json();

      // Verificar se a resposta foi bem-sucedida
      expect(response.status).toBe(200);
      expect(responseData.id).toBe('order123');
      expect(responseData.status).toBe('accepted');
      
      // Verificar se os métodos corretos foram chamados
      expect(auth.verifyIdToken).toHaveBeenCalledWith('valid-token');
    });

    it('deve retornar 403 quando o usuário não tem permissão para atualizar o pedido', async () => {
      // Simular um usuário diferente (nem o dono do pedido nem a gráfica)
      (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'other-user' });
      
      // Dados para atualização
      const updateData = {
        status: 'cancelled'
      };
      
      // Criar uma requisição válida mas sem permissão
      const request = new NextRequest('http://localhost:3000/api/orders/order123', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
      });

      // Parâmetros da rota
      const params = { id: 'order123' };

      // Chamar a rota
      const response = await PATCH(request, { params });
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(403);
      expect(responseData.error).toBe('Sem permissão para atualizar este pedido');
    });

    it('deve retornar 404 quando o pedido não existe', async () => {
      // Dados para atualização
      const updateData = {
        status: 'cancelled'
      };
      
      // Criar uma requisição com ID de pedido inexistente
      const request = new NextRequest('http://localhost:3000/api/orders/nonexistent', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
      });

      // Parâmetros da rota
      const params = { id: 'nonexistent' };

      // Chamar a rota
      const response = await PATCH(request, { params });
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(404);
      expect(responseData.error).toBe('Pedido não encontrado');
    });
  });
}); 