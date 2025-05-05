"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isConfigured } from "@/lib/firebase";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FirebaseAlert() {
  if (isConfigured) {
    return null;
  }

  const handleClearStorage = () => {
    try {
      localStorage.removeItem('unitees-auth-storage');
      localStorage.removeItem('unitees-mock-auth-storage');
      localStorage.setItem('zustand-migration-error', 'false');
      
      alert('LocalStorage limpo com sucesso. A página será recarregada.');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      alert('Erro ao limpar localStorage. Veja o console para mais detalhes.');
    }
  };

  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Configuração do Firebase</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          O Firebase não está configurado. Para utilizar as funcionalidades de autenticação e banco de dados,
          crie um arquivo <code>.env.local</code> com as variáveis de ambiente necessárias.
        </p>
        <p>
          Consulte o README do projeto para mais informações.
        </p>
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={handleClearStorage}>
            Limpar LocalStorage
          </Button>
          <span className="text-xs ml-2">
            (Use em caso de erros de autenticação/migração)
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
} 