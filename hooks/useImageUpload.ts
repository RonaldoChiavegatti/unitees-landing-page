"use client";

import { useState } from 'react';
import { useAuth } from './useAuth';

interface UploadOptions {
  folder?: string;
  optimize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

interface UploadResult {
  url: string;
  path: string;
  fileName: string;
  contentType: string;
  size: number;
}

export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user, getIdToken } = useAuth();

  // Pré-processar imagem no cliente (redimensionar se necessário)
  const preprocessImage = async (
    file: File,
    { maxWidth = 1200, maxHeight = 1200, quality = 0.85 }: UploadOptions
  ): Promise<File> => {
    // Se não for uma imagem, retorna o arquivo original
    if (!file.type.startsWith('image/')) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        // Verificar se a imagem precisa ser redimensionada
        if (img.width <= maxWidth && img.height <= maxHeight) {
          URL.revokeObjectURL(img.src);
          resolve(file); // Retorna o arquivo original se estiver dentro dos limites
          return;
        }
        
        // Calcular novas dimensões mantendo proporção
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (img.width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (img.height * maxWidth) / img.width;
        }
        
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (img.width * maxHeight) / img.height;
        }
        
        // Criar canvas para redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(img.src);
          reject(new Error('Não foi possível criar contexto de canvas'));
          return;
        }
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Converter para Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              URL.revokeObjectURL(img.src);
              reject(new Error('Falha ao converter imagem'));
              return;
            }
            
            // Criar novo arquivo com o blob processado
            const newFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            URL.revokeObjectURL(img.src);
            resolve(newFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Erro ao carregar imagem'));
      };
    });
  };

  // Upload de imagem com autenticação
  const uploadImage = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    setLoading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Obter token de autenticação
      const token = await getIdToken();
      if (!token) {
        throw new Error('Não foi possível obter token de autenticação');
      }
      
      // Pré-processar imagem no cliente se necessário
      let processedFile = file;
      if (options.optimize !== false) {
        processedFile = await preprocessImage(file, options);
      }
      
      // Criar FormData para envio
      const formData = new FormData();
      formData.append('file', processedFile);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.optimize === false) {
        formData.append('optimize', 'false');
      }
      
      // Enviar para a API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload');
      }
      
      const result = await response.json();
      return result as UploadResult;
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido no upload';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };
  
  // Upload múltiplo de imagens
  const uploadMultipleImages = async (
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    setLoading(true);
    setProgress(0);
    setError(null);
    
    const results: UploadResult[] = [];
    let completed = 0;
    
    try {
      for (const file of files) {
        const result = await uploadImage(file, options);
        results.push(result);
        
        completed++;
        setProgress(Math.floor((completed / files.length) * 100));
      }
      
      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido no upload múltiplo';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    preprocessImage,
    loading,
    progress,
    error,
  };
}; 