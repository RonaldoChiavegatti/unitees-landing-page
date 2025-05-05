import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { EmailService } from '@/lib/services/email-service';

// Esquema de validação para notificação de boas-vindas
const welcomeSchema = z.object({
  type: z.literal('welcome'),
  data: z.object({
    email: z.string().email('Email inválido'),
    name: z.string().min(1, 'Nome é obrigatório'),
  }),
});

// Esquema de validação para notificação de confirmação de pedido
const orderConfirmationSchema = z.object({
  type: z.literal('order_confirmation'),
  data: z.object({
    email: z.string().email('Email inválido'),
    name: z.string().min(1, 'Nome é obrigatório'),
    orderId: z.string().min(1, 'ID do pedido é obrigatório'),
    orderDetails: z.any(),
  }),
});

// Esquema de validação para notificação de novo pedido para gráfica
const printerNotificationSchema = z.object({
  type: z.literal('printer_new_order'),
  data: z.object({
    printerEmail: z.string().email('Email inválido'),
    printerName: z.string().min(1, 'Nome é obrigatório'),
    orderId: z.string().min(1, 'ID do pedido é obrigatório'),
    orderDetails: z.any(),
  }),
});

// União dos esquemas para validar todos os tipos de notificação
const notificationSchema = z.discriminatedUnion('type', [
  welcomeSchema,
  orderConfirmationSchema,
  printerNotificationSchema,
]);

/**
 * Rota de API para enviar emails de notificação
 * POST /api/email/notifications
 */
export async function POST(request: NextRequest) {
  try {
    // Extrair e validar o corpo da requisição
    const body = await request.json();
    const result = notificationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { type, data } = result.data;
    let emailResult;

    // Enviar o email adequado com base no tipo de notificação
    switch (type) {
      case 'welcome':
        emailResult = await EmailService.sendWelcomeEmail(data.email, data.name);
        break;
      case 'order_confirmation':
        emailResult = await EmailService.sendOrderConfirmation(
          data.email,
          data.name,
          data.orderId,
          data.orderDetails
        );
        break;
      case 'printer_new_order':
        emailResult = await EmailService.notifyPrinterAboutNewOrder(
          data.printerEmail,
          data.printerName,
          data.orderId,
          data.orderDetails
        );
        break;
    }

    // Verificar se o email foi enviado com sucesso
    if (!emailResult?.success) {
      return NextResponse.json(
        { error: 'Falha ao enviar email', details: emailResult?.error },
        { status: 500 }
      );
    }

    // Resposta de sucesso
    return NextResponse.json(
      { success: true, message: 'Email enviado com sucesso', data: emailResult.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erro ao enviar email de notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação', message: error.message },
      { status: 500 }
    );
  }
} 