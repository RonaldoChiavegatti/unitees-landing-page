import { Resend } from 'resend';

// Verificar se a API key está configurada
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Inicializar o cliente Resend com a chave de API se disponível
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Interface para configuração de email
export interface EmailConfig {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer;
  }>;
}

// Classe EmailService para envio de emails
export class EmailService {
  private static readonly DEFAULT_FROM = 'Unitees <no-reply@unitees.app>';

  /**
   * Envia um email através do Resend
   */
  static async sendEmail(config: EmailConfig) {
    try {
      // Verificar se o Resend está configurado
      if (!resend) {
        console.error('Serviço de email não configurado. Verifique a variável RESEND_API_KEY.');
        return { success: false, error: 'Serviço de email não configurado' };
      }

      // Configuração padrão do remetente se não for fornecida
      const from = config.from || this.DEFAULT_FROM;

      // Enviar email usando Resend
      const data = await resend.emails.send({
        from,
        to: config.to,
        subject: config.subject,
        html: config.html,
        reply_to: config.replyTo,
        cc: config.cc,
        bcc: config.bcc,
        attachments: config.attachments,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }
  }

  /**
   * Envia um email de boas-vindas para novos usuários
   */
  static async sendWelcomeEmail(email: string, name: string) {
    const subject = 'Bem-vindo à Unitees!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Bem-vindo à Unitees!</h1>
        <p>Olá ${name},</p>
        <p>Estamos muito felizes em ter você como parte da nossa comunidade. Na Unitees, 
        você pode criar, personalizar e comprar camisetas universitárias de forma fácil e rápida.</p>
        <p>Aqui estão algumas coisas que você pode fazer:</p>
        <ul>
          <li>Explorar designs populares</li>
          <li>Criar seus próprios designs</li>
          <li>Conectar-se com gráficas locais</li>
          <li>Compartilhar seus designs com amigos</li>
        </ul>
        <p>Se precisar de ajuda, não hesite em nos contatar.</p>
        <p>Atenciosamente,<br>Equipe Unitees</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Envia um email de confirmação de pedido
   */
  static async sendOrderConfirmation(email: string, name: string, orderId: string, orderDetails: any) {
    const subject = `Confirmação do Pedido #${orderId}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Seu pedido foi confirmado!</h1>
        <p>Olá ${name},</p>
        <p>Agradecemos por seu pedido na Unitees.</p>
        <p><strong>Número do pedido:</strong> #${orderId}</p>
        <p>Os detalhes completos do seu pedido podem ser acessados na sua conta.</p>
        <p>Você receberá atualizações sobre o status do seu pedido por email.</p>
        <p>Atenciosamente,<br>Equipe Unitees</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Envia um email de notificação para a gráfica sobre um novo pedido
   */
  static async notifyPrinterAboutNewOrder(printerEmail: string, printerName: string, orderId: string, orderDetails: any) {
    const subject = `Novo Pedido #${orderId} - Unitees`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Novo Pedido Recebido!</h1>
        <p>Olá ${printerName},</p>
        <p>Você recebeu um novo pedido através da plataforma Unitees.</p>
        <p><strong>Número do pedido:</strong> #${orderId}</p>
        <p>Por favor, acesse sua conta na plataforma para ver os detalhes completos do pedido e confirmar o recebimento.</p>
        <p>Atenciosamente,<br>Equipe Unitees</p>
      </div>
    `;

    return this.sendEmail({
      to: printerEmail,
      subject,
      html,
    });
  }

  /**
   * Envia um email de recuperação de senha
   */
  static async sendPasswordReset(email: string, resetLink: string) {
    const subject = 'Recuperação de Senha - Unitees';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha para sua conta na Unitees.</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <p style="text-align: center;">
          <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
            Redefinir Senha
          </a>
        </p>
        <p>Se você não solicitou esta recuperação, pode ignorar este email.</p>
        <p>Este link expirará em 1 hora por motivos de segurança.</p>
        <p>Atenciosamente,<br>Equipe Unitees</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Envia um email de verificação
   */
  static async sendVerificationEmail(email: string, verificationLink: string) {
    const subject = 'Verifique seu Email - Unitees';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Verificação de Email</h1>
        <p>Obrigado por se cadastrar na Unitees!</p>
        <p>Por favor, clique no botão abaixo para verificar seu endereço de email:</p>
        <p style="text-align: center;">
          <a href="${verificationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
            Verificar Email
          </a>
        </p>
        <p>Se você não solicitou esta verificação, pode ignorar este email.</p>
        <p>Este link expirará em 1 hora por motivos de segurança.</p>
        <p>Atenciosamente,<br>Equipe Unitees</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }
}

export default EmailService; 