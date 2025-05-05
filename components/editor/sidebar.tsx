"use client";

import React, { useState, useEffect } from "react";
import { 
  Text as TextIcon, 
  Image as ImageIcon, 
  Layers, 
  LayoutGrid, 
  PanelLeft,
  PanelRight,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Upload,
  Info as InfoIcon,
  RotateCcw,
  Palette,
  Shirt,
  PanelLeftClose
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import useEditorStore from "@/lib/store/editor";
import { 
  TOOLTIPS,
  AVAILABLE_MOCKUPS,
  AVAILABLE_FONTS,
  COLOR_PALETTE,
  AVAILABLE_COLORS,
  PREDEFINED_SVGS
} from "@/lib/constants/editor";
import { Separator } from "@/components/ui/separator";
import { SVGRenderer } from "@/components/editor/svg-renderer";
import { SafeImage } from "./safe-image";

interface SidebarProps {
  onAddText: () => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEpsInfo: () => void;
  fileInputRef?: React.MutableRefObject<HTMLInputElement | null>;
}

export default function Sidebar({ onAddText, onUploadImage, onEpsInfo, fileInputRef }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'text' | 'images' | 'mockups' | 'colors'>('text');
  
  // Acessar o estado do editor
  const {
    leftPanelCollapsed,
    setLeftPanelCollapsed,
    text,
    setText,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    fontColor,
    setFontColor,
    align,
    setAlign,
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    isUnderline,
    setIsUnderline,
    selectedElement,
    canvasElements,
    selectedMockup,
    setSelectedMockup,
    currentView,
    setCurrentView,
    productColor,
    setProductColor,
    addImageToCanvas,
    updateSelectedElement
  } = useEditorStore();

  // Verificar se temos um elemento de texto selecionado
  const selectedTextElement = selectedElement 
    ? canvasElements.find(el => el.id === selectedElement && el.isTextSVG) 
    : null;

  // Handle text property change
  const handleTextPropertyChange = (property: string, value: string | number | boolean) => {
    if (!selectedElement) return;
    
    const element = canvasElements.find(el => el.id === selectedElement);
    if (!element || element.type !== 'text') return;
    
    switch (property) {
      case 'font':
        setFontFamily(value as string);
        updateSelectedElement({ fontFamily: value as string });
        break;
      case 'size':
        setFontSize(value as number);
        updateSelectedElement({ fontSize: value as number });
        break;
      case 'color':
        setFontColor(value as string);
        updateSelectedElement({ fontColor: value as string });
        break;
      case 'align':
        setAlign(value as "left" | "center" | "right");
        updateSelectedElement({ align: value as "left" | "center" | "right" });
        break;
      case 'bold':
        setIsBold(value as boolean);
        updateSelectedElement({ isBold: value as boolean });
        break;
      case 'italic':
        setIsItalic(value as boolean);
        updateSelectedElement({ isItalic: value as boolean });
        break;
      case 'underline':
        setIsUnderline(value as boolean);
        updateSelectedElement({ isUnderline: value as boolean });
        break;
    }
  };
  
  // Função para lidar com upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      // Criar uma imagem para obter dimensões
      const img = new Image();
      img.onload = () => {
        // Redimensionar se muito grande
        let width = img.width;
        let height = img.height;
        
        const MAX_SIZE = 400;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          const ratio = width / height;
          if (width > height) {
            width = MAX_SIZE;
            height = width / ratio;
          } else {
            height = MAX_SIZE;
            width = height * ratio;
          }
        }
        
        // Adicionar imagem ao canvas
        addImageToCanvas({
          content,
          width,
          height,
          isSVG: file.type === 'image/svg+xml'
        });
      };
      
      img.src = content;
    };
    
    reader.readAsDataURL(file);
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Renderizar painel recolhido
  if (leftPanelCollapsed) {
    return (
      <div className="h-full flex flex-col hidden sm:flex">
        <Button variant="ghost" className="w-10 h-10 p-0" onClick={() => setLeftPanelCollapsed(false)}>
          <PanelRight className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center py-4 gap-4">
          <Tooltip text="Ferramentas de Texto">
            <Button 
              variant={activeTab === "text" ? "secondary" : "ghost"} 
              size="icon" 
              className="w-8 h-8" 
              onClick={() => {
                setActiveTab("text"); 
                setLeftPanelCollapsed(false);
              }}
            >
              <TextIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip text="Imagens e Formas">
            <Button 
              variant={activeTab === "images" ? "secondary" : "ghost"} 
              size="icon" 
              className="w-8 h-8" 
              onClick={() => {
                setActiveTab("images"); 
                setLeftPanelCollapsed(false);
              }}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip text="Mockups">
            <Button 
              variant={activeTab === "mockups" ? "secondary" : "ghost"} 
              size="icon" 
              className="w-8 h-8" 
              onClick={() => {
                setActiveTab("mockups"); 
                setLeftPanelCollapsed(false);
              }}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip text="Cores">
            <Button 
              variant={activeTab === "colors" ? "secondary" : "ghost"} 
              size="icon" 
              className="w-8 h-8" 
              onClick={() => {
                setActiveTab("colors"); 
                setLeftPanelCollapsed(false);
              }}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }
  
  // Renderizar painel expandido
  const renderExpandedPanel = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center border-b p-2">
          <h3 className="text-sm font-semibold">Editor de Camiseta</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setLeftPanelCollapsed(true)}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'text' | 'images' | 'mockups' | 'colors')} 
          className="flex-1 flex flex-col"
        >
          <TabsList className="mx-2 mt-2 grid grid-cols-4">
            <TabsTrigger value="text" className="text-xs py-1 px-1">
              <TextIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Texto</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs py-1 px-1">
              <ImageIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Imagens</span>
            </TabsTrigger>
            <TabsTrigger value="mockups" className="text-xs py-1 px-1">
              <Layers className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Mockups</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="text-xs py-1 px-1">
              <LayoutGrid className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Cores</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto p-3">
            {/* Conteúdo de Texto */}
            <TabsContent value="text" className="m-0 h-full space-y-4">
              <div className="space-y-3">
                <Tooltip text={TOOLTIPS.addText}>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center text-sm h-9 border-dashed"
                    onClick={onAddText}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar texto
                  </Button>
                </Tooltip>
                
                <div>
                  <Label htmlFor="text-input" className="text-xs">Texto</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="text-input"
                      type="text"
                      value={text}
                      onChange={(e) => handleTextPropertyChange('text', e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Opções de estilo de texto */}
              <div className="space-y-3 pt-2 border-t">
                <h3 className="font-medium text-sm">Estilo de texto</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Estilo</Label>
                    <div className="flex space-x-1">
                      <Tooltip text={TOOLTIPS.bold}>
                        <Button
                          variant={isBold ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTextPropertyChange('bold', !isBold)}
                          className="flex-1 font-bold h-8"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip text={TOOLTIPS.italic}>
                        <Button
                          variant={isItalic ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTextPropertyChange('italic', !isItalic)}
                          className="flex-1 italic h-8"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip text={TOOLTIPS.underline}>
                        <Button
                          variant={isUnderline ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTextPropertyChange('underline', !isUnderline)}
                          className="flex-1 underline h-8"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Alinhamento</Label>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div>
                        <Tooltip text={TOOLTIPS.align}>
                          <Button
                            variant={align === "left" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTextPropertyChange('align', 'left')}
                            className="w-full"
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip text={TOOLTIPS.align}>
                          <Button
                            variant={align === "center" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTextPropertyChange('align', 'center')}
                            className="w-full"
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip text={TOOLTIPS.align}>
                          <Button
                            variant={align === "right" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTextPropertyChange('align', 'right')}
                            className="w-full"
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Tamanho da fonte</Label>
                    <span className="text-xs font-mono">{fontSize}px</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    min={8}
                    max={72}
                    step={1}
                    onValueChange={(value) => handleTextPropertyChange('size', value[0])}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="font-family" className="text-xs">Família da fonte</Label>
                  <select
                    id="font-family"
                    value={fontFamily}
                    onChange={(e) => handleTextPropertyChange('font', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    {AVAILABLE_FONTS.map((font) => (
                      <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Cor do texto</Label>
                  <div className="grid grid-cols-8 gap-1 mt-1">
                    {COLOR_PALETTE.map((color) => (
                      <Tooltip key={color} text={color}>
                        <div 
                          className={`w-full aspect-square rounded-md cursor-pointer ${fontColor === color ? 'ring-2 ring-blue-600' : 'border'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleTextPropertyChange('color', color)}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Imagens Tab Content */}
            <TabsContent value="images" className="m-0 space-y-4">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => fileInputRef?.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Carregar Imagem
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="text-xs text-muted-foreground">
                  Formatos aceitos: PNG, JPG, SVG
                </div>
                
                <Separator className="my-2" />
                
                <div className="text-sm font-medium">Imagens Predefinidas</div>
                <div className="grid grid-cols-3 gap-2">
                  {PREDEFINED_SVGS.map((svg) => (
                    <div 
                      key={svg.id}
                      className="border rounded-md p-2 hover:bg-accent cursor-pointer flex items-center justify-center h-20"
                      onClick={() => {
                        // Carregar a imagem SVG usando fetch
                        fetch(svg.path)
                          .then(response => response.text())
                          .then(svgContent => {
                            addImageToCanvas({
                              content: `data:image/svg+xml,${encodeURIComponent(svgContent)}`,
                              width: 100,
                              height: 100,
                              isSVG: true
                            });
                          })
                          .catch(error => {
                            console.error("Erro ao carregar SVG:", error);
                          });
                      }}
                    >
                      <SVGRenderer 
                        src={svg.path} 
                        width={50} 
                        height={50} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Mockups Tab Content */}
            <TabsContent value="mockups" className="m-0 space-y-4">
              <div className="space-y-3">
                <div className="text-sm font-medium">Visões disponíveis</div>
                
                <div className="grid grid-cols-2 gap-2">
                  {selectedMockup?.viewOptions.map((view) => (
                    <Button
                      key={view}
                      variant={currentView === view ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setCurrentView(view)}
                    >
                      <Shirt className="h-4 w-4 mr-2" />
                      {view}
                    </Button>
                  ))}
                </div>
                
                <Separator className="my-2" />
                
                <div className="text-sm font-medium">Modelos</div>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_MOCKUPS.map((mockup) => (
                    <div
                      key={mockup.id}
                      className={`border rounded-md cursor-pointer transition-all ${selectedMockup.id === mockup.id ? 'ring-2 ring-blue-600' : 'hover:border-blue-300'}`}
                      onClick={() => setSelectedMockup(mockup)}
                    >
                      <div className="aspect-square bg-slate-50 relative p-1">
                        <SafeImage 
                          src={mockup.path} 
                          alt={mockup.name}
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="p-1 text-xs text-center truncate">
                        {mockup.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Cores Tab Content */}
            <TabsContent value="colors" className="m-0 space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-2">Cor da Camiseta</div>
                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_COLORS.map((color) => (
                      <Tooltip key={color.value} text={color.name}>
                        <div
                          className={`w-full aspect-square rounded-md cursor-pointer ${productColor.value === color.value ? 'ring-2 ring-blue-600' : 'border'}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setProductColor(color)}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                {selectedElement && (
                  <>
                    <div className="text-sm font-medium mb-2">Cor do Elemento</div>
                    <div className="grid grid-cols-8 gap-1">
                      {COLOR_PALETTE.map((color) => (
                        <Tooltip key={color} text={color}>
                          <div
                            className="w-full aspect-square rounded-md cursor-pointer border hover:ring-1 hover:ring-blue-400"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              // Se o elemento selecionado é um texto SVG, atualizar a cor do texto
                              const element = canvasElements.find(el => el.id === selectedElement);
                              if (element && element.isTextSVG) {
                                handleTextPropertyChange('color', color);
                              }
                            }}
                          />
                        </Tooltip>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  };

  return renderExpandedPanel();
} 