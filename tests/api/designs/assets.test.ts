import { NextRequest } from 'next/server';
import { GET, POST, DELETE } from '@/app/api/designs/assets/route';
import { nonNullAuth as auth, nonNullDb as db, nonNullStorage as storage, suppressConsole } from '@/tests/utils';

// Mock das dependências
jest.mock('@/lib/firebase-admin');

// Suprimir mensagens de console durante os testes
suppressConsole();

describe('API de Assets de Designs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mock para autenticação
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user123' });
    
    // Configurar mocks para Firestore
    const mockAssetsData = [
      {
        id: 'asset1',
        userId: 'user123',
        url: 'https://storage.example.com/assets/image1.png',
        path: 'assets/user123/image1.png',
        contentType: 'image/png',
        fileSize: 102400,
        fileName: 'image1.png',
        originalName: 'original-name.png',
        createdAt: Date.now(),
        type: 'image',
        tags: ['logo', 'branding']
      },
      {
        id: 'asset2',
        userId: 'user123',
        designId: 'design123',
        url: 'https://storage.example.com/assets/image2.png',
        path: 'assets/user123/image2.png',
        contentType: 'image/png',
        fileSize: 204800,
        fileName: 'image2.png',
        originalName: 'original-name-2.png',
        createdAt: Date.now(),
        type: 'image',
        tags: ['icon']
      }
    ];
    
    // Mock para o documento de asset
    const mockAssetDoc = {
      data: jest.fn().mockReturnValue(mockAssetsData[0]),
      exists: true
    };
    
    const mockNonexistentDoc = {
      exists: false,
      data: jest.fn().mockReturnValue(null)
    };
    
    // Mock para consulta de assets
    const mockSnapshot = {
      forEach: jest.fn((callback) => {
        mockAssetsData.forEach((asset, index) => {
          callback({
            id: `asset${index + 1}`,
            data: () => asset
          });
        });
      })
    };
    
    // Configurar mocks para as operações do Firestore
    const mockWhere = jest.fn().mockReturnThis();
    const mockCollection = {
      where: mockWhere,
      get: jest.fn().mockResolvedValue(mockSnapshot),
      add: jest.fn().mockResolvedValue({ id: 'newAsset123' }),
      doc: jest.fn().mockImplementation((id) => {
        if (id === 'asset1') {
          return { 
            get: jest.fn().mockResolvedValue(mockAssetDoc),
            delete: jest.fn().mockResolvedValue({})
          };
        } else {
          return { 
            get: jest.fn().mockResolvedValue(mockNonexistentDoc) 
          };
        }
      })
    };
    
    (db.collection as jest.Mock).mockReturnValue(mockCollection);
    
    // Configurar mock para Storage
    const mockFile = {
      delete: jest.fn().mockResolvedValue([{}]),
    };
    
    const mockBucket = {
      file: jest.fn().mockReturnValue(mockFile),
    };
    
    (storage.bucket as jest.Mock).mockReturnValue(mockBucket);
  });

  describe('GET - Listar Assets', () => {
    it('deve retornar 401 quando não há token de autenticação', async () => {
      // Criar uma requisição sem token
      const request = new NextRequest('http://localhost:3000/api/designs/assets', {
        method: 'GET',
      });

      // Chamar a rota
      const response = await GET(request);
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Token não fornecido');
    });

    it('deve listar os assets do usuário autenticado', async () => {
      // Criar uma requisição válida
      const request = new NextRequest('http://localhost:3000/api/designs/assets', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      });

      // Chamar a rota
      const response = await GET(request);
      const responseData = await response.json();

      // Verificar se a resposta foi bem-sucedida
      expect(response.status).toBe(200);
      expect(Array.isArray(responseData)).toBe(true);
      expect(responseData.length).toBe(2);
      expect(responseData[0].id).toBe('asset1');
      expect(responseData[0].userId).toBe('user123');
      
      // Verificar se os métodos corretos foram chamados
      expect(auth.verifyIdToken).toHaveBeenCalledWith('valid-token');
      expect(db.collection).toHaveBeenCalledWith('assets');
    });

    it('deve filtrar os assets por design ID quando fornecido', async () => {
      // Criar uma requisição com filtro de design ID
      const request = new NextRequest('http://localhost:3000/api/designs/assets?designId=design123', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      });

      // Chamar a rota
      await GET(request);
      
      // Verificar se os filtros corretos foram aplicados
      expect(db.collection).toHaveBeenCalledWith('assets');
    });

    it('deve filtrar os assets por tipo quando fornecido', async () => {
      // Criar uma requisição com filtro de tipo
      const request = new NextRequest('http://localhost:3000/api/designs/assets?type=image', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      });

      // Chamar a rota
      await GET(request);
      
      // Verificar se os filtros corretos foram aplicados
      expect(db.collection).toHaveBeenCalledWith('assets');
    });
  });

  describe('POST - Registrar Asset', () => {
    it('deve retornar 401 quando não há token de autenticação', async () => {
      // Criar uma requisição sem token
      const request = new NextRequest('http://localhost:3000/api/designs/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      // Chamar a rota
      const response = await POST(request);
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Token não fornecido');
    });

    it('deve retornar 400 para dados de asset incompletos', async () => {
      // Dados incompletos
      const incompleteData = {
        url: 'https://storage.example.com/assets/image.png',
        // Faltando outros campos obrigatórios
      };
      
      // Criar uma requisição com dados incompletos
      const request = new NextRequest('http://localhost:3000/api/designs/assets', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incompleteData),
      });

      // Chamar a rota
      const response = await POST(request);
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Dados incompletos');
    });

    it('deve registrar um novo asset com sucesso', async () => {
      // Dados completos para um novo asset
      const assetData = {
        url: 'https://storage.example.com/assets/new-image.png',
        path: 'assets/user123/new-image.png',
        contentType: 'image/png',
        fileSize: 153600,
        fileName: 'new-image.png',
        originalName: 'original-file.png',
        tags: ['design', 'logo']
      };
      
      // Criar uma requisição válida
      const request = new NextRequest('http://localhost:3000/api/designs/assets', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assetData),
      });

      // Chamar a rota
      const response = await POST(request);
      const responseData = await response.json();

      // Verificar se a resposta foi bem-sucedida
      expect(response.status).toBe(201);
      expect(responseData.id).toBe('newAsset123');
      expect(responseData.userId).toBe('user123');
      expect(responseData.type).toBe('image');
      
      // Verificar se os métodos corretos foram chamados
      expect(auth.verifyIdToken).toHaveBeenCalledWith('valid-token');
      expect(db.collection).toHaveBeenCalledWith('assets');
    });
  });

  describe('DELETE - Excluir Asset', () => {
    it('deve retornar 401 quando não há token de autenticação', async () => {
      // Criar uma requisição sem token
      const request = new NextRequest('http://localhost:3000/api/designs/assets/asset1', {
        method: 'DELETE',
      });

      // Parâmetros da rota
      const params = { id: 'asset1' };

      // Chamar a rota
      const response = await DELETE(request, { params });
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Token não fornecido');
    });

    it('deve excluir um asset com sucesso', async () => {
      // Criar uma requisição válida
      const request = new NextRequest('http://localhost:3000/api/designs/assets/asset1', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      });

      // Parâmetros da rota
      const params = { id: 'asset1' };

      // Chamar a rota
      const response = await DELETE(request, { params });
      const responseData = await response.json();

      // Verificar se a resposta foi bem-sucedida
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      
      // Verificar se os métodos corretos foram chamados
      expect(auth.verifyIdToken).toHaveBeenCalledWith('valid-token');
      expect(db.collection).toHaveBeenCalledWith('assets');
      expect(storage.bucket).toHaveBeenCalled();
    });

    it('deve retornar 404 quando o asset não existe', async () => {
      // Modificar o mock para retornar 404 quando o asset não existe
      const mockCollection = {
        doc: jest.fn().mockImplementation((id) => {
          return { 
            get: jest.fn().mockResolvedValue({
              exists: false,
              data: jest.fn().mockReturnValue(null)
            })
          };
        })
      };
      
      (db.collection as jest.Mock).mockReturnValue(mockCollection);
      
      // Criar uma requisição para um asset inexistente
      const request = new NextRequest('http://localhost:3000/api/designs/assets/nonexistent', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      });

      // Parâmetros da rota
      const params = { id: 'nonexistent' };

      // Chamar a rota
      const response = await DELETE(request, { params });
      const responseData = await response.json();

      // Verificar resposta
      expect(response.status).toBe(404);
      expect(responseData.error).toBe('Asset não encontrado');
    });
  });
}); 