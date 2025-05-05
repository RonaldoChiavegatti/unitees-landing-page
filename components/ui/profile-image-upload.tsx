"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  initials?: string;
  onImageUpload: (imageUrl: string) => void;
  className?: string;
}

export function ProfileImageUpload({
  currentImageUrl,
  initials = 'U',
  onImageUpload,
  className = '',
}: ProfileImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { uploadImage, loading, error } = useImageUpload();
  const { toast } = useToast();

  // Usar a imagem atual como preview inicial
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  // Manipular seleção de arquivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Criar preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // Upload da imagem
      const result = await uploadImage(file, {
        folder: 'profile-images',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.85,
      });
      
      // Passar URL para o componente pai
      onImageUpload(result.url);
      
      toast({
        title: "Imagem atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Erro ao atualizar imagem",
        description: error || "Ocorreu um erro ao fazer o upload da imagem.",
        variant: "destructive",
      });
      
      // Reverter para imagem anterior em caso de erro
      if (currentImageUrl) {
        setPreviewUrl(currentImageUrl);
      } else {
        setPreviewUrl(null);
      }
    }
    
    // Limpar input de arquivo
    e.target.value = '';
  };

  // Remover imagem
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload('');
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || undefined} alt="Foto de perfil" />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {previewUrl && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          asChild
        >
          <label>
            <Upload className="h-4 w-4" />
            <span>{previewUrl ? 'Trocar foto' : 'Adicionar foto'}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        </Button>
      </div>
    </div>
  );
} 