// @ts-nocheck
"use client";

import { useState } from 'react';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, 
  query, where, orderBy, Timestamp, DocumentData, Firestore
} from 'firebase/firestore';
import { db, isConfigured as firebaseConfigured } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface OrderItem {
  designId: string;
  designTitle: string;
  designImage: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Order {
  id?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  printerId: string;
  printerName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'production' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  trackingNumber?: string;
  comments?: string;
  createdAt: number;
  updatedAt: number;
}

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isConfigured } = useAuth();

  // Verificar se o Firebase está configurado
  const checkFirebase = () => {
    if (!isConfigured || !firebaseConfigured || !db) {
      setError('Firebase não está configurado');
      return false;
    }
    return true;
  };
  
  // Função auxiliar para garantir tipagem segura do Firestore
  const getDb = () => {
    if (!firebaseConfigured) {
      throw new Error('Firestore não está configurado');
    }
    return db;
  };

  // Criar um novo pedido
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!checkFirebase() || !user || !db) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const timestamp = Date.now();
      
      const newOrder = {
        ...orderData,
        userId: user.uid,
        userEmail: user.email || '',
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      // Agora temos certeza que db não é undefined
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      return { id: docRef.id, ...newOrder } as Order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obter pedidos do usuário atual
  const getUserOrders = async () => {
    if (!checkFirebase() || !user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const ordersQuery = query(
        collection(getDb(), 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      
      return orders;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar seus pedidos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obter pedidos para a gráfica atual
  const getPrinterOrders = async () => {
    if (!checkFirebase() || !user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const ordersQuery = query(
        collection(getDb(), 'orders'),
        where('printerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      
      return orders;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar pedidos da gráfica');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obter pedido por ID
  const getOrderById = async (orderId: string) => {
    if (!checkFirebase()) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const orderRef = doc(getDb(), 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        setError('Pedido não encontrado');
        return null;
      }
      
      // Verificar se o usuário tem permissão para ver este pedido
      const orderData = orderSnap.data() as Order;
      if (user && (user.uid !== orderData.userId && user.uid !== orderData.printerId)) {
        setError('Você não tem permissão para ver este pedido');
        return null;
      }
      
      return { id: orderSnap.id, ...orderData };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar pedido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do pedido (apenas a gráfica pode fazer isso)
  const updateOrderStatus = async (orderId: string, status: Order['status'], comments?: string) => {
    if (!checkFirebase() || !user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const orderRef = doc(getDb(), 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        setError('Pedido não encontrado');
        return false;
      }
      
      const orderData = orderSnap.data() as Order;
      
      // Apenas a gráfica pode atualizar o status
      if (user.uid !== orderData.printerId) {
        setError('Você não tem permissão para atualizar este pedido');
        return false;
      }
      
      await updateDoc(orderRef, {
        status,
        comments: comments || orderData.comments,
        updatedAt: Date.now()
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pedido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar informações de envio
  const updateShippingInfo = async (orderId: string, trackingNumber: string) => {
    if (!checkFirebase() || !user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const orderRef = doc(getDb(), 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        setError('Pedido não encontrado');
        return false;
      }
      
      const orderData = orderSnap.data() as Order;
      
      // Apenas a gráfica pode atualizar o envio
      if (user.uid !== orderData.printerId) {
        setError('Você não tem permissão para atualizar este pedido');
        return false;
      }
      
      await updateDoc(orderRef, {
        trackingNumber,
        status: 'shipped',
        updatedAt: Date.now()
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar informações de envio');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar pedido
  const cancelOrder = async (orderId: string, reason: string) => {
    if (!checkFirebase() || !user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const orderRef = doc(getDb(), 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        setError('Pedido não encontrado');
        return false;
      }
      
      const orderData = orderSnap.data() as Order;
      
      // Apenas o usuário que fez o pedido ou a gráfica podem cancelar
      if (user.uid !== orderData.userId && user.uid !== orderData.printerId) {
        setError('Você não tem permissão para cancelar este pedido');
        return false;
      }
      
      // Não é possível cancelar pedidos que já estão em produção, enviados ou entregues
      if (['production', 'shipped', 'delivered'].includes(orderData.status)) {
        setError('Não é possível cancelar um pedido que já está em produção, enviado ou entregue');
        return false;
      }
      
      await updateDoc(orderRef, {
        status: 'cancelled',
        comments: reason,
        updatedAt: Date.now()
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar pedido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createOrder,
    getUserOrders,
    getPrinterOrders,
    getOrderById,
    updateOrderStatus,
    updateShippingInfo,
    cancelOrder,
    isConfigured
  };
}; 