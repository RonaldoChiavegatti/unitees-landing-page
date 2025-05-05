// Polyfill para fetch em testes
require('jest-fetch-mock').enableMocks();

// Mock para o NextResponse
jest.mock('next/server', () => {
  const mockJson = jest.fn((data, options = {}) => {
    return {
      status: options.status || 200,
      json: async () => data,
      headers: new Map()
    };
  });

  return {
    NextRequest: jest.fn().mockImplementation((url, options = {}) => {
      return {
        url,
        nextUrl: new URL(url),
        method: options.method || 'GET',
        headers: {
          get: jest.fn((header) => options.headers?.[header]),
          has: jest.fn((header) => options.headers?.[header] !== undefined),
        },
        json: jest.fn().mockImplementation(() => Promise.resolve(options.body ? JSON.parse(options.body) : undefined)),
        formData: jest.fn().mockImplementation(() => Promise.resolve(options.body || new FormData())),
        cookies: new Map(),
      };
    }),
    NextResponse: {
      json: mockJson,
      redirect: jest.fn().mockImplementation((url) => ({
        url,
        status: 302,
        headers: new Map([['Location', url]]),
      })),
    }
  };
});

// Mock para o Firebase Admin
jest.mock('@/lib/firebase-admin', () => {
  return {
    auth: {
      verifyIdToken: jest.fn(),
      getUser: jest.fn(),
      generateEmailVerificationLink: jest.fn(),
      generatePasswordResetLink: jest.fn(),
    },
    db: {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      get: jest.fn(),
      add: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    storage: {
      bucket: jest.fn().mockReturnValue({
        file: jest.fn().mockReturnValue({
          save: jest.fn(),
          makePublic: jest.fn(),
          delete: jest.fn(),
        }),
      }),
    },
  };
});

// Mock para o serviço de email
jest.mock('@/lib/services/email-service', () => {
  return {
    EmailService: {
      sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
      sendOrderConfirmation: jest.fn().mockResolvedValue({ success: true }),
      notifyPrinterAboutNewOrder: jest.fn().mockResolvedValue({ success: true }),
      sendVerificationEmail: jest.fn().mockResolvedValue({ success: true }),
      sendPasswordReset: jest.fn().mockResolvedValue({ success: true }),
    },
  };
});

// Mock para nanoid
jest.mock('nanoid', () => ({
  customAlphabet: jest.fn().mockImplementation(() => jest.fn().mockReturnValue('mockid12345'))
}));

// Mock para sharp
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    metadata: jest.fn().mockResolvedValue({ width: 800, height: 600 }),
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-image-data')),
  }));
}); 