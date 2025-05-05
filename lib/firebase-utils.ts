"use client";

import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User, UserRole, StudentUser, PrinterUser } from './types';

// Interface para o perfil no Firestore
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
  [key: string]: any; // Para campos adicionais específicos de cada tipo de usuário
}

/**
 * Converte um usuário do Firebase Auth para o formato da aplicação
 * Busca dados do perfil no Firestore, ou cria um novo perfil se não existir
 */
export const convertFirebaseUserToAppUser = async (
  firebaseUser: FirebaseUser
): Promise<User | StudentUser | PrinterUser | null> => {
  if (!db) {
    console.error('Firebase Firestore não está configurado');
    return null;
  }
  
  try {
    // Buscar perfil do usuário no Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    let userData: UserProfile;
    
    if (userDoc.exists()) {
      // Se o perfil já existe, usa os dados existentes
      userData = userDoc.data() as UserProfile;
    } else {
      // Se não existir, cria um novo perfil como estudante (padrão)
      const newUser: StudentUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: UserRole.STUDENT,
        createdAt: new Date().toISOString(),
        avatarUrl: firebaseUser.photoURL || undefined,
        favoriteProducts: [],
        orders: []
      };
      
      // Salva o novo perfil no Firestore
      await setDoc(userDocRef, newUser);
      
      userData = newUser;
    }
    
    // Retorna o usuário com a tipagem correta
    if (userData.role === UserRole.STUDENT) {
      return userData as StudentUser;
    } else if (userData.role === UserRole.PRINTER) {
      return userData as PrinterUser;
    }
    
    return userData as User;
  } catch (error) {
    console.error('Erro ao buscar/criar perfil do usuário:', error);
    return null;
  }
};

/**
 * Formata erros do Firebase para mensagens amigáveis
 */
export const formatFirebaseError = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Este email já está sendo usado por outra conta.',
    'auth/invalid-email': 'O formato do email é inválido.',
    'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Não existe usuário com este email.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/popup-closed-by-user': 'Login cancelado. A janela foi fechada.',
    'auth/cancelled-popup-request': 'O processo de login foi cancelado.',
    'auth/popup-blocked': 'O popup de login foi bloqueado pelo navegador.'
  };
  
  return errorMessages[errorCode] || 'Ocorreu um erro durante a autenticação.';
}; 