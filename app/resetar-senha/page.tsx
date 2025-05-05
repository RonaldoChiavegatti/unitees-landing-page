"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Shell } from "@/components/shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  
  const [status, setStatus] = useState<"verifying" | "ready" | "submitting" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  
  useEffect(() => {
    if (!auth) {
      setStatus("error");
      setErrorMessage("O Firebase não está configurado corretamente.");
      return;
    }
    
    if (!oobCode) {
      setStatus("error");
      setErrorMessage("Código de redefinição de senha ausente. Certifique-se de clicar no link enviado por email.");
      return;
    }
    
    // Verificar o código OOB
    const verifyCode = async () => {
      try {
        // Verifica se o código é válido e retorna o email associado
        const resolvedEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(resolvedEmail);
        setStatus("ready");
      } catch (error: any) {
        console.error("Erro ao verificar código de redefinição:", error);
        setStatus("error");
        
        if (error.code === "auth/invalid-action-code") {
          setErrorMessage("Este link de redefinição de senha é inválido ou já foi utilizado. Solicite um novo email de redefinição.");
        } else {
          setErrorMessage("Ocorreu um erro ao verificar o link de redefinição. Tente solicitar um novo link.");
        }
      }
    };
    
    verifyCode();
  }, [oobCode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem. Verifique e tente novamente.");
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    setStatus("submitting");
    setErrorMessage("");
    
    try {
      // Confirmar a redefinição de senha
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setStatus("success");
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setStatus("error");
      
      if (error.code === "auth/weak-password") {
        setErrorMessage("A senha é muito fraca. Use pelo menos 6 caracteres combinando letras e números.");
      } else if (error.code === "auth/invalid-action-code") {
        setErrorMessage("Este link de redefinição expirou ou já foi utilizado. Solicite um novo email.");
      } else {
        setErrorMessage("Ocorreu um erro ao redefinir sua senha. Tente novamente mais tarde.");
      }
    }
  };
  
  return (
    <Shell>
      <div className="container max-w-lg py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Redefinir Senha</CardTitle>
            <CardDescription className="text-center">
              {status === "verifying" && "Verificando seu link de redefinição..."}
              {status === "ready" && `Defina uma nova senha para ${email}`}
              {status === "submitting" && "Atualizando sua senha..."}
              {status === "success" && "Senha atualizada com sucesso!"}
              {status === "error" && "Falha na redefinição de senha"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {status === "verifying" || status === "submitting" ? (
              <div className="flex justify-center py-6">
                <div className="animate-pulse flex space-x-4 items-center">
                  <Lock className="h-6 w-6 text-blue-500" />
                  <div className="text-sm text-gray-500">
                    {status === "verifying" ? "Verificando..." : "Atualizando senha..."}
                  </div>
                </div>
              </div>
            ) : status === "ready" ? (
              <form onSubmit={handleSubmit}>
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="mt-2">
                    Redefinir senha
                  </Button>
                </div>
              </form>
            ) : status === "success" ? (
              <Alert className="border-green-500 mb-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Sua senha foi atualizada com sucesso! Agora você pode fazer login com sua nova senha.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4">
            {status === "success" && (
              <Button onClick={() => router.push("/login")}>
                Ir para o login
              </Button>
            )}
            
            {status === "error" && (
              <Button variant="outline" onClick={() => router.push("/esqueci-senha")}>
                Solicitar novo link
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
} 