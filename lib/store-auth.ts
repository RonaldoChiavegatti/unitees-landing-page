import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole, StudentUser, PrinterUser, AuthSession, LoginData, SignupData } from './types'

// Dados fictícios de usuários para simulação
const mockUsers = [
  {
    id: 'user-1',
    email: 'estudante@exemplo.com',
    name: 'Ana Silva',
    role: UserRole.STUDENT,
    createdAt: '2023-01-15',
    avatarUrl: '/images/avatars/student.jpg',
    university: 'Universidade Federal de São Paulo',
    course: 'Engenharia de Computação',
    graduationYear: '2025',
    favoriteProducts: ['prod-1', 'prod-4'],
    orders: ['order-1', 'order-2']
  } as StudentUser,
  {
    id: 'user-2',
    email: 'grafica@exemplo.com',
    name: 'Carlos Oliveira',
    role: UserRole.PRINTER,
    createdAt: '2022-11-20',
    avatarUrl: '/images/avatars/printer.jpg',
    companyName: 'Gráfica Universitária Express',
    address: 'Rua das Impressões, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    phone: '(11) 98765-4321',
    description: 'Especializada em camisetas e produtos personalizados para universitários há mais de 10 anos.',
    services: ['Camisetas', 'Moletons', 'Canecas', 'Adesivos'],
    rating: 4.8,
    reviewCount: 156,
    deliveryTime: '5-7 dias úteis',
    minimumOrderValue: 150,
    verified: true,
    coverImage: '/images/printers/cover-1.jpg',
    products: ['prod-1', 'prod-2', 'prod-4']
  } as PrinterUser
]

// Tipos da loja de autenticação
interface AuthStore extends AuthSession {
  login: (data: LoginData) => Promise<User | null>;
  signup: (data: SignupData) => Promise<User | null>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<User | null>;
}

// Criação da loja Zustand para autenticação
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Login simulado
      login: async (data: LoginData) => {
        set({ isLoading: true })
        
        // Simulação de atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verificação de credenciais simulada
        const user = mockUsers.find(user => user.email === data.email)
        
        if (user) {
          set({ 
            user,
            isAuthenticated: true,
            isLoading: false
          })
          return user
        }
        
        set({ isLoading: false })
        return null
      },
      
      // Registro simulado
      signup: async (data: SignupData) => {
        set({ isLoading: true })
        
        // Simulação de atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Criação de usuário simulada
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: new Date().toISOString(),
          avatarUrl: data.role === UserRole.STUDENT 
            ? '/images/avatars/student-default.jpg' 
            : '/images/avatars/printer-default.jpg'
        }
        
        if (data.role === UserRole.STUDENT) {
          const studentUser = newUser as StudentUser
          studentUser.favoriteProducts = []
          studentUser.orders = []
          
          set({
            user: studentUser,
            isAuthenticated: true,
            isLoading: false
          })
          
          return studentUser
        } else if (data.role === UserRole.PRINTER) {
          const printerUser = newUser as PrinterUser
          printerUser.companyName = ''
          printerUser.address = ''
          printerUser.city = ''
          printerUser.state = ''
          printerUser.zipCode = ''
          printerUser.phone = ''
          printerUser.description = ''
          printerUser.services = []
          printerUser.rating = 0
          printerUser.reviewCount = 0
          printerUser.deliveryTime = ''
          printerUser.verified = false
          printerUser.products = []
          
          set({
            user: printerUser,
            isAuthenticated: true,
            isLoading: false
          })
          
          return printerUser
        }
        
        set({ isLoading: false })
        return null
      },
      
      // Logout
      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        })
      },
      
      // Atualização de perfil simulada
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true })
        
        // Simulação de atraso de rede
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const currentUser = get().user
        
        if (!currentUser) {
          set({ isLoading: false })
          return null
        }
        
        const updatedUser = {
          ...currentUser,
          ...userData
        }
        
        set({
          user: updatedUser,
          isLoading: false
        })
        
        return updatedUser
      }
    }),
    {
      name: 'unitees-auth-storage',
    },
  ),
) 