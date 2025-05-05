"use client";

import { useState } from 'react';
import { 
  collection, doc, getDoc, setDoc, updateDoc, 
  query, where, getDocs 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'student' | 'printer';
  university?: string;
  course?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  createdAt: number;
  updatedAt: number;
}

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isConfigured } = useAuth();

  // Verificar se o Firebase está configurado
  const checkFirebase = () => {
    if (!isConfigured || !db) {
      setError('Firebase não está configurado');
      return false;
    }
    return true;
  };

  // Criar ou atualizar perfil do usuário
  const createOrUpdateUserProfile = async (userData: Partial<UserProfile>) => {
    if (!checkFirebase() || !user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const timestamp = Date.now();
      let data: Partial<UserProfile>;
      
      if (userSnap.exists()) {
        // Atualiza usuário existente
        data = {
          ...userData,
          updatedAt: timestamp
        };
        await updateDoc(userRef, data);
      } else {
        // Cria novo usuário
        data = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || userData.displayName || '',
          photoURL: user.photoURL || userData.photoURL || '',
          role: userData.role || 'student',
          createdAt: timestamp,
          updatedAt: timestamp,
          ...userData
        };
        await setDoc(userRef, data);
      }
      
      return { uid: user.uid, ...data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar a foto de perfil do usuário
  const updateProfilePhoto = async (photoURL: string) => {
    if (!checkFirebase() || !user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const timestamp = Date.now();
      
      await updateDoc(userRef, {
        photoURL,
        updatedAt: timestamp
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar foto de perfil');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obter perfil do usuário atual
  const getCurrentUserProfile = async () => {
    if (!checkFirebase() || !user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao obter perfil');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obter usuário por ID
  const getUserById = async (userId: string) => {
    if (!checkFirebase()) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao obter usuário');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar gráficas (usuários com role 'printer')
  const getPrinters = async () => {
    if (!checkFirebase()) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const printersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'printer')
      );
      
      const querySnapshot = await getDocs(printersQuery);
      const printers: UserProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        printers.push(doc.data() as UserProfile);
      });
      
      return printers;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar gráficas');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createOrUpdateUserProfile,
    updateProfilePhoto,
    getCurrentUserProfile,
    getUserById,
    getPrinters,
    isConfigured
  };
}; 