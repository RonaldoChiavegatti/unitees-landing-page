"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/firebase-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { resetPassword } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Por favor, informe seu email.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await resetPassword(email);
      
      if (result) {
        setSuccess(true);
        toast({
          title: "Email enviado",
          description: "Siga as instruções no email para redefinir sua senha."
        });
      } else {
        setError("Não foi possível enviar o email. Verifique se o endereço está correto.");
      }
    } catch (error: any) {
      setError("Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
      console.error("Erro no reset de senha:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">Recuperar Senha</CardTitle>
        <CardDescription className="text-center">
          Informe seu email para receber instruções de recuperação de senha
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success ? (
          <div className="space-y-4">
            <Alert className="border-green-500 mb-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Email enviado com sucesso! Verifique sua caixa de entrada (e spam) e siga as instruções para redefinir sua senha.
              </AlertDescription>
            </Alert>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => router.push('/login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar instruções"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Lembrou sua senha? {" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Voltar para o login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
} 