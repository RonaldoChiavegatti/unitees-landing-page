"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isConfigured } from './firebase';
import { User, UserRole, StudentUser, PrinterUser, AuthSession, LoginData, SignupData } from './types';
import { UserProfile, convertFirebaseUserToAppUser, formatFirebaseError } from './firebase-utils';

// Tipos da loja de autenticação
interface AuthStore extends AuthSession {
  login: (data: LoginData) => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  signup: (data: SignupData) => Promise<User | null>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<UserProfile>) => Promise<User | null>;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
}

// Função para limpar o localStorage (uso em caso de problemas)
const clearAuthStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('unitees-auth-storage');
  }
};

// Criação da loja Zustand para autenticação
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Login com email e senha
      login: async (data: LoginData) => {
        set({ isLoading: true });
        
        if (!isConfigured || !auth) {
          console.error('Firebase não está configurado');
          set({ isLoading: false });
          return null;
        }
        
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );
          
          const appUser = await convertFirebaseUserToAppUser(userCredential.user);
          
          if (appUser) {
            set({
              user: appUser,
              isAuthenticated: true,
              isLoading: false
            });
            return appUser;
          }
          
          set({ isLoading: false });
          return null;
        } catch (error: any) {
          console.error('Erro no login:', error);
          
          if (error.code) {
            console.error('Erro formatado:', formatFirebaseError(error.code));
          }
          
          set({ isLoading: false });
          return null;
        }
      },
      
      // Login com Google
      loginWithGoogle: async () => {
        set({ isLoading: true });
        
        if (!isConfigured || !auth) {
          console.error('Firebase não está configurado');
          set({ isLoading: false });
          return null;
        }
        
        try {
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);
          
          const appUser = await convertFirebaseUserToAppUser(userCredential.user);
          
          if (appUser) {
            set({
              user: appUser,
              isAuthenticated: true,
              isLoading: false
            });
            return appUser;
          }
          
          set({ isLoading: false });
          return null;
        } catch (error: any) {
          console.error('Erro no login com Google:', error);
          
          if (error.code) {
            console.error('Erro formatado:', formatFirebaseError(error.code));
          }
          
          set({ isLoading: false });
          return null;
        }
      },
      
      // Registro de novo usuário
      signup: async (data: SignupData) => {
        set({ isLoading: true });
        
        if (!isConfigured || !auth || !db) {
          console.error('Firebase não está configurado');
          set({ isLoading: false });
          return null;
        }
        
        try {
          // Criar conta no Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );
          
          // Enviar email de verificação
          await sendEmailVerification(userCredential.user);
          
          // Criar perfil no Firestore
          const newUser: User = {
            id: userCredential.user.uid,
            email: data.email,
            name: data.name,
            role: data.role,
            createdAt: new Date().toISOString(),
            avatarUrl: data.role === UserRole.STUDENT 
              ? '/images/avatars/student-default.jpg' 
              : '/images/avatars/printer-default.jpg'
          };
          
          // Adicionar campos específicos para cada tipo de usuário
          let appUser: User | StudentUser | PrinterUser;
          
          if (data.role === UserRole.STUDENT) {
            const studentUser = newUser as StudentUser;
            studentUser.favoriteProducts = [];
            studentUser.orders = [];
            appUser = studentUser;
          } else if (data.role === UserRole.PRINTER) {
            const printerUser = newUser as PrinterUser;
            printerUser.companyName = '';
            printerUser.address = '';
            printerUser.city = '';
            printerUser.state = '';
            printerUser.zipCode = '';
            printerUser.phone = '';
            printerUser.description = '';
            printerUser.services = [];
            printerUser.rating = 0;
            printerUser.reviewCount = 0;
            printerUser.deliveryTime = '';
            printerUser.verified = false;
            printerUser.products = [];
            appUser = printerUser;
          } else {
            appUser = newUser;
          }
          
          // Salvar no Firestore
          await setDoc(doc(db, 'users', appUser.id), appUser);
          
          set({
            user: appUser,
            isAuthenticated: true,
            isLoading: false
          });
          
          return appUser;
        } catch (error: any) {
          console.error('Erro no cadastro:', error);
          
          if (error.code) {
            console.error('Erro formatado:', formatFirebaseError(error.code));
          }
          
          set({ isLoading: false });
          throw error; // Propaga o erro para ser tratado no componente
        }
      },
      
      // Logout
      logout: async () => {
        set({ isLoading: true });
        
        if (!isConfigured || !auth) {
          console.error('Firebase não está configurado');
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false 
          });
          return;
        }
        
        try {
          // Primeiro, limpa o estado
          set({
            user: null,
            isAuthenticated: false,
            isLoading: true
          });
          
          // Depois, faz logout no Firebase
          await signOut(auth);
          
          // Limpa qualquer dado persistido
          clearAuthStorage();
          
          // Confirma que o processo foi concluído
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        } catch (error) {
          console.error('Erro no logout:', error);
          
          // Mesmo se houver erro, garante que o estado local esteja limpo
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },
      
      // Atualização de perfil
      updateProfile: async (userData: Partial<UserProfile>) => {
        set({ isLoading: true });
        
        if (!isConfigured || !db) {
          console.error('Firebase não está configurado');
          set({ isLoading: false });
          return null;
        }
        
        const currentUser = get().user;
        
        if (!currentUser) {
          set({ isLoading: false });
          return null;
        }
        
        try {
          // Atualizar dados no Firestore
          await updateDoc(doc(db, 'users', currentUser.id), userData);
          
          // Criar usuário atualizado
          const updatedUser = {
            ...currentUser,
            ...userData
          };
          
          set({
            user: updatedUser,
            isLoading: false
          });
          
          return updatedUser;
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error);
          set({ isLoading: false });
          return null;
        }
      },
      
      // Redefinir senha
      resetPassword: async (email: string) => {
        set({ isLoading: true });
        
        if (!isConfigured || !auth) {
          console.error('Firebase não está configurado');
          set({ isLoading: false });
          return false;
        }
        
        try {
          await sendPasswordResetEmail(auth, email);
          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('Erro ao enviar email de redefinição de senha:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      // Enviar email de verificação
      sendVerificationEmail: async () => {
        if (!isConfigured || !auth || !auth.currentUser) {
          console.error('Firebase não está configurado ou usuário não está logado');
          return false;
        }
        
        try {
          await sendEmailVerification(auth.currentUser);
          return true;
        } catch (error) {
          console.error('Erro ao enviar email de verificação:', error);
          return false;
        }
      }
    }),
    {
      name: 'unitees-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
      version: 1,
      migrate: (persistedState, version) => {
        // Se o estado persistido não tiver a estrutura esperada, retorna um estado limpo
        if (!persistedState || typeof persistedState !== 'object') {
          return {
            user: null,
            isAuthenticated: false
          };
        }
        
        // Se a versão for diferente, podemos fazer migrações específicas
        // Neste caso, para simplificar, apenas garantimos que temos a estrutura básica
        return {
          user: persistedState.user || null,
          isAuthenticated: !!persistedState.isAuthenticated
        };
      }
    },
  ),
); 