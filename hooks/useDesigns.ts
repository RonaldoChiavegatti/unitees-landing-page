"use client";

import { useState } from 'react';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, Timestamp, DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface Design {
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  previewUrls?: string[];
  colors?: string[];
  tags?: string[];
  category?: string;
  price?: number;
  ownerId: string;
  ownerName?: string;
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  createdAt: number;
  updatedAt: number;
}

export const useDesigns = () => {
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

  // Obter todos os designs publicados
  const getPublishedDesigns = async (limitCount = 20) => {
    if (!checkFirebase()) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const designsQuery = query(
        collection(db, 'designs'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(designsQuery);
      const designs: Design[] = [];
      
      querySnapshot.forEach((doc) => {
        designs.push({ id: doc.id, ...doc.data() } as Design);
      });
      
      return designs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar designs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obter designs em destaque
  const getFeaturedDesigns = async (limitCount = 10) => {
    if (!checkFirebase()) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const designsQuery = query(
        collection(db, 'designs'),
        where('status', '==', 'published'),
        where('featured', '==', true),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(designsQuery);
      const designs: Design[] = [];
      
      querySnapshot.forEach((doc) => {
        designs.push({ id: doc.id, ...doc.data() } as Design);
      });
      
      return designs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar designs em destaque');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obter designs por categoria
  const getDesignsByCategory = async (category: string, limitCount = 20) => {
    if (!checkFirebase()) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const designsQuery = query(
        collection(db, 'designs'),
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(designsQuery);
      const designs: Design[] = [];
      
      querySnapshot.forEach((doc) => {
        designs.push({ id: doc.id, ...doc.data() } as Design);
      });
      
      return designs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar designs por categoria');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obter designs do usuário atual
  const getUserDesigns = async () => {
    if (!checkFirebase() || !user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const designsQuery = query(
        collection(db, 'designs'),
        where('ownerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(designsQuery);
      const designs: Design[] = [];
      
      querySnapshot.forEach((doc) => {
        designs.push({ id: doc.id, ...doc.data() } as Design);
      });
      
      return designs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar seus designs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obter design por ID
  const getDesignById = async (designId: string) => {
    if (!checkFirebase()) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const designRef = doc(db, 'designs', designId);
      const designSnap = await getDoc(designRef);
      
      if (designSnap.exists()) {
        return { id: designSnap.id, ...designSnap.data() } as Design;
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar design');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fazer upload de imagem do design
  const uploadDesignImage = async (file: File, designId: string, fileName = 'main') => {
    if (!checkFirebase() || !user || !storage) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const storageRef = ref(storage, `designs/${designId}/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      return downloadUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Criar ou atualizar design
  const createOrUpdateDesign = async (designData: Partial<Design>, imageFile?: File) => {
    if (!checkFirebase() || !user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const timestamp = Date.now();
      let designId = designData.id;
      let imageUrl = designData.imageUrl;
      
      // Se tem ID, é atualização; se não, é criação
      if (designId) {
        // Upload de nova imagem se fornecida
        if (imageFile) {
          imageUrl = await uploadDesignImage(imageFile, designId);
        }
        
        // Atualizar design existente
        const designRef = doc(db, 'designs', designId);
        const updateData = {
          ...designData,
          imageUrl,
          updatedAt: timestamp
        };
        await updateDoc(designRef, updateData as DocumentData);
        
        return { id: designId, ...updateData } as Design;
      } else {
        // Criar novo design
        const newDesign = {
          ...designData,
          ownerId: user.uid,
          status: designData.status || 'draft',
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        const docRef = await addDoc(collection(db, 'designs'), newDesign);
        designId = docRef.id;
        
        // Upload de imagem se fornecida
        if (imageFile) {
          imageUrl = await uploadDesignImage(imageFile, designId);
          
          // Atualizar com a URL da imagem
          await updateDoc(docRef, { imageUrl });
        }
        
        return { id: designId, ...newDesign, imageUrl } as Design;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar design');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Excluir design
  const deleteDesign = async (designId: string) => {
    if (!checkFirebase() || !user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Verificar se o usuário é o proprietário
      const designRef = doc(db, 'designs', designId);
      const designSnap = await getDoc(designRef);
      
      if (!designSnap.exists()) {
        setError('Design não encontrado');
        return false;
      }
      
      const designData = designSnap.data();
      
      if (designData.ownerId !== user.uid) {
        setError('Você não tem permissão para excluir este design');
        return false;
      }
      
      // Excluir documento
      await deleteDoc(designRef);
      
      // Excluir imagens associadas (opcional)
      try {
        const storageRef = ref(storage, `designs/${designId}`);
        await deleteObject(storageRef);
      } catch (storageErr) {
        // Ignora erros de storage, pode não haver imagens ou pasta
        console.warn('Erro ao excluir imagens:', storageErr);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir design');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getPublishedDesigns,
    getFeaturedDesigns,
    getDesignsByCategory,
    getUserDesigns,
    getDesignById,
    createOrUpdateDesign,
    deleteDesign,
    uploadDesignImage,
    isConfigured
  };
}; 