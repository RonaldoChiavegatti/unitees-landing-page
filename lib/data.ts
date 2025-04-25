export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  colors: Color[];
  sizes: Size[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  inStock: boolean;
  createdAt: string;
}

export interface Color {
  name: string;
  value: string;
}

export interface Size {
  name: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  title: string;
  comment: string;
  rating: number;
  user: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
}

// Categorias fictícias
export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Básicas",
    description: "Camisetas básicas para o dia a dia",
    slug: "basicas",
    image: "/images/categories/basic.jpg"
  },
  {
    id: "cat-2",
    name: "Estampadas",
    description: "Camisetas com estampas exclusivas",
    slug: "estampadas",
    image: "/images/categories/printed.jpg"
  },
  {
    id: "cat-3",
    name: "Personalizadas",
    description: "Crie sua própria camiseta personalizada",
    slug: "personalizadas",
    image: "/images/categories/custom.jpg"
  },
  {
    id: "cat-4",
    name: "Empresariais",
    description: "Camisetas para sua empresa ou equipe",
    slug: "empresariais",
    image: "/images/categories/corporate.jpg"
  }
];

// Cores disponíveis
export const availableColors: Color[] = [
  { name: "Branco", value: "#FFFFFF" },
  { name: "Preto", value: "#000000" },
  { name: "Cinza", value: "#808080" },
  { name: "Azul", value: "#0000FF" },
  { name: "Vermelho", value: "#FF0000" },
  { name: "Verde", value: "#008000" },
  { name: "Amarelo", value: "#FFFF00" },
  { name: "Roxo", value: "#800080" }
];

// Tamanhos disponíveis
export const availableSizes: Size[] = [
  { name: "PP", value: "PP" },
  { name: "P", value: "P" },
  { name: "M", value: "M" },
  { name: "G", value: "G" },
  { name: "GG", value: "GG" },
  { name: "XG", value: "XG" }
];

// Produtos fictícios
export const products: Product[] = [
  {
    id: "prod-1",
    name: "Camiseta Básica",
    description: "Camiseta básica de algodão de alta qualidade. Perfeita para o dia a dia e extremamente confortável. Fabricada com algodão 100% orgânico e tingida com corantes naturais.",
    price: 59.90,
    images: [
      "/images/products/basic-white.jpg",
      "/images/products/basic-white-2.jpg",
      "/images/products/basic-white-3.jpg"
    ],
    category: "cat-1",
    tags: ["básica", "algodão", "branca"],
    colors: [
      { name: "Branco", value: "#FFFFFF" },
      { name: "Preto", value: "#000000" },
      { name: "Cinza", value: "#808080" }
    ],
    sizes: [
      { name: "P", value: "P" },
      { name: "M", value: "M" },
      { name: "G", value: "G" },
      { name: "GG", value: "GG" }
    ],
    rating: 4.5,
    reviewCount: 120,
    featured: true,
    bestSeller: true,
    inStock: true,
    createdAt: "2023-01-15"
  },
  {
    id: "prod-2",
    name: "Camiseta Estampada - Arte Urbana",
    description: "Camiseta com estampa exclusiva de artista urbano. Estampa vibrante com impressão digital de alta qualidade que não desbota com o tempo. Material confortável e durável.",
    price: 79.90,
    images: [
      "/images/products/print-urban.jpg",
      "/images/products/print-urban-2.jpg"
    ],
    category: "cat-2",
    tags: ["estampada", "arte", "urbana", "colorida"],
    colors: [
      { name: "Preto", value: "#000000" },
      { name: "Branco", value: "#FFFFFF" }
    ],
    sizes: [
      { name: "P", value: "P" },
      { name: "M", value: "M" },
      { name: "G", value: "G" }
    ],
    rating: 4.2,
    reviewCount: 85,
    featured: true,
    bestSeller: false,
    inStock: true,
    createdAt: "2023-02-10"
  },
  {
    id: "prod-3",
    name: "Camiseta Empresarial - Modelo Polo",
    description: "Camiseta polo para empresas e equipes. Tecido piqué de alta qualidade, confortável e durável. Ideal para uniformes corporativos com possibilidade de bordado personalizado.",
    price: 89.90,
    images: [
      "/images/products/corporate-polo.jpg",
      "/images/products/corporate-polo-2.jpg"
    ],
    category: "cat-4",
    tags: ["polo", "empresarial", "uniforme"],
    colors: [
      { name: "Azul", value: "#0000FF" },
      { name: "Preto", value: "#000000" },
      { name: "Branco", value: "#FFFFFF" }
    ],
    sizes: [
      { name: "P", value: "P" },
      { name: "M", value: "M" },
      { name: "G", value: "G" },
      { name: "GG", value: "GG" },
      { name: "XG", value: "XG" }
    ],
    rating: 4.8,
    reviewCount: 42,
    featured: false,
    bestSeller: false,
    inStock: true,
    createdAt: "2023-03-05"
  },
  {
    id: "prod-4",
    name: "Camiseta Personalizada",
    description: "Camiseta totalmente personalizável. Escolha o tecido, cor, tamanho e adicione sua arte ou texto personalizado. Ideal para eventos, presentes ou para expressar sua criatividade.",
    price: 69.90,
    images: [
      "/images/products/custom-template.jpg",
      "/images/products/custom-template-2.jpg"
    ],
    category: "cat-3",
    tags: ["personalizada", "customizada", "criativa"],
    colors: [
      { name: "Branco", value: "#FFFFFF" },
      { name: "Preto", value: "#000000" },
      { name: "Azul", value: "#0000FF" },
      { name: "Vermelho", value: "#FF0000" },
      { name: "Verde", value: "#008000" }
    ],
    sizes: [
      { name: "PP", value: "PP" },
      { name: "P", value: "P" },
      { name: "M", value: "M" },
      { name: "G", value: "G" },
      { name: "GG", value: "GG" }
    ],
    rating: 4.7,
    reviewCount: 156,
    featured: true,
    bestSeller: true,
    inStock: true,
    createdAt: "2023-01-20"
  },
  {
    id: "prod-5",
    name: "Camiseta Estampada - Natureza",
    description: "Camiseta com estampa temática de natureza. Estampa detalhada com impressão digital que preserva as cores vivas. Material 100% algodão, macio e durável.",
    price: 75.90,
    images: [
      "/images/products/print-nature.jpg",
      "/images/products/print-nature-2.jpg"
    ],
    category: "cat-2",
    tags: ["estampada", "natureza", "ecológica"],
    colors: [
      { name: "Verde", value: "#008000" },
      { name: "Azul", value: "#0000FF" },
      { name: "Branco", value: "#FFFFFF" }
    ],
    sizes: [
      { name: "P", value: "P" },
      { name: "M", value: "M" },
      { name: "G", value: "G" },
      { name: "GG", value: "GG" }
    ],
    rating: 4.4,
    reviewCount: 78,
    featured: false,
    bestSeller: true,
    inStock: true,
    createdAt: "2023-02-25"
  },
  {
    id: "prod-6",
    name: "Camiseta Básica Premium",
    description: "Camiseta básica em tecido premium com acabamento superior. Corte moderno e elegante, perfeita para ocasiões casuais ou mais formais. Fabricada com algodão pima de alta qualidade.",
    price: 99.90,
    images: [
      "/images/products/premium-basic.jpg",
      "/images/products/premium-basic-2.jpg"
    ],
    category: "cat-1",
    tags: ["básica", "premium", "elegante"],
    colors: [
      { name: "Preto", value: "#000000" },
      { name: "Branco", value: "#FFFFFF" },
      { name: "Cinza", value: "#808080" },
      { name: "Azul", value: "#0000FF" }
    ],
    sizes: [
      { name: "P", value: "P" },
      { name: "M", value: "M" },
      { name: "G", value: "G" }
    ],
    rating: 4.9,
    reviewCount: 64,
    featured: true,
    bestSeller: false,
    inStock: true,
    createdAt: "2023-03-15"
  }
];

// Reviews fictícias
export const reviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    user: "João Silva",
    rating: 5,
    title: "Excelente qualidade",
    comment: "Camiseta muito confortável e com ótimo acabamento. Recomendo!",
    date: "2023-05-12"
  },
  {
    id: "rev-2",
    productId: "prod-1",
    user: "Maria Oliveira",
    rating: 4,
    title: "Boa compra",
    comment: "Gostei bastante do material, mas achei o tamanho um pouco menor do que esperava.",
    date: "2023-04-28"
  },
  {
    id: "rev-3",
    productId: "prod-2",
    user: "Pedro Santos",
    rating: 5,
    title: "Estampa incrível",
    comment: "A estampa é ainda mais bonita pessoalmente. Ótima qualidade de impressão!",
    date: "2023-05-05"
  },
  {
    id: "rev-4",
    productId: "prod-4",
    user: "Ana Costa",
    rating: 5,
    title: "Personalização perfeita",
    comment: "Fiz uma camiseta personalizada para o aniversário do meu namorado e ficou incrível! Ele amou!",
    date: "2023-05-10"
  },
  {
    id: "rev-5",
    productId: "prod-4",
    user: "Roberto Almeida",
    rating: 4,
    title: "Ótimo presente",
    comment: "Encomendei como presente e a pessoa adorou. O processo de personalização foi simples e o resultado ficou excelente.",
    date: "2023-04-22"
  }
];

// Função para buscar produtos por categoria
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(product => product.category === categoryId);
}

// Função para buscar produto por ID
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

// Função para buscar reviews de um produto
export function getProductReviews(productId: string): Review[] {
  return reviews.filter(review => review.productId === productId);
}

// Função para buscar produtos em destaque
export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

// Função para buscar produtos mais vendidos
export function getBestSellerProducts(): Product[] {
  return products.filter(product => product.bestSeller);
}

// Função para buscar produtos recentes (últimos 30 dias)
export function getRecentProducts(): Product[] {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return products.filter(product => {
    const productDate = new Date(product.createdAt);
    return productDate >= thirtyDaysAgo;
  });
}

// Função para buscar produtos por tags
export function getProductsByTags(tags: string[]): Product[] {
  return products.filter(product => 
    product.tags.some(tag => tags.includes(tag))
  );
}

// Função para buscar categoria por slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug);
} 