"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  isConfigured: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = !!auth;
  const isEmailVerified = user?.emailVerified || false;

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) throw new Error('Firebase não está configurado');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!isConfigured) throw new Error('Firebase não está configurado');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Enviar email de verificação após o cadastro
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user, {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login?verification=success`,
      });
      
      // Enviar email de boas-vindas
      try {
        await fetch('/api/email/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'welcome',
            data: {
              email: userCredential.user.email,
              name: userCredential.user.displayName || 'Usuário',
            },
          }),
        });
      } catch (error) {
        console.error('Erro ao enviar email de boas-vindas:', error);
      }
    }
  };

  const logout = async () => {
    if (!isConfigured) return;
    setUser(null);
    await signOut(auth);
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) throw new Error('Firebase não está configurado');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const resetPassword = async (email: string) => {
    if (!isConfigured) throw new Error('Firebase não está configurado');
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async () => {
    if (!isConfigured) throw new Error('Firebase não está configurado');
    if (!user) throw new Error('Usuário não autenticado');
    await sendEmailVerification(user, {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login?verification=success`,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logout,
        signInWithGoogle,
        resetPassword,
        sendVerificationEmail,
        isConfigured,
        isEmailVerified
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 