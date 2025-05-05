"use client";

import React, { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";

interface SVGRendererProps {
  src: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SVGRenderer = ({ src, width, height, className = "", style = {} }: SVGRendererProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Se a fonte é uma data URL SVG, extraímos o conteúdo
    if (src.startsWith('data:image/svg+xml;base64,')) {
      try {
        const base64Content = src.replace('data:image/svg+xml;base64,', '');
        const decodedContent = atob(base64Content);
        setSvgContent(decodedContent);
        setLoaded(true);
      } catch (err) {
        console.error('Erro ao decodificar SVG:', err);
        setError(true);
      }
    } else if (src.startsWith('data:image/svg+xml,')) {
      try {
        const content = decodeURIComponent(src.replace('data:image/svg+xml,', ''));
        setSvgContent(content);
        setLoaded(true);
      } catch (err) {
        console.error('Erro ao decodificar SVG:', err);
        setError(true);
      }
    } else {
      // Se for uma URL externa, fazemos fetch
      fetch(src)
        .then(response => response.text())
        .then(data => {
          setSvgContent(data);
          setLoaded(true);
        })
        .catch(err => {
          console.error('Erro ao carregar SVG:', err);
          setError(true);
        });
    }
  }, [src]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-red-50 ${className}`} 
        style={{ width: `${width}px`, height: `${height}px`, ...style }}
      >
        <ImageIcon className="h-8 w-8 text-red-400" />
      </div>
    );
  }

  if (!loaded || !svgContent) {
    return (
      <div 
        className={`flex items-center justify-center bg-slate-100 animate-pulse ${className}`} 
        style={{ width: `${width}px`, height: `${height}px`, ...style }}
      >
        <ImageIcon className="h-8 w-8 text-slate-400" />
      </div>
    );
  }

  // Sanitizamos o SVG para evitar vulnerabilidades XSS
  const sanitizedSvg = svgContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove tags de script
    .replace(/on\w+="[^"]*"/g, '') // Remove manipuladores de eventos
    .replace(/on\w+='[^']*'/g, '');

  // Ajustamos o SVG para ter o tamanho correto
  const modifiedSvg = sanitizedSvg
    .replace(/<svg/, `<svg width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"`);
    
  return (
    <div 
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, ...style }}
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
      data-svg="true"
    />
  );
}; 