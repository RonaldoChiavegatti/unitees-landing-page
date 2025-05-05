import { auth, db, storage } from '@/lib/firebase-admin';

// Assertivas não-nulas para Firebase Admin
export const nonNullAuth = auth!;
export const nonNullDb = db!;
export const nonNullStorage = storage!;

// Utilitários para suprimir logs durante testes
export const suppressConsole = () => {
  const originalConsoleError = console.error;
  
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });
}; 