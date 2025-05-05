"use client";

import React, { useEffect } from "react";
import { ChevronDown, Lock, Trash } from "lucide-react";
import useEditorStore from "@/lib/store/editor";
import { Tooltip } from "../ui/tooltip";
import { SafeImage } from "./safe-image";

export function EditorCanvas() {
  // Recuperar estado e manipuladores do editor store
  const {
    canvasElements,
    selectedElement,
    zoom,
    panPosition,
    isDragging,
    isResizing,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasPanStart,
    handleCanvasPanMove,
    handleCanvasPanEnd,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    handleZoomWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setSelectedElement,
    setIsDragging,
    setDragStart,
    deleteSelectedElement,
    selectedMockup,
    currentView,
    productColor
  } = useEditorStore();

  // Efeito para lidar com eventos de teclado (deletar elementos selecionados)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        deleteSelectedElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement, deleteSelectedElement]);

  // Função para renderizar informações de ajuda sobre zoom
  const renderZoomHelp = () => {
    return (
      <div className="absolute bottom-4 right-4 bg-black/80 text-white p-2 rounded-md text-xs">
        <p>Dicas:</p>
        <p>Ctrl + Roda do mouse para zoom</p>
        <p>Roda do mouse para pan</p>
        <p>Clique para selecionar</p>
      </div>
    );
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-neutral-800"
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseDown={handleCanvasPanStart}
      onWheel={handleZoomWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fundo padrão */}
      <div
        className="absolute left-0 top-0 w-full h-full bg-grid-pattern"
        style={{
          backgroundSize: `${zoom / 100 * 20}px ${zoom / 100 * 20}px`,
          transform: `translate(${panPosition.x}px, ${panPosition.y}px)`,
          transition: isDragging || isResizing ? 'none' : 'transform 0.1s ease-out'
        }}
      />

      {/* Área de mockup */}
      <div
        className="absolute bg-white rounded-md shadow-xl"
        style={{
          width: 500,
          height: 600,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom / 100})`,
          transition: isDragging || isResizing ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Mockup image */}
        <div className="relative w-full h-full">
          <SafeImage
            src={selectedMockup.path}
            alt={selectedMockup.name}
            className="w-full h-full object-contain"
            style={{
              filter: productColor.value === '#ffffff' ? 'none' : 'brightness(0.8) saturate(1.2)',
              backgroundColor: productColor.value
            }}
          />
          
          {/* Área de design */}
          <div
            className="absolute border-2 border-dashed border-blue-500 pointer-events-none"
            style={{
              ...(selectedMockup.designArea[currentView as keyof typeof selectedMockup.designArea] || selectedMockup.designArea.frente),
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%'
            }}
          />
        </div>
      </div>

      {/* Área de trabalho - elementos do canvas */}
      <div
        className="absolute left-0 top-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom / 100})`,
          transformOrigin: 'center',
          transition: isDragging || isResizing ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Renderizar elementos do canvas */}
        {canvasElements.map((element) => (
          <div
            key={element.id}
            className={`absolute pointer-events-auto cursor-move ${
              selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
            } ${element.locked ? 'cursor-not-allowed opacity-70' : ''}`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              zIndex: element.zIndex || 0,
              transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element.id);
            }}
            onMouseDown={(e) => {
              if (element.locked) return;
              e.stopPropagation();
              setSelectedElement(element.id);
              setIsDragging(true);
              setDragStart({ x: e.clientX, y: e.clientY });
            }}
            onTouchStart={(e) => {
              if (element.locked) return;
              e.stopPropagation();
              setSelectedElement(element.id);
              const touch = e.touches[0];
              setIsDragging(true);
              setDragStart({ x: touch.clientX, y: touch.clientY });
            }}
          >
            {/* Conteúdo do elemento */}
            {element.type === "image" && (
              <SafeImage
                src={element.content}
                alt="Canvas element"
                className="w-full h-full object-contain"
                draggable={false}
              />
            )}

            {/* Ícone de bloqueio caso o elemento esteja bloqueado */}
            {element.locked && (
              <div className="absolute -top-6 -right-2 bg-gray-700 p-1 rounded-full">
                <Tooltip text="Elemento bloqueado">
                  <Lock size={16} className="text-white" />
                </Tooltip>
              </div>
            )}

            {/* Controladores de redimensionamento (apenas para elementos selecionados e não bloqueados) */}
            {selectedElement === element.id && !element.locked && (
              <>
                {/* Controlador de exclusão */}
                <button
                  className="absolute -top-6 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSelectedElement();
                  }}
                >
                  <Tooltip text="Excluir elemento">
                    <Trash size={16} className="text-white" />
                  </Tooltip>
                </button>

                {/* Controladores de redimensionamento nas 8 direções */}
                {['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map((direction) => {
                  // Determinar a posição e estilo do controlador com base na direção
                  const directionToStyle = {
                    n: { top: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' },
                    ne: { top: -5, right: -5, cursor: 'ne-resize' },
                    e: { top: '50%', right: -5, transform: 'translateY(-50%)', cursor: 'e-resize' },
                    se: { bottom: -5, right: -5, cursor: 'se-resize' },
                    s: { bottom: -5, left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' },
                    sw: { bottom: -5, left: -5, cursor: 'sw-resize' },
                    w: { top: '50%', left: -5, transform: 'translateY(-50%)', cursor: 'w-resize' },
                    nw: { top: -5, left: -5, cursor: 'nw-resize' },
                  }[direction];

                  return (
                    <div
                      key={direction}
                      className="absolute w-3 h-3 bg-white border border-blue-500 rounded-full z-20"
                      style={{ ...directionToStyle }}
                      onMouseDown={(e) => handleResizeStart(e, element)}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        // Criar um evento de mouse simulado a partir do evento de toque
                        const touch = e.touches[0];
                        const mouseEvent = {
                          clientX: touch.clientX,
                          clientY: touch.clientY,
                          stopPropagation: () => e.stopPropagation()
                        } as unknown as React.MouseEvent;
                        handleResizeStart(mouseEvent, element);
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Overlay para exibir ajuda de zoom */}
      {renderZoomHelp()}

      {/* Indicador de zoom atual */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded-md">
        {zoom}%
        <ChevronDown className="inline-block ml-1" size={14} />
      </div>
    </div>
  );
} 