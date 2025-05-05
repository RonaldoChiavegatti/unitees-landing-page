"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, ImageOff } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const SafeImage = ({ src, alt, className = "", ...props }: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    // Reset states when source changes
    setLoading(true);
    setError(false);
    
    // Verifica se é um arquivo EPS e trata de forma especial
    if (src && src.toLowerCase().endsWith('.eps')) {
      // Para arquivos EPS, vamos usar a mesma URL mas substituindo a extensão por JPG
      // já que a maioria dos mockups tem versão JPG disponível
      const jpgVersion = src.replace(/\.eps$/i, '.jpg');
      
      // Cria um elemento de imagem para testar se o JPG existe
      const jpgTestImg = new Image();
      jpgTestImg.onload = () => {
        setImgSrc(jpgVersion);
        setLoading(false);
      };
      jpgTestImg.onerror = () => {
        // Se JPG falhar, tenta PNG
        const pngVersion = src.replace(/\.eps$/i, '.png');
        const pngTestImg = new Image();
        pngTestImg.onload = () => {
          setImgSrc(pngVersion);
          setLoading(false);
        };
        pngTestImg.onerror = () => {
          // Se ambos falharem, exibe um placeholder
          setImgSrc("/images/placeholder-image.svg");
          setLoading(false);
          setError(true);
          console.error(`Falha ao carregar imagem: ${src}`);
        };
        pngTestImg.src = pngVersion;
      };
      jpgTestImg.src = jpgVersion;
    } else {
      // Se não for EPS, carrega diretamente
      setImgSrc(src);
      const directTestImg = new Image();
      directTestImg.onload = () => setLoading(false);
      directTestImg.onerror = () => {
        setImgSrc("/images/placeholder-image.svg");
        setLoading(false);
        setError(true);
        console.error(`Falha ao carregar imagem: ${src}`);
      };
      directTestImg.src = src;
    }
  }, [src]);
  
  return (
    <>
      {loading && (
        <div className={`flex items-center justify-center ${className}`} style={{ backgroundColor: 'transparent', ...props.style }}>
          <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      )}
      {error && !loading && (
        <div className={`flex items-center justify-center ${className}`} style={{ backgroundColor: 'transparent', ...props.style }}>
          <ImageOff className="w-8 h-8 text-red-400" />
        </div>
      )}
      <img 
        src={imgSrc} 
        alt={alt} 
        className={`${className} ${loading || error ? 'hidden' : ''}`}
        onError={() => setError(true)}
        {...props}
      />
    </>
  );
}; 