# Implementação da Biblioteca de SVGs para o Editor de Camisetas

Este documento detalha como implementar a organização e expansão da biblioteca de SVGs para o editor de camisetas.

## Análise dos SVGs Existentes

Atualmente, o editor possui 4 SVGs localizados em `public/images/editor`:
- `img-1.svg`
- `img-2.svg`
- `img-3.svg`
- `img-4.svg`

## Proposta de Implementação

### 1. Estrutura de Organização

Vamos criar uma estrutura de diretórios organizada para os SVGs:

```
public/
└── images/
    └── editor/
        ├── icons/              # Ícones básicos
        │   ├── arrows/         # Setas direcionais
        │   ├── symbols/        # Símbolos universais
        │   ├── ui/             # Elementos de interface
        │   └── social/         # Ícones de redes sociais
        ├── decorative/         # Elementos decorativos
        │   ├── borders/        # Bordas e molduras
        │   ├── splashes/       # Elementos splash e brush
        │   └── patterns/       # Padrões repetitivos
        ├── illustrations/      # Ilustrações temáticas
        │   ├── sports/         # Esportes
        │   ├── music/          # Música
        │   ├── nature/         # Natureza
        │   ├── tech/           # Tecnologia
        │   └── abstract/       # Abstratos
        ├── shapes/             # Formas básicas
        │   ├── geometric/      # Formas geométricas
        │   ├── badges/         # Emblemas e etiquetas
        │   └── banners/        # Faixas e banners
        └── text-effects/       # Designs para texto
            ├── retro/          # Estilos retrô
            ├── modern/         # Estilos modernos
            └── graffiti/       # Estilo urbano
```

### 2. Metadados para SVGs

Para cada SVG, criaremos um arquivo de metadados em JSON:

```json
{
  "id": "arrow-right-1",
  "name": "Seta para Direita",
  "category": "icons/arrows",
  "tags": ["seta", "direção", "direita", "indicador"],
  "colors": ["#000000"],
  "previewRatio": "1:1",
  "description": "Seta simples apontando para a direita",
  "dateAdded": "2023-06-15",
  "recommended": ["arrow-left-1", "arrow-up-1", "arrow-down-1"]
}
```

### 3. Implementação da Interface de Seleção de SVGs

Precisamos criar um componente para selecionar SVGs organizados por categoria:

```tsx
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

// Tipo para o metadado do SVG
type SVGMetadata = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  colors: string[];
  previewRatio: string;
  description: string;
  dateAdded: string;
  recommended: string[];
};

// Tipo para a estrutura de categoria
type Category = {
  id: string;
  name: string;
  subcategories: SubCategory[];
};

type SubCategory = {
  id: string;
  name: string;
  svgs: SVGMetadata[];
};

const SVGLibrary = ({ onSelect }: { onSelect: (svg: string) => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('icons');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSVGs, setFilteredSVGs] = useState<SVGMetadata[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<SVGMetadata[]>([]);

  // Carregar categorias e SVGs
  useEffect(() => {
    // Em produção, isso seria uma chamada de API
    // Por enquanto, simulamos com dados fictícios
    const loadCategories = async () => {
      try {
        // Simular carregamento de dados
        const response = await fetch('/api/svg-categories');
        const data = await response.json();
        setCategories(data.categories);
        
        // Inicializar com a primeira categoria
        if (data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
          
          // Configurar todos os SVGs da categoria para a visualização "Todos"
          const allSVGs = data.categories[0].subcategories.flatMap(sub => sub.svgs);
          setFilteredSVGs(allSVGs);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias de SVG:", error);
      }
    };
    
    loadCategories();
    
    // Também carregar recentemente usados
    const loadRecentlyUsed = () => {
      const recent = localStorage.getItem('recentSVGs');
      if (recent) {
        setRecentlyUsed(JSON.parse(recent));
      }
    };
    
    loadRecentlyUsed();
  }, []);
  
  // Filtrar SVGs quando a categoria, subcategoria ou busca mudar
  useEffect(() => {
    if (categories.length === 0) return;
    
    const category = categories.find(c => c.id === activeCategory);
    if (!category) return;
    
    let svgs: SVGMetadata[] = [];
    
    if (activeSubcategory === 'all') {
      // Todos os SVGs da categoria
      svgs = category.subcategories.flatMap(sub => sub.svgs);
    } else {
      // SVGs da subcategoria específica
      const subcategory = category.subcategories.find(s => s.id === activeSubcategory);
      if (subcategory) {
        svgs = subcategory.svgs;
      }
    }
    
    // Aplicar filtro de busca, se houver
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      svgs = svgs.filter(svg => 
        svg.name.toLowerCase().includes(query) || 
        svg.description.toLowerCase().includes(query) || 
        svg.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredSVGs(svgs);
  }, [activeCategory, activeSubcategory, searchQuery, categories]);
  
  // Salvar SVG em recentemente usados
  const handleSelectSVG = (svg: SVGMetadata) => {
    // Atualizar recentemente usados
    const updatedRecent = [
      svg,
      ...recentlyUsed.filter(s => s.id !== svg.id).slice(0, 11)
    ];
    setRecentlyUsed(updatedRecent);
    localStorage.setItem('recentSVGs', JSON.stringify(updatedRecent));
    
    // Chamar o callback de seleção
    onSelect(`/images/editor/${svg.category}/${svg.id}.svg`);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Barra de pesquisa */}
      <div className="mb-4 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar SVGs..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tabs de categorias */}
      <Tabs
        defaultValue="icons"
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <TabsList className="w-full flex overflow-x-auto">
          {categories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex-1 min-w-fit"
            >
              {category.name}
            </TabsTrigger>
          ))}
          <TabsTrigger value="recent" className="flex-1 min-w-fit">
            Recentes
          </TabsTrigger>
        </TabsList>
        
        {/* Conteúdo para cada categoria */}
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-4 h-full">
            {/* Subcategorias */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              <button
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeSubcategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => setActiveSubcategory('all')}
              >
                Todos
              </button>
              {category.subcategories.map(sub => (
                <button
                  key={sub.id}
                  className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${
                    activeSubcategory === sub.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                  onClick={() => setActiveSubcategory(sub.id)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
            
            {/* Grade de SVGs */}
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {filteredSVGs.map(svg => (
                  <div
                    key={svg.id}
                    className="aspect-square border rounded-md p-2 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelectSVG(svg)}
                    title={svg.name}
                  >
                    <img
                      src={`/images/editor/${svg.category}/${svg.id}.svg`}
                      alt={svg.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
                {filteredSVGs.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {searchQuery
                      ? "Nenhum SVG encontrado para esta busca"
                      : "Nenhum SVG nesta categoria"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
        
        {/* Tab para recentemente usados */}
        <TabsContent value="recent" className="mt-4 h-full">
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {recentlyUsed.map(svg => (
                <div
                  key={svg.id}
                  className="aspect-square border rounded-md p-2 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectSVG(svg)}
                  title={svg.name}
                >
                  <img
                    src={`/images/editor/${svg.category}/${svg.id}.svg`}
                    alt={svg.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
              {recentlyUsed.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Nenhum SVG usado recentemente
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SVGLibrary; 