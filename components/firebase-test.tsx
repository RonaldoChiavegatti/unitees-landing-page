"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export function FirebaseTest() {
  const { isConfigured, signInWithGoogle, user, logout } = useAuth();
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  // Função para testar o login com Google
  const testGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      setTestResult("success");
      setMessage("Login com Google realizado com sucesso!");
    } catch (error) {
      setTestResult("error");
      setMessage(`Erro ao fazer login: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Teste de Integração do Firebase</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Status do Firebase</h3>
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <>
                <CheckCircle className="text-green-500" />
                <span>Firebase configurado</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" />
                <span>Firebase não configurado</span>
              </>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Status do Usuário</h3>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <CheckCircle className="text-green-500" />
                <span>Usuário logado: {user.email}</span>
              </>
            ) : (
              <>
                <XCircle className="text-yellow-500" />
                <span>Nenhum usuário logado</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Ações</h3>
        <div className="flex gap-2">
          {!user ? (
            <Button onClick={testGoogleLogin} disabled={!isConfigured}>
              Testar Login com Google
            </Button>
          ) : (
            <Button onClick={logout} variant="outline">
              Fazer Logout
            </Button>
          )}
        </div>
      </div>
      
      {testResult && (
        <Alert variant={testResult === "success" ? "default" : "destructive"}>
          <AlertTitle>
            {testResult === "success" ? "Teste bem sucedido" : "Erro no teste"}
          </AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 