"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Shell } from "@/components/shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const error = searchParams.get("error");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  useEffect(() => {
    if (!auth) {
      setStatus("error");
      setErrorMessage("O Firebase não está configurado corretamente.");
      return;
    }
    
    // Se houver um erro nos parâmetros de busca
    if (error) {
      setStatus("error");
      if (error === "missing-code") {
        setErrorMessage("Código de verificação ausente.");
      } else if (error === "invalid-code") {
        setErrorMessage("Código de verificação inválido ou expirado.");
      } else {
        setErrorMessage("Ocorreu um erro ao verificar seu email.");
      }
      return;
    }
    
    // Se não tiver código oob
    if (!oobCode) {
      setStatus("error");
      setErrorMessage("Nenhum código de verificação encontrado.");
      return;
    }
    
    // Verificar o código
    const verifyEmail = async () => {
      try {
        await applyActionCode(auth, oobCode);
        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        console.error("Erro ao verificar email:", error);
        
        if (error.code === "auth/invalid-action-code") {
          setErrorMessage("O código de verificação é inválido ou expirou. Solicite um novo email de verificação.");
        } else {
          setErrorMessage("Ocorreu um erro ao verificar seu email. Por favor, tente novamente mais tarde.");
        }
      }
    };
    
    verifyEmail();
  }, [oobCode, error]);
  
  return (
    <Shell>
      <div className="container max-w-lg py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Verificação de Email</CardTitle>
            <CardDescription className="text-center">
              {status === "loading" && "Verificando seu endereço de email..."}
              {status === "success" && "Seu email foi verificado com sucesso!"}
              {status === "error" && "Falha na verificação do email"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {status === "loading" && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            )}
            
            {status === "success" && (
              <Alert className="border-green-500 mb-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Seu email foi verificado com sucesso! Agora você pode acessar todas as funcionalidades da plataforma.
                </AlertDescription>
              </Alert>
            )}
            
            {status === "error" && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4">
            {status === "success" && (
              <Button 
                onClick={() => router.push("/login")}
              >
                Ir para o login
              </Button>
            )}
            
            {status === "error" && (
              <Button 
                variant="outline"
                onClick={() => router.push("/login")}
              >
                Voltar para o login
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
} 