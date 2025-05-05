"use client";

/**
 * Utility functions to handle Zustand storage issues
 */

/**
 * Limpa qualquer dado persistido no localStorage relacionado à autenticação
 */
export const clearAuthStorages = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Limpar todos os storages relacionados à autenticação
    localStorage.removeItem('unitees-auth-storage');
    localStorage.removeItem('unitees-mock-auth-storage');
    
    // Marcar que o problema foi resolvido
    localStorage.setItem('zustand-migration-error', 'false');
    
    console.log('Storages de autenticação limpos com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao limpar storages de autenticação:', error);
    return false;
  }
};

/**
 * Verifica se existe algum problema de migração ou inconsistência nos dados armazenados
 */
export const checkStorageIntegrity = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Verificar se o erro de migração já está marcado
    const migrationError = localStorage.getItem('zustand-migration-error');
    if (migrationError === 'true') return true;
    
    // Verificar se os armazenamentos estão inconsistentes
    const authStorage = localStorage.getItem('unitees-auth-storage');
    const mockAuthStorage = localStorage.getItem('unitees-mock-auth-storage');
    
    if (authStorage) {
      try {
        const parsedAuth = JSON.parse(authStorage);
        if (!parsedAuth || !parsedAuth.state) {
          // Dados corrompidos
          localStorage.setItem('zustand-migration-error', 'true');
          return true;
        }
      } catch (e) {
        // Erro ao fazer parse do JSON
        localStorage.setItem('zustand-migration-error', 'true');
        return true;
      }
    }
    
    if (mockAuthStorage) {
      try {
        const parsedMock = JSON.parse(mockAuthStorage);
        if (!parsedMock || !parsedMock.state) {
          // Dados corrompidos
          localStorage.setItem('zustand-migration-error', 'true');
          return true;
        }
      } catch (e) {
        // Erro ao fazer parse do JSON
        localStorage.setItem('zustand-migration-error', 'true');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao verificar integridade dos storages:', error);
    return false;
  }
};

/**
 * Inicializa o monitoramento de erros de migração do Zustand
 */
export const initStorageErrorHandling = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Adicionar listeners para capturar erros relacionados ao Zustand
    const originalError = console.error;
    console.error = function(...args: any[]) {
      const errorString = args.join(' ');
      if (
        errorString.includes('migrate function was provided') ||
        errorString.includes('Zustand') ||
        errorString.includes('storage')
      ) {
        localStorage.setItem('zustand-migration-error', 'true');
      }
      originalError.apply(console, args);
    };
    
    // Verificar a integridade dos dados armazenados
    if (checkStorageIntegrity()) {
      // Se houver problemas, limpar os storages
      clearAuthStorages();
      
      // Recarregar a página para aplicar as alterações
      setTimeout(() => window.location.reload(), 500);
    }
  } catch (error) {
    console.error('Erro ao inicializar tratamento de erros de storage:', error);
  }
}; 