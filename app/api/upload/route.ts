import { NextRequest, NextResponse } from 'next/server';
import { auth, storage } from '@/lib/firebase-admin';
import { customAlphabet } from 'nanoid';
import sharp from 'sharp';

// Gerar IDs únicos para arquivos
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16);

// Processamento e upload de imagens
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    // Verificar se o Firebase Admin está configurado
    if (!auth) {
      return NextResponse.json({ error: 'Serviço de autenticação não configurado' }, { status: 500 });
    }

    const token = authHeader.substring(7);
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    
    // Verificar se é um FormData
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Formato inválido, envie um FormData' }, { status: 400 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderPath = formData.get('folder') as string || 'uploads';
    const optimize = formData.get('optimize') !== 'false'; // Por padrão, otimiza
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo encontrado' }, { status: 400 });
    }
    
    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Envie uma imagem JPEG, PNG, WebP ou GIF' },
        { status: 400 }
      );
    }
    
    // Verificar tamanho do arquivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Tamanho máximo de arquivo é 10MB' },
        { status: 400 }
      );
    }
    
    // Processar a imagem com sharp se solicitado
    let processedImageBuffer: Buffer;
    let fileExtension: string;
    let contentType: string;
    
    if (optimize) {
      // Converter o File para um Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Processar com sharp para otimizar e redimensionar se necessário
      const maxWidth = 1200; // Largura máxima
      const metadata = await sharp(buffer).metadata();
      
      // Se a imagem for muito grande, redimensionar
      if (metadata.width && metadata.width > maxWidth) {
        processedImageBuffer = await sharp(buffer)
          .resize(maxWidth)
          .webp({ quality: 85 }) // Converter para WebP para melhor compressão
          .toBuffer();
        fileExtension = 'webp';
        contentType = 'image/webp';
      } else {
        // Otimizar sem redimensionar
        processedImageBuffer = await sharp(buffer)
          .webp({ quality: 85 })
          .toBuffer();
        fileExtension = 'webp';
        contentType = 'image/webp';
      }
    } else {
      // Usar o arquivo original sem processamento
      const arrayBuffer = await file.arrayBuffer();
      processedImageBuffer = Buffer.from(arrayBuffer);
      
      // Determinar a extensão do arquivo original
      fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      contentType = file.type;
    }
    
    // Criar um nome de arquivo único
    const fileName = `${nanoid()}.${fileExtension}`;
    const fullPath = `${folderPath}/${userId}/${fileName}`;
    
    // Fazer upload para o Firebase Storage
    if (!storage) {
      return NextResponse.json({ error: 'Storage não configurado' }, { status: 500 });
    }
    
    const bucket = storage.bucket();
    const fileRef = bucket.file(fullPath);
    
    await fileRef.save(processedImageBuffer, {
      metadata: {
        contentType,
        metadata: {
          userId,
          originalName: file.name,
          optimized: optimize ? 'true' : 'false'
        }
      }
    });
    
    // Obter a URL pública do arquivo
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fullPath}`;
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: fullPath,
      fileName,
      contentType,
      size: processedImageBuffer.length
    });
    
  } catch (error: any) {
    console.error('Erro ao processar upload:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar upload' },
      { status: 500 }
    );
  }
} 