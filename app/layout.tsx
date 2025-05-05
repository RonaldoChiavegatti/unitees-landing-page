import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import GlobalChatWidget from '@/components/global-chat-widget'
import { AuthProvider } from '@/components/auth/auth-provider'
import { FirebaseAlert } from '@/components/firebase-alert'
import { initStorageErrorHandling } from '@/lib/storage-utils'

// Inicializar tratamento de erros de migração do localStorage
if (typeof window !== 'undefined') {
  initStorageErrorHandling();
}

export const metadata: Metadata = {
  title: 'UniTees - Camisetas Universitárias Personalizadas',
  description: 'UniTees - Crie, personalize e compre suas camisetas universitárias diretamente de gráficas próximas',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <div className="relative flex min-h-screen flex-col">
              <FirebaseAlert />
              {children}
            </div>
            <Toaster />
            <GlobalChatWidget />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
