"use client";

import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Undo, 
  Redo,
  Copy,
  Trash2,
  Save,
  Upload,
  ShoppingCart,
  Move,
  MousePointer,
  Type,
  Image,
  Square,
  Layers,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import useEditorStore from "@/lib/store/editor";
import { TOOLTIPS, ZOOM_LEVELS } from "@/lib/constants/editor";

interface ToolbarProps {
  onExport: () => void;
  onSave: () => void;
  onAddToCart: () => void;
  isSaving: boolean;
}

export default function Toolbar({ onExport, onSave, onAddToCart, isSaving }: ToolbarProps) {
  // Acessar o estado do editor
  const {
    zoom,
    zoomIn,
    zoomOut,
    zoomTo,
    resetCanvasPosition,
    selectedElement,
    canvasElements,
    deleteSelectedElement,
    undo,
    redo,
    history,
    historyIndex,
    moveElementToFront,
    moveElementToBack,
    duplicateElement,
    toggleElementLock,
    handleRotate
  } = useEditorStore();

  // Formatar nível de zoom
  const formatZoomLevel = (zoom: number) => {
    return `${zoom}%`;
  };
  
  // Verificar se o elemento selecionado está bloqueado
  const isSelectedElementLocked = selectedElement 
    ? canvasElements.find(el => el.id === selectedElement)?.locked 
    : false;

  return (
    <div className="bg-white border-b px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        {/* Seção de Ferramentas */}
        <div className="flex items-center gap-1 mr-2">
          <Tooltip text={TOOLTIPS.undo}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip text={TOOLTIPS.redo}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Seção de manipulação de elemento */}
        <div className="flex items-center gap-1 mx-2">
          {selectedElement && (
            <>
              <Tooltip text={TOOLTIPS.delete}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={deleteSelectedElement}
                  disabled={isSelectedElementLocked}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              <Tooltip text={TOOLTIPS.rotate}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => selectedElement && handleRotate(selectedElement)}
                  disabled={isSelectedElementLocked}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              <Tooltip text={TOOLTIPS.moveToFront}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => selectedElement && moveElementToFront(selectedElement)}
                  disabled={isSelectedElementLocked}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              <Tooltip text={TOOLTIPS.moveToBack}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => selectedElement && moveElementToBack(selectedElement)}
                  disabled={isSelectedElementLocked}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              <Tooltip text="Duplicar elemento">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => selectedElement && duplicateElement(selectedElement)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              <Tooltip text={isSelectedElementLocked ? "Desbloquear elemento" : "Bloquear elemento"}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => selectedElement && toggleElementLock(selectedElement)}
                >
                  {isSelectedElementLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                </Button>
              </Tooltip>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Controles de Zoom */}
        <div className="zoom-controls flex items-center space-x-1 bg-slate-100 rounded-md">
          <Tooltip text={TOOLTIPS.zoomOut}>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2"
              onClick={zoomOut}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
          </Tooltip>
          
          <div className="relative group">
            <Tooltip text={TOOLTIPS.resetZoom}>
              <span 
                className="text-sm font-medium px-1 cursor-pointer" 
                onClick={() => zoomTo(100)}
              >
                {formatZoomLevel(zoom)}
              </span>
            </Tooltip>
            
            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white shadow-md rounded p-1 z-50">
              <div className="flex flex-col gap-1">
                {ZOOM_LEVELS.map(level => (
                  <Button 
                    key={level} 
                    variant={zoom === level ? "default" : "ghost"} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => zoomTo(level)}
                  >
                    {formatZoomLevel(level)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <Tooltip text={TOOLTIPS.zoomIn}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={zoomIn}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </Tooltip>
        </div>
        
        <div className="h-5 border-l border-slate-300 mx-1"></div>
        
        {/* Botões de Ação */}
        <Tooltip text={TOOLTIPS.save}>
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Salvar</span>
          </Button>
        </Tooltip>
        
        <Tooltip text={TOOLTIPS.export}>
          <Button 
            variant="default" 
            size="sm"
            className="h-8"
            onClick={onExport}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full"></span>
                <span className="hidden sm:inline">Processando...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Exportar</span>
              </>
            )}
          </Button>
        </Tooltip>
        
        <Tooltip text={TOOLTIPS.addToCart}>
          <Button 
            variant="default" 
            size="sm"
            className="h-8 bg-green-600 hover:bg-green-700"
            onClick={onAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Adicionar ao Carrinho</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
} 