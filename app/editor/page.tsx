"use client"

import React, { useState, useRef } from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ImageIcon, Move, ZoomIn } from "lucide-react"

import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Footer from "@/components/footer"
import Header from "@/components/header"

// Funções simuladas para o produto
const generateRandomOrderNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const getEstimatedDeliveryDate = () => {
  const today = new Date()
  const deliveryDate = new Date(today)
  deliveryDate.setDate(today.getDate() + 7) // 7 dias após hoje
  
  return deliveryDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Array de fontes disponíveis
const availableFonts = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
]

// Cores disponíveis para as camisetas
const availableColors = [
  { name: "Branco", value: "#ffffff", textColor: "#000000" },
  { name: "Preto", value: "#000000", textColor: "#ffffff" },
  { name: "Cinza", value: "#888888", textColor: "#ffffff" },
  { name: "Azul", value: "#3b82f6", textColor: "#ffffff" },
  { name: "Vermelho", value: "#ef4444", textColor: "#ffffff" },
  { name: "Verde", value: "#22c55e", textColor: "#ffffff" },
  { name: "Amarelo", value: "#eab308", textColor: "#000000" },
  { name: "Roxo", value: "#8b5cf6", textColor: "#ffffff" },
]

export default function EditorPage() {
  // Estado do elemento selecionado
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Estado para os controles de texto
  const [text, setText] = useState("Seu texto aqui")
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [fontColor, setFontColor] = useState("#000000")
  const [align, setAlign] = useState<"left" | "center" | "right">("center")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  
  // Estado para a cor do produto
  const [productColor, setProductColor] = useState(availableColors[0])
  
  // Estado para o nível de zoom
  const [zoom, setZoom] = useState(100)
  
  // Elementos no canvas
  const [canvasElements, setCanvasElements] = useState<Array<{
    id: string;
    type: "text" | "image";
    content: string;
    x: number;
    y: number;
    rotation?: number;
    fontSize?: number;
    fontFamily?: string;
    fontColor?: string;
    align?: "left" | "center" | "right";
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
  }>>([])
  
  const { toast } = useToast()
  
  // Adicionar texto ao canvas
  const addTextToCanvas = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: "text" as const,
      content: text,
      x: 150,
      y: 200,
      rotation: 0,
      fontSize,
      fontFamily,
      fontColor,
      align,
      isBold,
      isItalic,
      isUnderline,
    }
    
    setCanvasElements([...canvasElements, newElement])
    toast({
      title: "Texto adicionado",
      description: "O texto foi adicionado ao design",
    })
    
    // Seleciona automaticamente o elemento criado
    setSelectedElement(newElement.id)
  }
  
  // Upload de imagem (simulado)
  const handleImageUpload = () => {
    toast({
      title: "Funcionalidade simulada",
      description: "O upload de imagens seria processado aqui",
    })
  }
  
  // Manipuladores de arrastar e soltar no canvas
  const handleCanvasMouseDown = (e: React.MouseEvent, elementId: string) => {
    setSelectedElement(elementId)
    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY
    })
  }
  
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setCanvasElements(canvasElements.map(el => {
      if (el.id === selectedElement) {
        return {
          ...el,
          x: el.x + deltaX,
          y: el.y + deltaY
        }
      }
      return el
    }))
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    })
  }
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false)
  }
  
  // Remover elemento selecionado
  const deleteSelectedElement = () => {
    if (!selectedElement) return
    
    setCanvasElements(canvasElements.filter(el => el.id !== selectedElement))
    setSelectedElement(null)
    
    toast({
      title: "Elemento removido",
      description: "O elemento foi removido do design",
    })
  }
  
  // Atualizar propriedades do elemento selecionado
  const updateSelectedElement = (updates: Partial<typeof canvasElements[0]>) => {
    setCanvasElements(canvasElements.map(el => {
      if (el.id === selectedElement) {
        return {
          ...el,
          ...updates
        }
      }
      return el
    }))
  }
  
  // Salvar design (simulado)
  const saveDesign = () => {
    toast({
      title: "Design salvo!",
      description: "Seu design foi salvo com sucesso",
    })
  }
  
  // Adicionar ao carrinho (simulado)
  const addToCart = () => {
    toast({
      title: "Produto adicionado ao carrinho",
      description: "Redirecionando para o carrinho...",
    })
    
    // Simular redirecionamento após um delay
    setTimeout(() => {
      window.location.href = "/cart"
    }, 1500)
  }
  
  // Verificar se o usuário está autenticado (simulado)
  const isAuthenticated = true
  
  if (!isAuthenticated) {
    return redirect("/login")
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Toaster />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-1 items-center mb-6">
          <Link href="/products" className="text-slate-500 hover:text-slate-700">
            <ChevronLeft className="h-4 w-4 inline" />
            <span>Voltar aos produtos</span>
          </Link>
          <h1 className="text-3xl font-bold text-center ml-auto mr-auto">Editor de Design</h1>
        </div>
        
        {/* Interface principal do editor (layout horizontal) */}
        <div className="flex h-[80vh] border rounded-lg overflow-hidden">
          {/* Painel lateral esquerdo - Ferramentas */}
          <div className="w-[250px] border-r overflow-y-auto bg-gray-50 flex flex-col">
            <Tabs defaultValue="texto" className="h-full flex flex-col">
              <TabsList className="w-full justify-start px-2 py-2 border-b bg-transparent">
                <TabsTrigger value="texto" className="text-sm">
                  <span className="mr-1">T</span> Texto
                </TabsTrigger>
                <TabsTrigger value="imagem" className="text-sm">
                  <ImageIcon className="h-3 w-3 mr-1" /> Imagens
                </TabsTrigger>
                <TabsTrigger value="cores" className="text-sm">
                  Cores
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="texto" className="m-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-input">Texto</Label>
                      <div className="flex space-x-2">
                        <input
                          id="text-input"
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                        <Button onClick={addTextToCanvas}>Adicionar</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Estilo</Label>
                      <div className="flex space-x-1">
                        <Button
                          variant={isBold ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setIsBold(!isBold)
                            if (selectedElement) {
                              updateSelectedElement({ isBold: !isBold })
                            }
                          }}
                          className="flex-1 font-bold"
                        >
                          B
                        </Button>
                        <Button
                          variant={isItalic ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setIsItalic(!isItalic)
                            if (selectedElement) {
                              updateSelectedElement({ isItalic: !isItalic })
                            }
                          }}
                          className="flex-1 italic"
                        >
                          I
                        </Button>
                        <Button
                          variant={isUnderline ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setIsUnderline(!isUnderline)
                            if (selectedElement) {
                              updateSelectedElement({ isUnderline: !isUnderline })
                            }
                          }}
                          className="flex-1 underline"
                        >
                          U
                        </Button>
                      </div>
                    </div>
                  
                    <div className="space-y-2">
                      <Label>Alinhamento</Label>
                      <div className="flex space-x-1">
                        <Button
                          variant={align === "left" ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setAlign("left")
                            if (selectedElement) {
                              updateSelectedElement({ align: "left" })
                            }
                          }}
                          className="flex-1"
                        >
                          ←
                        </Button>
                        <Button
                          variant={align === "center" ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setAlign("center")
                            if (selectedElement) {
                              updateSelectedElement({ align: "center" })
                            }
                          }}
                          className="flex-1"
                        >
                          ↔
                        </Button>
                        <Button
                          variant={align === "right" ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setAlign("right")
                            if (selectedElement) {
                              updateSelectedElement({ align: "right" })
                            }
                          }}
                          className="flex-1"
                        >
                          →
                        </Button>
                      </div>
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="font-size">Tamanho da Fonte: {fontSize}px</Label>
                      <Slider
                        id="font-size"
                        min={8}
                        max={72}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => {
                          setFontSize(value[0])
                          if (selectedElement) {
                            updateSelectedElement({ fontSize: value[0] })
                          }
                        }}
                      />
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Família da Fonte</Label>
                      <select
                        id="font-family"
                        value={fontFamily}
                        onChange={(e) => {
                          setFontFamily(e.target.value)
                          if (selectedElement) {
                            updateSelectedElement({ fontFamily: e.target.value })
                          }
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        {availableFonts.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font-color">Cor do Texto</Label>
                      <div className="flex">
                        <input
                          id="font-color"
                          type="color"
                          className="h-10 w-10 rounded-md border border-input"
                          value={fontColor}
                          onChange={(e) => {
                            setFontColor(e.target.value)
                            if (selectedElement) {
                              updateSelectedElement({ fontColor: e.target.value })
                            }
                          }}
                        />
                        <input
                          type="text"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ml-2"
                          value={fontColor}
                          onChange={(e) => {
                            setFontColor(e.target.value)
                            if (selectedElement) {
                              updateSelectedElement({ fontColor: e.target.value })
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    {selectedElement && (
                      <Button 
                        variant="destructive" 
                        className="w-full mt-4"
                        onClick={deleteSelectedElement}
                      >
                        Remover Elemento Selecionado
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="imagem" className="m-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Upload de Imagem</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={handleImageUpload}>
                        <ImageIcon className="h-8 w-8 mx-auto text-slate-400" />
                        <p className="mt-2 text-sm text-slate-600">
                          Clique para fazer upload de uma imagem
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Formatos aceitos: JPG, PNG, SVG
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Imagens Recomendadas</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <div 
                            key={num} 
                            className="border rounded-md aspect-square bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all"
                            onClick={handleImageUpload}
                          >
                            <img 
                              src={`/images/editor/img-${num}.svg`} 
                              alt={`Design ${num}`} 
                              className="w-3/4 h-3/4 object-contain opacity-70"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cores" className="m-0">
                  <div className="space-y-4">
                    <div>
                      <Label>Cor da Camiseta</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {availableColors.map((color) => (
                          <div 
                            key={color.value} 
                            className={`w-full aspect-square rounded-md cursor-pointer flex items-center justify-center ${
                              productColor.value === color.value 
                                ? 'ring-2 ring-blue-600 ring-offset-2' 
                                : 'border'
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setProductColor(color)}
                          >
                            {productColor.value === color.value && (
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: color.textColor }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Área central - Canvas de edição */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center relative">
            <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ChevronLeft className="h-3 w-3 mr-1" /> Zoom-
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(100)}
                >
                  <ZoomIn className="h-3 w-3 mr-1" />
                  100%
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                >
                  Zoom+ <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          
            <div className="relative" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
              {/* Camiseta de fundo */}
              <div 
                className="w-[500px] h-[600px] relative"
                style={{ backgroundColor: productColor.value }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Área de trabalho (dentro da camiseta) */}
                  <div
                    className="w-[300px] h-[400px] relative"
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  >
                    {/* Elementos do canvas */}
                    {canvasElements.map((element) => {
                      if (element.type === "text") {
                        return (
                          <div
                            key={element.id}
                            className={`absolute cursor-move p-1 ${
                              selectedElement === element.id
                                ? "ring-2 ring-blue-500"
                                : ""
                            }`}
                            style={{
                              left: element.x,
                              top: element.y,
                              transform: `translate(-50%, -50%) rotate(${element.rotation || 0}deg)`,
                              textAlign: element.align,
                              fontFamily: element.fontFamily,
                              fontSize: `${element.fontSize}px`,
                              color: element.fontColor,
                              fontWeight: element.isBold ? "bold" : "normal",
                              fontStyle: element.isItalic ? "italic" : "normal",
                              textDecoration: element.isUnderline ? "underline" : "none",
                            }}
                            onMouseDown={(e) => handleCanvasMouseDown(e, element.id)}
                          >
                            {element.content}
                            
                            {selectedElement === element.id && (
                              <div 
                                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 flex items-center bg-white rounded-full shadow-sm p-1"
                              >
                                <Move className="h-3 w-3 text-slate-500 mr-1" />
                                <span className="text-[10px] text-slate-700">Arrastar</span>
                              </div>
                            )}
                          </div>
                        )
                      }
                      
                      // Caso seja uma imagem (simulado)
                      return null
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Painel lateral direito - Propriedades e ações */}
          <div className="w-[250px] border-l bg-white p-4 flex flex-col">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <h2 className="font-semibold text-lg">Meu Design</h2>
                <div className="flex space-x-2">
                  <Button variant="default" onClick={saveDesign} className="flex-1">
                    Salvar Design
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={addToCart}>
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <h2 className="font-semibold">Visualização</h2>
                <div className="border rounded-md p-2 text-center">
                  <img 
                    src="/images/tshirt-preview.png" 
                    alt="Visualização da camiseta" 
                    className="w-full h-auto"
                  />
                  
                  {canvasElements.length > 0 && (
                    <div className="mt-2 text-sm text-center">
                      {canvasElements.find(el => el.type === "text")?.content}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <h2 className="font-semibold">Produto</h2>
                <div className="space-y-2">
                  <Label htmlFor="product-type">Tipo</Label>
                  <select
                    id="product-type"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option>Camiseta</option>
                    <option>Moletom</option>
                    <option>Caneca</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-size">Tamanho</Label>
                  <select
                    id="product-size"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    defaultValue="M"
                  >
                    <option>P</option>
                    <option>M</option>
                    <option>G</option>
                    <option>GG</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
