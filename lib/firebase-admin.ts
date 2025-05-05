import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Configurar o Firebase Admin para APIs do servidor
const adminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Verificar se as credenciais estão configuradas
const isConfigured = adminConfig.projectId && adminConfig.privateKey && adminConfig.clientEmail;

// Inicializa o Firebase Admin apenas uma vez
function getFirebaseAdmin() {
  if (!isConfigured) {
    console.warn('Firebase Admin não está configurado. Configure as variáveis de ambiente.');
    return null;
  }

  if (getApps().length === 0) {
    try {
      return initializeApp({
        credential: cert(adminConfig as any),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error) {
      console.error('Erro ao inicializar Firebase Admin:', error);
      return null;
    }
  }

  return getApps()[0];
}

const app = getFirebaseAdmin();

// Exportar serviços Firebase Admin
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const isAdminAppConfigured = Boolean(app);

export default app; 