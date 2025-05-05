import { NextRequest } from 'next/server';
import { POST } from '@/app/api/upload/route';
import { nonNullAuth as auth, nonNullStorage as storage, suppressConsole } from '@/tests/utils';

// Mock das dependências
jest.mock('@/lib/firebase-admin');

// Suprimir mensagens de console durante os testes
suppressConsole();

// Mock do sharp para processamento de imagens
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    metadata: jest.fn().mockResolvedValue({ width: 800, height: 600 }),
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-image-data')),
  }));
});

// Mock da função nanoid
jest.mock('nanoid', () => ({
  customAlphabet: jest.fn(() => () => 'mockid12345'),
}));

describe('API de Upload de Imagens - Validação de Autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mock para autenticação
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user123' });
    
    // Configurar mock para o bucket do Storage
    const mockFile = {
      save: jest.fn().mockResolvedValue({}),
      makePublic: jest.fn().mockResolvedValue({}),
    };
    
    const mockBucket = {
      file: jest.fn().mockReturnValue(mockFile),
      name: 'meu-bucket',
    };
    
    (storage.bucket as jest.Mock).mockReturnValue(mockBucket);
  });

  it('deve retornar 401 quando não há token de autenticação', async () => {
    // Criar uma requisição sem token
    const request = new NextRequest('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Chamar a rota
    const response = await POST(request);
    const responseData = await response.json();

    // Verificar resposta
    expect(response.status).toBe(401);
    expect(responseData.error).toBe('Token não fornecido');
  });
}); 