"use client";

import { useState, useEffect } from 'react';
import { 
  collection, doc, getDocs, getDoc, addDoc, query, 
  where, orderBy, limit, onSnapshot, 
  setDoc, Timestamp, DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface ChatMessage {
  id?: string;
  chatId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface ChatThread {
  id: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  participantImages?: Record<string, string>;
  lastMessage?: string;
  lastMessageDate?: number;
  unreadCount: number;
}

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const { user, isConfigured } = useAuth();

  // Verificar se o Firebase está configurado
  const checkFirebase = () => {
    if (!isConfigured || !db) {
      setError('Firebase não está configurado');
      return false;
    }
    return true;
  };

  // Criar ou obter ID de chat entre dois usuários
  const getChatId = async (userId1: string, userId2: string) => {
    // Ordena os IDs para garantir consistência
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  };

  // Enviar mensagem
  const sendMessage = async (recipientId: string, message: string, senderName: string) => {
    if (!checkFirebase() || !user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const chatId = await getChatId(user.uid, recipientId);
      const timestamp = Date.now();
      
      // Criar thread de chat se não existir
      const threadRef = doc(db, 'chatThreads', chatId);
      const threadSnap = await getDoc(threadRef);
      
      if (!threadSnap.exists()) {
        await setDoc(threadRef, {
          participantIds: [user.uid, recipientId],
          participantNames: {
            [user.uid]: senderName,
            [recipientId]: '' // Nome do destinatário será atualizado quando ele responder
          },
          lastMessage: message,
          lastMessageDate: timestamp,
          unreadCount: 1
        });
      } else {
        // Atualizar thread existente
        const threadData = threadSnap.data();
        const participantNames = threadData.participantNames || {};
        
        // Manter nome atual se já existir
        if (!participantNames[user.uid]) {
          participantNames[user.uid] = senderName;
        }
        
        await setDoc(threadRef, {
          ...threadData,
          participantNames,
          lastMessage: message,
          lastMessageDate: timestamp,
          unreadCount: (threadData.unreadCount || 0) + 1
        }, { merge: true });
      }
      
      // Adicionar mensagem
      const newMessage: Omit<ChatMessage, 'id'> = {
        chatId,
        senderId: user.uid,
        senderName,
        recipientId,
        message,
        read: false,
        createdAt: timestamp
      };
      
      const messageRef = await addDoc(collection(db, 'chatMessages'), newMessage);
      return { id: messageRef.id, ...newMessage };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar threads de chat do usuário atual
  const getChatThreads = async () => {
    if (!checkFirebase() || !user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const threadsQuery = query(
        collection(db, 'chatThreads'),
        where('participantIds', 'array-contains', user.uid),
        orderBy('lastMessageDate', 'desc')
      );
      
      const querySnapshot = await getDocs(threadsQuery);
      const chatThreads: ChatThread[] = [];
      
      querySnapshot.forEach((doc) => {
        chatThreads.push({ id: doc.id, ...doc.data() } as ChatThread);
      });
      
      setThreads(chatThreads);
      return chatThreads;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar conversas');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Ouvir alterações nas threads de chat em tempo real
  const subscribeToChatThreads = () => {
    if (!checkFirebase() || !user) return () => {};
    
    const threadsQuery = query(
      collection(db, 'chatThreads'),
      where('participantIds', 'array-contains', user.uid),
      orderBy('lastMessageDate', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      threadsQuery,
      (snapshot) => {
        const chatThreads: ChatThread[] = [];
        snapshot.forEach((doc) => {
          chatThreads.push({ id: doc.id, ...doc.data() } as ChatThread);
        });
        setThreads(chatThreads);
      },
      (err) => {
        setError(`Erro ao ouvir conversas: ${err.message}`);
      }
    );
    
    return unsubscribe;
  };

  // Buscar mensagens de um chat específico
  const getChatMessages = async (chatId: string, messageLimit = 50) => {
    if (!checkFirebase() || !user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const messagesQuery = query(
        collection(db, 'chatMessages'),
        where('chatId', '==', chatId),
        orderBy('createdAt', 'desc'),
        limit(messageLimit)
      );
      
      const querySnapshot = await getDocs(messagesQuery);
      const chatMessages: ChatMessage[] = [];
      
      querySnapshot.forEach((doc) => {
        chatMessages.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      
      // Inverte para ordem cronológica
      chatMessages.reverse();
      
      setMessages(chatMessages);
      return chatMessages;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar mensagens');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Ouvir alterações nas mensagens em tempo real
  const subscribeToChatMessages = (chatId: string, messageLimit = 50) => {
    if (!checkFirebase() || !user) return () => {};
    
    const messagesQuery = query(
      collection(db, 'chatMessages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'desc'),
      limit(messageLimit)
    );
    
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const chatMessages: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          chatMessages.push({ id: doc.id, ...doc.data() } as ChatMessage);
        });
        
        // Inverte para ordem cronológica
        chatMessages.reverse();
        setMessages(chatMessages);
        
        // Marcar mensagens recebidas como lidas
        chatMessages.forEach((msg) => {
          if (msg.recipientId === user.uid && !msg.read) {
            markMessageAsRead(msg.id!);
          }
        });
        
        // Atualizar contador de não lidas na thread
        updateUnreadCount(chatId);
      },
      (err) => {
        setError(`Erro ao ouvir mensagens: ${err.message}`);
      }
    );
    
    return unsubscribe;
  };

  // Marcar mensagem como lida
  const markMessageAsRead = async (messageId: string) => {
    if (!checkFirebase()) return false;
    
    try {
      const messageRef = doc(db, 'chatMessages', messageId);
      await setDoc(messageRef, { read: true }, { merge: true });
      return true;
    } catch (err) {
      console.error('Erro ao marcar mensagem como lida:', err);
      return false;
    }
  };

  // Atualizar contador de mensagens não lidas
  const updateUnreadCount = async (chatId: string) => {
    if (!checkFirebase() || !user) return false;
    
    try {
      const threadRef = doc(db, 'chatThreads', chatId);
      const threadSnap = await getDoc(threadRef);
      
      if (threadSnap.exists()) {
        // Contar mensagens não lidas para este usuário
        const messagesQuery = query(
          collection(db, 'chatMessages'),
          where('chatId', '==', chatId),
          where('recipientId', '==', user.uid),
          where('read', '==', false)
        );
        
        const querySnapshot = await getDocs(messagesQuery);
        const unreadCount = querySnapshot.size;
        
        // Atualizar thread
        await setDoc(threadRef, { unreadCount }, { merge: true });
      }
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar contador de não lidas:', err);
      return false;
    }
  };

  return {
    loading,
    error,
    messages,
    threads,
    sendMessage,
    getChatThreads,
    subscribeToChatThreads,
    getChatMessages,
    subscribeToChatMessages,
    getChatId,
    isConfigured
  };
}; 