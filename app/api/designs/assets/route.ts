import { NextRequest, NextResponse } from 'next/server';
import { auth, storage, db } from '@/lib/firebase-admin';
import { customAlphabet } from 'nanoid';

// Gerar IDs únicos para arquivos
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12);

interface Asset {
  id?: string;
  userId: string;
  designId?: string;
  url: string;
  path: string;
  contentType: string;
  fileSize: number;
  fileName: string;
  originalName: string;
  createdAt: number;
  type: 'image' | 'font' | 'other';
  tags?: string[];
}

// GET /api/designs/assets - Listar assets do usuário
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    // Verificar se o Firebase Admin está configurado
    if (!auth || !db) {
      return NextResponse.json({ error: 'Serviços do Firebase não configurados' }, { status: 500 });
    }

    const token = authHeader.substring(7);
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    
    // Obter parâmetros da query
    const url = new URL(request.url);
    const designId = url.searchParams.get('designId');
    const type = url.searchParams.get('type');
    const tag = url.searchParams.get('tag');
    
    // Construir query base com Firebase Admin
    let assetsRef = db.collection('assets').where('userId', '==', userId);
    
    // Adicionar filtros adicionais se fornecidos
    if (designId) {
      assetsRef = assetsRef.where('designId', '==', designId);
    }
    
    if (type && ['image', 'font', 'other'].includes(type)) {
      assetsRef = assetsRef.where('type', '==', type);
    }
    
    if (tag) {
      assetsRef = assetsRef.where('tags', 'array-contains', tag);
    }
    
    // Executar query
    const snapshot = await assetsRef.get();
    const assets: Asset[] = [];
    
    snapshot.forEach((doc) => {
      const asset = doc.data() as Asset;
      assets.push({ id: doc.id, ...asset });
    });
    
    return NextResponse.json(assets);
    
  } catch (error: any) {
    console.error('Erro ao listar assets:', error);
    return NextResponse.json({ error: error.message || 'Erro ao listar assets' }, { status: 500 });
  }
}

// POST /api/designs/assets - Registrar novo asset
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    // Verificar se o Firebase Admin está configurado
    if (!auth || !db) {
      return NextResponse.json({ error: 'Serviços do Firebase não configurados' }, { status: 500 });
    }

    const token = authHeader.substring(7);
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    
    // Validar dados
    const body = await request.json();
    
    if (!body.url || !body.path || !body.contentType || !body.fileSize || !body.fileName) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    // Determinar tipo de asset baseado no contentType
    let type: 'image' | 'font' | 'other' = 'other';
    if (body.contentType.startsWith('image/')) {
      type = 'image';
    } else if (
      body.contentType.includes('font') || 
      ['ttf', 'otf', 'woff', 'woff2'].includes(body.fileName.split('.').pop()?.toLowerCase() || '')
    ) {
      type = 'font';
    }
    
    // Criar registro de asset com Admin SDK
    const newAsset: Asset = {
      userId,
      designId: body.designId || null,
      url: body.url,
      path: body.path,
      contentType: body.contentType,
      fileSize: body.fileSize,
      fileName: body.fileName,
      originalName: body.originalName || body.fileName,
      createdAt: Date.now(),
      type,
      tags: body.tags || []
    };
    
    const docRef = await db.collection('assets').add(newAsset);
    
    return NextResponse.json({ 
      id: docRef.id,
      ...newAsset 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Erro ao registrar asset:', error);
    return NextResponse.json({ error: error.message || 'Erro ao registrar asset' }, { status: 500 });
  }
}

// DELETE /api/designs/assets/:id - Excluir asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assetId = params.id;
    
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    // Verificar se o Firebase Admin está configurado
    if (!auth || !db || !storage) {
      return NextResponse.json({ error: 'Serviços do Firebase não configurados' }, { status: 500 });
    }

    const token = authHeader.substring(7);
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    
    // Obter o asset para verificar permissão e path do arquivo
    const assetDoc = await db.collection('assets').doc(assetId).get();
    const assetData = assetDoc.data();
    
    if (!assetData) {
      return NextResponse.json({ error: 'Asset não encontrado' }, { status: 404 });
    }
    
    if (assetData.userId !== userId) {
      return NextResponse.json({ error: 'Sem permissão para excluir este asset' }, { status: 403 });
    }
    
    // Excluir o arquivo do Storage
    try {
      const bucket = storage.bucket();
      await bucket.file(assetData.path).delete();
    } catch (error) {
      console.error('Erro ao excluir arquivo do storage:', error);
      // Continua mesmo se falhar a exclusão do arquivo
    }
    
    // Excluir o registro do Firestore usando Admin SDK
    await db.collection('assets').doc(assetId).delete();
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Erro ao excluir asset:', error);
    return NextResponse.json({ error: error.message || 'Erro ao excluir asset' }, { status: 500 });
  }
} 