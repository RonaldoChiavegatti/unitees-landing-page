// Tipos de usuário
export enum UserRole {
  STUDENT = "student",
  PRINTER = "printer",
  ADMIN = "admin"
}

// Interface de usuário base
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
}

// Interface específica para estudantes universitários
export interface StudentUser extends User {
  role: UserRole.STUDENT;
  university?: string;
  course?: string;
  graduationYear?: string;
  phone?: string;
  favoriteProducts: string[]; // IDs dos produtos favoritos
  orders: string[]; // IDs dos pedidos
}

// Interface específica para gráficas
export interface PrinterUser extends User {
  role: UserRole.PRINTER;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  description: string;
  services: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  minimumOrderValue?: number;
  verified: boolean;
  coverImage?: string;
  products: string[]; // IDs dos produtos oferecidos
}

// Sessão de autenticação
export interface AuthSession {
  user: User | StudentUser | PrinterUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Dados de login
export interface LoginData {
  email: string;
  password: string;
}

// Dados de registro
export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  // Campos adicionais serão preenchidos após o registro inicial
} 