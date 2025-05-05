"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useAuthStore } from "@/lib/firebase-auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isConfigured } from "@/lib/firebase";
import { convertFirebaseUserToAppUser } from "@/lib/firebase-utils";

// Contexto para forçar atualizações em componentes que dependem da autenticação
type AuthUpdateContextType = {
  forceUpdate: () => void;
  lastUpdate: number;
};

const AuthUpdateContext = createContext<AuthUpdateContextType>({
  forceUpdate: () => {},
  lastUpdate: 0
});

// Hook para acessar o contexto
export const useAuthUpdate = () => useContext(AuthUpdateContext);

// Limpar possíveis dados inconsistentes do localStorage
const cleanupLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      // Limpar possíveis dados antigos ou inconsistentes
      localStorage.removeItem('unitees-mock-auth-storage');
      
      // Verificar se existe algum estado de autenticação persistido
      const storedAuth = localStorage.getItem('unitees-auth-storage');
      
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth);
          
          // Se existe um estado persistido mas está corrompido ou incompleto, limpa
          if (!parsedAuth || 
              typeof parsedAuth !== 'object' || 
              !('state' in parsedAuth) || 
              !parsedAuth.state || 
              typeof parsedAuth.state !== 'object') {
            localStorage.removeItem('unitees-auth-storage');
          }
        } catch (e) {
          // Se houver erro ao fazer parse do JSON, provavelmente está corrompido
          localStorage.removeItem('unitees-auth-storage');
        }
      }
    } catch (e) {
      console.error("Erro ao limpar localStorage:", e);
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Função para forçar atualização em componentes que usam o contexto
  const forceUpdate = () => {
    setLastUpdate(Date.now());
  };
  
  // Executar limpeza no primeiro carregamento do componente
  useEffect(() => {
    cleanupLocalStorage();
  }, []);
  
  useEffect(() => {
    // Função para sincronizar o estado com o Firebase Auth
    const syncAuthState = async () => {
      // Se o Firebase não estiver configurado, não faz nada
      if (!isConfigured || !auth) {
        setIsInitialized(true);
        return;
      }
      
      // Limpa qualquer estado inconsistente quando o usuário abre a aplicação pela primeira vez
      // ou quando recarrega a página e o estado armazenado pode estar desatualizado
      const handleInitialStateSync = () => {
        const currentState = useAuthStore.getState();
        
        // Se temos um usuário no estado salvo, mas não no Firebase Auth,
        // isso indica que o usuário foi deslogado ou a sessão expirou
        if (currentState.isAuthenticated && currentState.user && !auth.currentUser) {
          console.log("AuthProvider: Limpando estado inconsistente durante inicialização");
          
          // Limpa o estado
          useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
          
          // Limpa o localStorage para evitar problemas futuros
          if (typeof window !== "undefined") {
            localStorage.removeItem("unitees-auth-storage");
          }
          
          // Força atualização
          forceUpdate();
        }
      };
      
      // Tenta sincronizar o estado inicial
      handleInitialStateSync();
      
      // Observa mudanças no estado de autenticação
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        // Usamos a função setState diretamente para evitar problemas de stale closure
        const set = useAuthStore.setState;
        
        if (firebaseUser) {
          // Se tiver usuário autenticado, converte para o formato da aplicação
          set({ isLoading: true });
          
          try {
            const appUser = await convertFirebaseUserToAppUser(firebaseUser);
            
            if (appUser) {
              set({
                user: appUser,
                isAuthenticated: true,
                isLoading: false
              });
              
              // Força atualização
              forceUpdate();
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false
              });
              
              // Força atualização
              forceUpdate();
            }
          } catch (error) {
            console.error("Erro ao carregar perfil do usuário:", error);
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
            
            // Força atualização
            forceUpdate();
          }
        } else {
          // Se existe um usuário no estado mas não no Firebase Auth,
          // precisamos verificar se é um problema de persistência ou se o usuário realmente fez logout
          const currentState = useAuthStore.getState();
          
          // Se tem usuário no estado mas não no Firebase, limpa o estado
          if (currentState.isAuthenticated && currentState.user) {
            console.log("Sessão expirada ou inválida, limpando estado");
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
            
            // Limpa o localStorage
            if (typeof window !== "undefined") {
              localStorage.removeItem("unitees-auth-storage");
            }
            
            // Força atualização
            forceUpdate();
          } else {
            // Se já não tem usuário no estado, só garante que o estado está limpo
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
            
            // Força atualização
            forceUpdate();
          }
        }
        
        // Marca como inicializado
        setIsInitialized(true);
      });
      
      // Limpa o observer quando o componente for desmontado
      return () => unsubscribe();
    };
    
    syncAuthState();
  }, []);
  
  // Só renderiza os filhos quando a sincronização for concluída
  if (!isInitialized) {
    // Pode adicionar um loader aqui se desejar
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <AuthUpdateContext.Provider value={{ forceUpdate, lastUpdate }}>
      {children}
    </AuthUpdateContext.Provider>
  );
} 