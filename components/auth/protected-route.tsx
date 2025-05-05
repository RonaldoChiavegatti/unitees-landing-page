"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/firebase-auth";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthUpdate } from "./auth-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Obter o contexto de atualização da autenticação
  const { lastUpdate } = useAuthUpdate();
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Função para verificar a autenticação
    const checkAuth = async () => {
      // Se já verificou a autenticação, não verifica novamente
      if (authChecked) return;
      
      // Se o Firebase ainda está carregando, espera mais um pouco
      if (isLoading) {
        timeoutId = setTimeout(checkAuth, 100);
        return;
      }
      
      // Verifica se existe uma inconsistência entre o estado armazenado e o Firebase Auth
      const currentFirebaseUser = auth?.currentUser;
      if (!currentFirebaseUser && isAuthenticated) {
        console.log("ProtectedRoute: Inconsistência detectada entre estado armazenado e Firebase Auth");
        
        // Tenta limpar o estado
        try {
          await logout();
        } catch (error) {
          console.error("Erro ao limpar estado inconsistente:", error);
        }
        
        // Armazena a URL atual para redirecionamento após login
        if (pathname !== redirectTo) {
          sessionStorage.setItem('auth_redirect', pathname);
        }
        
        // Redireciona para login
        router.push(redirectTo);
        return;
      }
      
      // Se não está autenticado, redireciona para login
      if (!isAuthenticated || !user) {
        // Armazena a URL atual para redirecionamento após login
        if (pathname !== redirectTo) {
          sessionStorage.setItem('auth_redirect', pathname);
        }
        router.push(redirectTo);
        return;
      }
      
      // Se há restrição de perfil e o usuário não tem o perfil necessário
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          // Redireciona para a página apropriada com base no perfil
          const userHomepage = user.role === UserRole.STUDENT 
            ? '/minha-conta' 
            : '/painel-grafica';
          
          router.push(userHomepage);
          return;
        }
      }
      
      // Tudo verificado, pode mostrar o conteúdo
      setAuthChecked(true);
      setIsCheckingAuth(false);
    };
    
    // Inicia a verificação
    checkAuth();
    
    // Limpa o timeout se o componente for desmontado
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAuthenticated, isLoading, user, router, pathname, redirectTo, allowedRoles, authChecked, logout, lastUpdate]);
  
  // Enquanto verifica a autenticação, mostra o loader
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // Se passou por todas as verificações, renderiza o conteúdo
  return <>{children}</>;
} 