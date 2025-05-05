// Cores disponíveis para as camisetas
export const AVAILABLE_COLORS = [
  { name: "Branco", value: "#ffffff", textColor: "#000000" },
  { name: "Preto", value: "#000000", textColor: "#ffffff" },
  { name: "Cinza", value: "#888888", textColor: "#ffffff" },
  { name: "Azul", value: "#3b82f6", textColor: "#ffffff" },
  { name: "Vermelho", value: "#ef4444", textColor: "#ffffff" },
  { name: "Verde", value: "#22c55e", textColor: "#ffffff" },
  { name: "Amarelo", value: "#eab308", textColor: "#000000" },
  { name: "Roxo", value: "#8b5cf6", textColor: "#ffffff" },
];

// Array de fontes disponíveis
export const AVAILABLE_FONTS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
];

// Array de mockups disponíveis
export const AVAILABLE_MOCKUPS = [
  {
    id: "men-basic",
    name: "Camiseta Masculina Básica",
    category: "masculino",
    path: "/images/mockups/men-s-t-shirt-different-views-mockup/men_s_t_shirt_in_different_views_mockup.jpg",
    epsPath: "/images/mockups/men-s-t-shirt-different-views-mockup/men_s_t_shirt_in_different_views_mockup.eps",
    viewOptions: ["frente", "costas", "lado"],
    designArea: {
      frente: { x: 150, y: 180, width: 220, height: 280 },
      costas: { x: 150, y: 180, width: 220, height: 280 },
      lado: { x: 150, y: 180, width: 100, height: 280 }
    }
  },
  {
    id: "men-blue",
    name: "Camiseta Masculina Azul",
    category: "masculino",
    path: "/images/mockups/men-s-blue-t-shirt-different-views-with-realistic-style (1)/men_s_blue_t_shirt_in_different_views_with_realistic_style.jpg",
    epsPath: "/images/mockups/men-s-blue-t-shirt-different-views-with-realistic-style (1)/men_s_blue_t_shirt_in_different_views_with_realistic_style.eps",
    viewOptions: ["frente", "costas", "lado"],
    designArea: {
      frente: { x: 150, y: 180, width: 220, height: 280 },
      costas: { x: 150, y: 180, width: 220, height: 280 },
      lado: { x: 150, y: 180, width: 100, height: 280 }
    }
  },
  {
    id: "men-yellow",
    name: "Camiseta Masculina Amarela",
    category: "masculino",
    path: "/images/mockups/men-s-yellow-t-shirt-different-views-with-realistic-mockup/men_s_yellow_t_shirt_in_different_views_with_realistic_style.jpg",
    epsPath: "/images/mockups/men-s-yellow-t-shirt-different-views-with-realistic-mockup/men_s_yellow_t_shirt_in_different_views_with_realistic_style.eps",
    viewOptions: ["frente", "costas", "lado"],
    designArea: {
      frente: { x: 150, y: 180, width: 220, height: 280 },
      costas: { x: 150, y: 180, width: 220, height: 280 },
      lado: { x: 150, y: 180, width: 100, height: 280 }
    }
  },
  {
    id: "women-white",
    name: "Camiseta Feminina Branca",
    category: "feminino",
    path: "/images/mockups/female-white-t-shirt-different-view-collection/female_white_t_shirt_in_different_view_collection.jpg",
    epsPath: "/images/mockups/female-white-t-shirt-different-view-collection/female_white_t_shirt_in_different_view_collection.eps",
    viewOptions: ["frente", "costas", "lado"],
    designArea: {
      frente: { x: 150, y: 180, width: 200, height: 250 },
      costas: { x: 150, y: 180, width: 200, height: 250 },
      lado: { x: 150, y: 180, width: 100, height: 250 }
    }
  },
  {
    id: "women-red",
    name: "Camiseta Feminina Vermelha",
    category: "feminino",
    path: "/images/mockups/women-s-red-t-shirt-different-views-with-realistic-style/women_s_red_t_shirt_in_different_views_with_realistic_style.jpg",
    epsPath: "/images/mockups/women-s-red-t-shirt-different-views-with-realistic-style/women_s_red_t_shirt_in_different_views_with_realistic_style.eps",
    viewOptions: ["frente", "costas", "lado"],
    designArea: {
      frente: { x: 150, y: 180, width: 200, height: 250 },
      costas: { x: 150, y: 180, width: 200, height: 250 },
      lado: { x: 150, y: 180, width: 100, height: 250 }
    }
  },
  {
    id: "tshirt-grey",
    name: "Camiseta Cinza Básica",
    category: "unissex",
    path: "/images/mockups/short-sleeves-grey-t-shirt-mockup/short_sleeves_grey_t_shirt_mockup.jpg",
    epsPath: "/images/mockups/short-sleeves-grey-t-shirt-mockup/short_sleeves_grey_t_shirt_mockup.eps",
    viewOptions: ["frente"],
    designArea: {
      frente: { x: 150, y: 180, width: 220, height: 280 }
    }
  },
  {
    id: "tshirt-blackwhite",
    name: "Camiseta Preta e Branca",
    category: "unissex",
    path: "/images/mockups/t-shirt-mockup-black-white-male-t-shirt-with-short-sleeves-wooden-hangers-template-front-view/3021.jpg",
    epsPath: "/images/mockups/t-shirt-mockup-black-white-male-t-shirt-with-short-sleeves-wooden-hangers-template-front-view/3021.eps",
    viewOptions: ["frente"],
    designArea: {
      frente: { x: 150, y: 180, width: 220, height: 280 }
    }
  },
];

// Paleta de cores para elementos
export const COLOR_PALETTE = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
];

// SVGs pré-definidos
export const PREDEFINED_SVGS = [
  { id: "svg-1", name: "Imagem 1", path: "/images/editor/img-1.svg", category: "básico" },
  { id: "svg-2", name: "Imagem 2", path: "/images/editor/img-2.svg", category: "básico" },
  { id: "svg-3", name: "Imagem 3", path: "/images/editor/img-3.svg", category: "básico" },
  { id: "svg-4", name: "Imagem 4", path: "/images/editor/img-4.svg", category: "básico" },
];

// Ferramentas da barra de ferramentas
export const EDITOR_TOOLS = [
  { id: "move", name: "Mover", icon: "Move" },
  { id: "select", name: "Selecionar", icon: "MousePointer" },
  { id: "text", name: "Texto", icon: "Type" },
  { id: "image", name: "Imagem", icon: "Image" },
  { id: "shapes", name: "Formas", icon: "Square" },
];

// Níveis de zoom predefinidos
export const ZOOM_LEVELS = [25, 50, 75, 100, 125, 150, 200, 300, 400];

// Tooltips para elementos da interface
export const TOOLTIPS = {
  zoomIn: "Aumentar zoom",
  zoomOut: "Diminuir zoom",
  resetZoom: "Redefinir zoom",
  undo: "Desfazer (Ctrl+Z)",
  redo: "Refazer (Ctrl+Y)",
  delete: "Excluir elemento selecionado (Del)",
  export: "Exportar design",
  save: "Salvar design",
  addToCart: "Adicionar ao carrinho",
  addText: "Adicionar texto",
  uploadImage: "Carregar imagem",
  downloadJSON: "Download como JSON",
  importJSON: "Importar de JSON",
  rotate: "Girar elemento",
  align: "Alinhar texto",
  bold: "Negrito",
  italic: "Itálico",
  underline: "Sublinhado",
  fontSize: "Tamanho da fonte",
  fontFamily: "Família da fonte",
  fontColor: "Cor do texto",
  moveToFront: "Trazer para frente",
  moveToBack: "Enviar para trás"
};

// Constantes para sensibilidade
export const SENSITIVITY = {
  zoom: 0.08,
  pan: 1.5,
  doubleTap: 300,
};
