import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { z } from 'zod';

// Schema de validação para pedidos
const OrderItemSchema = z.object({
  designId: z.string(),
  designTitle: z.string(),
  designImage: z.string(),
  quantity: z.number().int().positive(),
  size: z.string(),
  color: z.string(),
  price: z.number().nonnegative(),
});

const ShippingAddressSchema = z.object({
  name: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

const OrderSchema = z.object({
  printerId: z.string(),
  items: z.array(OrderItemSchema),
  totalAmount: z.number().nonnegative(),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.string(),
});

// POST /api/orders - Criar novo pedido
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
    
    // Validar dados do pedido
    const body = await request.json();
    const validationResult = OrderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const orderData = validationResult.data;
    
    // Adicionar dados do usuário ao pedido
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    
    // Verificar se a gráfica existe
    const printerRef = db.collection('users').doc(orderData.printerId);
    const printerDoc = await printerRef.get();
    if (!printerDoc.exists) {
      return NextResponse.json({ error: 'Gráfica não encontrada' }, { status: 404 });
    }
    const printerData = printerDoc.data();
    
    // Criar o pedido no Firestore
    const timestamp = Date.now();
    const newOrder = {
      ...orderData,
      userId,
      userName: userData?.displayName || '',
      userEmail: userData?.email || '',
      printerName: printerData?.businessName || printerData?.displayName || '',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    const docRef = await db.collection('orders').add(newOrder);
    
    // Enviar email de confirmação (será implementado depois)
    
    return NextResponse.json({ 
      id: docRef.id,
      ...newOrder 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Erro ao processar pedido:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar pedido' }, { status: 500 });
  }
}

// PATCH /api/orders/:id - Atualizar status do pedido
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
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
    
    // Obter dados do pedido
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }
    
    const orderData = orderDoc.data() as Record<string, any>;
    
    // Apenas o usuário dono do pedido ou a gráfica podem atualizar
    if (userId !== orderData.userId && userId !== orderData.printerId) {
      return NextResponse.json({ error: 'Sem permissão para atualizar este pedido' }, { status: 403 });
    }
    
    // Validar dados da atualização
    const body = await request.json();
    
    // Criar objeto com os campos permitidos para atualização
    const updateData: Record<string, any> = {
      updatedAt: Date.now()
    };
    
    // Se for a gráfica, pode atualizar status e trackingNumber
    if (userId === orderData.printerId) {
      if (body.status) {
        const validStatus = ['pending', 'accepted', 'production', 'shipped', 'delivered', 'cancelled'];
        if (!validStatus.includes(body.status)) {
          return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
        }
        updateData.status = body.status;
      }
      
      if (body.trackingNumber) {
        updateData.trackingNumber = body.trackingNumber;
      }
      
      if (body.comments) {
        updateData.comments = body.comments;
      }
    }
    
    // Se for o cliente, só pode cancelar o pedido se estiver pendente
    if (userId === orderData.userId && body.status === 'cancelled') {
      if (orderData.status !== 'pending') {
        return NextResponse.json({ 
          error: 'Não é possível cancelar um pedido que já foi aceito ou está em produção' 
        }, { status: 400 });
      }
      updateData.status = 'cancelled';
      if (body.comments) {
        updateData.comments = body.comments;
      }
    }
    
    // Atualizar o pedido
    await orderRef.update(updateData);
    
    return NextResponse.json({ 
      id: orderId,
      ...orderData,
      ...updateData
    });
    
  } catch (error: any) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json({ error: error.message || 'Erro ao atualizar pedido' }, { status: 500 });
  }
} 