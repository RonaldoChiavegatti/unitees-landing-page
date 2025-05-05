"use client"

import React, { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import html2canvas from 'html2canvas'
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Toolbar from "@/components/editor/toolbar"
import Sidebar from "@/components/editor/sidebar"
import { EditorCanvas } from "@/components/editor/canvas"
import useEditorStore from "@/lib/store/editor"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

export default function EditorPage() {
  const router = useRouter();
  const { toast } = useToast()
  
  const [epsDialogOpen, setEpsDialogOpen] = useState(false);
  
  const { 
    addTextToCanvas,
    isSaving, 
    setIsSaving,
    rightPanelCollapsed,
    setRightPanelCollapsed,
    selectedMockup,
    addToCart,
    exportDesign
  } = useEditorStore();
  
  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Referência para o input de importação
  const importInputRef = useRef<HTMLInputElement>(null);
  
  // Função para adicionar texto ao canvas
  const handleAddText = () => {
    addTextToCanvas();
  };
  
  // Função para upload de imagem
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Esta função será gerenciada no componente Sidebar
    // Manter aqui apenas para passar como prop
  };
  
  // Função para salvar o design
  const handleSaveDesign = async () => {
    setIsSaving(true);
    
    try {
      // Simulação de salvamento 
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Design salvo com sucesso!");
      // Aqui você adicionaria a lógica real para salvar o design
    } catch (error) {
      console.error("Erro ao salvar design:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Função para exportar design
  const handleExportDesign = () => {
    exportDesign();
    // Opcional: abrir diálogo de download ou similar
  };
  
  // Função para adicionar ao carrinho
  const handleAddToCart = () => {
    addToCart();
    // Navegação para o carrinho após adicionar
    router.push("/cart");
  };
  
  // Função para mostrar informações sobre EPS
  const handleEpsInfo = () => {
    setEpsDialogOpen(true);
  };
  
  // Função para lidar com informações sobre arquivos EPS
  const handleEpsSupport = () => {
    setEpsDialogOpen(true);
  };
  
  // Importar design de um arquivo JSON
  const importDesignFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (!result || typeof result !== 'string') {
          toast({
            title: "Erro na leitura",
            description: "Não foi possível ler o conteúdo do arquivo"
          });
          return;
        }
        
        const jsonData = JSON.parse(result);
        
        // Verificar se o JSON tem a estrutura esperada
        if (!jsonData.mockup || !jsonData.elements) {
          throw new Error("Formato de arquivo inválido");
        }
        
        // Esta lógica deve ser movida para o store em uma função importFromJSON
        // setSelectedMockup, setProductColor, setCurrentView, setCanvasElements, etc.
        
        toast({
          title: "Design importado!",
          description: "Seu design foi importado com sucesso"
        });
      } catch (error) {
        console.error("Erro ao importar design:", error);
        toast({
          title: "Erro na importação",
          description: "Não foi possível importar o design. Formato inválido."
        });
      }
      
      // Reset do input para permitir reupload do mesmo arquivo
      event.target.value = '';
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro na leitura",
        description: "Não foi possível ler o arquivo"
      });
    };
    
    reader.readAsText(file);
  };
  
  useEffect(() => {
    // Função para prevenir o zoom do navegador quando o cursor estiver sobre o canvas
    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    
    // Adicionar ouvinte de evento para toda a janela com opção de passive: false
    document.addEventListener('wheel', preventBrowserZoom, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventBrowserZoom);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <Toaster />
      
      {/* Input para importação de arquivos JSON */}
      <input 
        type="file"
        accept=".json"
        ref={importInputRef}
        className="hidden"
        onChange={importDesignFromJSON}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior */}
        <Toolbar 
          onExport={handleExportDesign}
          onSave={handleSaveDesign}
          onAddToCart={handleAddToCart}
          isSaving={isSaving}
        />
        
        {/* Área principal - Editor */}
        <div className="flex-1 flex overflow-hidden editor-main-container">
          {/* Painel Esquerdo */}
          <div className={`bg-white border-r shadow-sm panel-transition editor-scrollbar ${
            rightPanelCollapsed ? 'w-0 sm:w-10' : 'w-full sm:w-[280px]'
          } ${
            rightPanelCollapsed ? 'absolute sm:relative h-full z-50' : ''
          }`}>
            <Sidebar 
              onAddText={handleAddText}
              onUploadImage={handleUploadImage}
              onEpsInfo={handleEpsInfo}
              fileInputRef={fileInputRef}
            />
          </div>
          
          {/* Área central - Canvas de edição */}
          <EditorCanvas />
        </div>
      </main>
      
      <Footer />
      
      {/* Diálogo de informações EPS */}
      <AlertDialog open={epsDialogOpen} onOpenChange={setEpsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivos EPS</AlertDialogTitle>
            <AlertDialogDescription>
              Arquivos EPS (Encapsulated PostScript) são imagens vetoriais de alta qualidade
              ideais para impressão. Este mockup inclui arquivos EPS que permitem
              escalabilidade sem perda de qualidade. Perfeito para impressão em alta resolução
              e aplicações profissionais.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            <AlertDialogAction>Baixar EPS</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
