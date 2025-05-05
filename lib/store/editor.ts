import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AVAILABLE_MOCKUPS, AVAILABLE_COLORS, ZOOM_LEVELS, SENSITIVITY } from '../constants/editor';

// Tipos
export type CanvasElement = {
  id: string;
  type: "text" | "image" | "shape";
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
  width?: number;
  height?: number;
  zIndex?: number;
  isSVG?: boolean;
  isTextSVG?: boolean;
  originalText?: string;
  textOptions?: any;
  opacity?: number;
  locked?: boolean;
};

type EditorState = {
  // Estado do canvas
  canvasElements: CanvasElement[];
  selectedElement: string | null;
  isDragging: boolean;
  isResizing: boolean;
  dragStart: { x: number; y: number };
  resizeStart: { width: number; height: number; x: number; y: number };
  isPanning: boolean;
  panPosition: { x: number; y: number };
  panStart: { x: number; y: number };
  zoom: number;
  zoomCenter: { x: number; y: number };

  // Estado de mockups e cores
  selectedMockup: typeof AVAILABLE_MOCKUPS[0];
  productColor: typeof AVAILABLE_COLORS[0];
  currentView: string;

  // Estado de texto
  text: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  align: "left" | "center" | "right";
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;

  // Estado de histórico
  history: CanvasElement[][];
  historyIndex: number;

  // Estado da interface
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  activeTab: string;
  isSaving: boolean;
  showMockupSelector: boolean;

  // Setters básicos
  setCanvasElements: (elements: CanvasElement[]) => void;
  setSelectedElement: (id: string | null) => void;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (pos: { x: number; y: number }) => void;
  setIsResizing: (resizing: boolean) => void;
  setResizeStart: (start: { width: number; height: number; x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  setZoomCenter: (center: { x: number; y: number }) => void;
  setPanning: (panning: boolean) => void;
  setPanPosition: (pos: { x: number; y: number }) => void;
  setPanStart: (start: { x: number; y: number }) => void;
  setSelectedMockup: (mockup: typeof AVAILABLE_MOCKUPS[0]) => void;
  setProductColor: (color: typeof AVAILABLE_COLORS[0]) => void;
  setCurrentView: (view: string) => void;
  setText: (text: string) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setFontColor: (color: string) => void;
  setAlign: (align: "left" | "center" | "right") => void;
  setIsBold: (bold: boolean) => void;
  setIsItalic: (italic: boolean) => void;
  setIsUnderline: (underline: boolean) => void;
  setLeftPanelCollapsed: (collapsed: boolean) => void;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  setActiveTab: (tab: string) => void;
  setIsSaving: (saving: boolean) => void;
  setShowMockupSelector: (show: boolean) => void;
  
  // Ações compostas
  addTextToCanvas: () => void;
  addImageToCanvas: (imageData: { content: string; width: number; height: number; isSVG?: boolean }) => void;
  deleteSelectedElement: () => void;
  updateSelectedElement: (updates: Partial<CanvasElement>) => void;
  addToHistory: (elements: CanvasElement[]) => void;
  undo: () => void;
  redo: () => void;
  zoomTo: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetCanvasPosition: () => void;
  handleRotate: (elementId: string) => void;
  moveElementToFront: (elementId: string) => void;
  moveElementToBack: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;
  toggleElementLock: (elementId: string) => void;
  exportDesign: () => void;
  addToCart: () => void;
  
  // Manipulação do canvas
  handleCanvasMouseMove: (e: React.MouseEvent) => void;
  handleCanvasMouseUp: () => void;
  handleCanvasPanStart: (e: React.MouseEvent) => void;
  handleCanvasPanMove: (e: React.MouseEvent) => void;
  handleCanvasPanEnd: () => void;
  handleResizeStart: (e: React.MouseEvent, element: CanvasElement) => void;
  handleResizeMove: (e: React.MouseEvent) => void;
  handleResizeEnd: () => void;
  handleZoomWheel: (e: React.WheelEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
};

const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial do canvas
        canvasElements: [],
        selectedElement: null,
        isDragging: false,
        isResizing: false,
        dragStart: { x: 0, y: 0 },
        resizeStart: { width: 0, height: 0, x: 0, y: 0 },
        isPanning: false,
        panPosition: { x: 0, y: 0 },
        panStart: { x: 0, y: 0 },
        zoom: 100,
        zoomCenter: { x: 0.5, y: 0.5 },

        // Estado inicial de mockups e cores
        selectedMockup: AVAILABLE_MOCKUPS[0],
        productColor: AVAILABLE_COLORS[0],
        currentView: AVAILABLE_MOCKUPS[0].viewOptions[0],

        // Estado inicial de texto
        text: "Seu texto aqui",
        fontSize: 24,
        fontFamily: "Arial, sans-serif",
        fontColor: "#000000",
        align: "center",
        isBold: false,
        isItalic: false,
        isUnderline: false,

        // Estado inicial de histórico
        history: [],
        historyIndex: -1,

        // Estado inicial da interface
        leftPanelCollapsed: false,
        rightPanelCollapsed: false,
        activeTab: "texto",
        isSaving: false,
        showMockupSelector: false,

        // Setters básicos
        setCanvasElements: (elements) => set({ canvasElements: elements }),
        setSelectedElement: (id) => set({ selectedElement: id }),
        setIsDragging: (dragging) => set({ isDragging: dragging }),
        setDragStart: (pos) => set({ dragStart: pos }),
        setIsResizing: (resizing) => set({ isResizing: resizing }),
        setResizeStart: (start) => set({ resizeStart: start }),
        setZoom: (zoom) => set({ zoom }),
        setZoomCenter: (center) => set({ zoomCenter: center }),
        setPanning: (panning) => set({ isPanning: panning }),
        setPanPosition: (pos) => set({ panPosition: pos }),
        setPanStart: (start) => set({ panStart: start }),
        setSelectedMockup: (mockup) => set({ selectedMockup: mockup }),
        setProductColor: (color) => set({ productColor: color }),
        setCurrentView: (view) => set({ currentView: view }),
        setText: (text) => set({ text }),
        setFontSize: (size) => set({ fontSize: size }),
        setFontFamily: (family) => set({ fontFamily: family }),
        setFontColor: (color) => set({ fontColor: color }),
        setAlign: (align) => set({ align }),
        setIsBold: (bold) => set({ isBold: bold }),
        setIsItalic: (italic) => set({ isItalic: italic }),
        setIsUnderline: (underline) => set({ isUnderline: underline }),
        setLeftPanelCollapsed: (collapsed) => set({ leftPanelCollapsed: collapsed }),
        setRightPanelCollapsed: (collapsed) => set({ rightPanelCollapsed: collapsed }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setIsSaving: (saving) => set({ isSaving: saving }),
        setShowMockupSelector: (show) => set({ showMockupSelector: show }),

        // Ações compostas e implementação das funções

        // Função para adicionar ao histórico
        addToHistory: (elements) => {
          const state = get();
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), [...elements]];
          set({ 
            history: newHistory,
            historyIndex: newHistory.length - 1
          });
        },

        // Função para desfazer
        undo: () => {
          const state = get();
          if (state.historyIndex > 0) {
            set({
              historyIndex: state.historyIndex - 1,
              canvasElements: [...state.history[state.historyIndex - 1]]
            });
          }
        },

        // Função para refazer
        redo: () => {
          const state = get();
          if (state.historyIndex < state.history.length - 1) {
            set({
              historyIndex: state.historyIndex + 1,
              canvasElements: [...state.history[state.historyIndex + 1]]
            });
          }
        },

        // Adicionar texto ao canvas
        addTextToCanvas: () => {
          const state = get();
          
          // Construímos as opções do SVG baseadas nas configurações de texto
          const svgOptions = {
            fontSize: state.fontSize,
            fontFamily: state.fontFamily,
            fontColor: state.fontColor,
            fontWeight: state.isBold ? 'bold' : 'normal',
            fontStyle: state.isItalic ? 'italic' : 'normal',
            textDecoration: state.isUnderline ? 'underline' : 'none',
            textAlign: state.align,
            width: state.fontSize * state.text.length * 0.8, // Estimativa aproximada da largura
            height: state.fontSize * 1.5 // Altura padrão para texto
          };
          
          // Função para converter texto em SVG
          const textToSVG = (text: string, options: any) => {
            const {
              fontSize,
              fontFamily,
              fontColor,
              fontWeight,
              fontStyle,
              textDecoration,
              textAlign,
              width = fontSize * text.length,
              height = fontSize * 1.5
            } = options;
            
            // Escapamos o texto para evitar problemas com XML
            const escapedText = text
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
            
            // Calculamos a posição do texto baseado no alinhamento
            let x = '50%';
            let anchor = 'middle';
            
            if (textAlign === 'left') {
              x = '0';
              anchor = 'start';
            } else if (textAlign === 'right') {
              x = '100%';
              anchor = 'end';
            }
            
            // Estilização de decoração de texto
            const decorations = [];
            if (textDecoration === 'underline') {
              decorations.push(`text-decoration="underline"`);
            }
            
            // Criamos o SVG
            const svg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <text 
                  x="${x}" 
                  y="${height / 2}" 
                  font-family="${fontFamily}"
                  font-size="${fontSize}px"
                  fill="${fontColor}"
                  font-weight="${fontWeight}"
                  font-style="${fontStyle}"
                  text-anchor="${anchor}"
                  dominant-baseline="middle"
                  ${decorations.join(' ')}
                >
                  ${escapedText}
                </text>
              </svg>
            `;
            
            // Convertemos para data URL
            return `data:image/svg+xml,${encodeURIComponent(svg)}`;
          };
          
          // Geramos o SVG
          const svgData = textToSVG(state.text, svgOptions);
          
          // Criamos o elemento no canvas
          const newElement: CanvasElement = {
            id: `text-${Date.now()}`,
            type: "image",
            content: svgData,
            x: 150,
            y: 200,
            rotation: 0,
            width: svgOptions.width,
            height: svgOptions.height,
            isSVG: true,
            isTextSVG: true,
            originalText: state.text,
            textOptions: svgOptions,
            zIndex: state.canvasElements.length + 1
          };
          
          const newElements = [...state.canvasElements, newElement];
          set({ 
            canvasElements: newElements,
            selectedElement: newElement.id
          });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Adicionar imagem ao canvas
        addImageToCanvas: (imageData) => {
          const state = get();
          const newElement: CanvasElement = {
            id: `image-${Date.now()}`,
            type: "image",
            content: imageData.content,
            x: 150,
            y: 200,
            rotation: 0,
            width: imageData.width,
            height: imageData.height,
            isSVG: imageData.isSVG,
            isTextSVG: false,
            originalText: "",
            textOptions: {},
            zIndex: state.canvasElements.length + 1
          };
          
          const newElements = [...state.canvasElements, newElement];
          set({ 
            canvasElements: newElements,
            selectedElement: newElement.id
          });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Remover elemento selecionado
        deleteSelectedElement: () => {
          const state = get();
          if (!state.selectedElement) return;
          
          const newElements = state.canvasElements.filter(el => el.id !== state.selectedElement);
          set({ 
            canvasElements: newElements,
            selectedElement: null
          });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Atualizar propriedades do elemento selecionado
        updateSelectedElement: (updates) => {
          const state = get();
          if (!state.selectedElement) return;
          
          const newElements = state.canvasElements.map(el => {
            if (el.id === state.selectedElement) {
              const updatedElement = {
                ...el,
                ...updates
              };
              
              // Se for um texto SVG e as propriedades de texto foram alteradas, regeneramos o SVG
              if (el.isTextSVG && (
                updates.fontColor || 
                updates.fontSize || 
                updates.fontFamily || 
                updates.isBold || 
                updates.isItalic || 
                updates.isUnderline || 
                updates.align
              )) {
                // Implementar regeneração do SVG aqui quando necessário
                // (Esta funcionalidade será implementada em uma atualização futura)
              }
              
              return updatedElement;
            }
            return el;
          });
          
          set({ canvasElements: newElements });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Níveis de zoom
        zoomTo: (level) => {
          set({ zoom: level });
        },

        zoomIn: () => {
          const state = get();
          const currentIndex = ZOOM_LEVELS.indexOf(state.zoom);
          if (currentIndex < ZOOM_LEVELS.length - 1) {
            set({ zoom: ZOOM_LEVELS[currentIndex + 1] });
          }
        },

        zoomOut: () => {
          const state = get();
          const currentIndex = ZOOM_LEVELS.indexOf(state.zoom);
          if (currentIndex > 0) {
            set({ zoom: ZOOM_LEVELS[currentIndex - 1] });
          }
        },

        resetCanvasPosition: () => {
          set({ 
            panPosition: { x: 0, y: 0 },
            zoom: 100
          });
        },

        // Rotação de elementos
        handleRotate: (elementId) => {
          const state = get();
          const newElements = state.canvasElements.map(el => {
            if (el.id === elementId) {
              const currentRotation = el.rotation || 0;
              return {
                ...el,
                rotation: (currentRotation + 15) % 360
              };
            }
            return el;
          });
          
          set({ canvasElements: newElements });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Mover elemento para frente (aumentar z-index)
        moveElementToFront: (elementId) => {
          const state = get();
          const maxZIndex = Math.max(...state.canvasElements.map(el => el.zIndex || 0));
          
          const newElements = state.canvasElements.map(el => {
            if (el.id === elementId) {
              return {
                ...el,
                zIndex: maxZIndex + 1
              };
            }
            return el;
          });
          
          set({ canvasElements: newElements });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Mover elemento para trás (diminuir z-index)
        moveElementToBack: (elementId) => {
          const state = get();
          const minZIndex = Math.min(...state.canvasElements.map(el => el.zIndex || 0));
          
          const newElements = state.canvasElements.map(el => {
            if (el.id === elementId) {
              return {
                ...el,
                zIndex: minZIndex - 1
              };
            }
            return el;
          });
          
          set({ canvasElements: newElements });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Duplicar elemento
        duplicateElement: (elementId) => {
          const state = get();
          const elementToDuplicate = state.canvasElements.find(el => el.id === elementId);
          
          if (!elementToDuplicate) return;
          
          const newElement = {
            ...elementToDuplicate,
            id: `${elementToDuplicate.type}-${Date.now()}`,
            x: elementToDuplicate.x + 20,
            y: elementToDuplicate.y + 20
          };
          
          const newElements = [...state.canvasElements, newElement];
          set({ 
            canvasElements: newElements,
            selectedElement: newElement.id
          });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Bloquear/desbloquear elemento
        toggleElementLock: (elementId) => {
          const state = get();
          const newElements = state.canvasElements.map(el => {
            if (el.id === elementId) {
              return {
                ...el,
                locked: !el.locked
              };
            }
            return el;
          });
          
          set({ canvasElements: newElements });
          
          // Adicionar ao histórico
          get().addToHistory(newElements);
        },

        // Exportar design
        exportDesign: () => {
          // Implementar lógica para exportar design
          console.log("Exportando design...");
        },

        // Adicionar ao carrinho
        addToCart: () => {
          // Implementar lógica para adicionar ao carrinho
          console.log("Adicionando ao carrinho...");
        },

        // Manipulação do canvas
        handleCanvasMouseMove: (e: React.MouseEvent) => {
          const state = get();
          if (state.isDragging && state.selectedElement) {
            const element = state.canvasElements.find(el => el.id === state.selectedElement);
            if (!element || element.locked) return;
            
            const deltaX = e.clientX - state.dragStart.x;
            const deltaY = e.clientY - state.dragStart.y;
            
            const newElements = state.canvasElements.map(el => {
              if (el.id === state.selectedElement) {
                return {
                  ...el,
                  x: el.x + deltaX,
                  y: el.y + deltaY
                };
              }
              return el;
            });
            
            set({
              canvasElements: newElements,
              dragStart: { x: e.clientX, y: e.clientY }
            });
          }
        },
        
        handleCanvasMouseUp: () => {
          const state = get();
          if (state.isDragging) {
            set({ isDragging: false });
            get().addToHistory(state.canvasElements);
          }
        },
        
        handleCanvasPanStart: (e: React.MouseEvent) => {
          if (e.button === 1) { // Mouse wheel button
            e.preventDefault();
            set({
              isPanning: true,
              panStart: { x: e.clientX, y: e.clientY }
            });
          }
        },
        
        handleCanvasPanMove: (e: React.MouseEvent) => {
          const state = get();
          if (state.isPanning) {
            const deltaX = e.clientX - state.panStart.x;
            const deltaY = e.clientY - state.panStart.y;
            
            set({
              panPosition: {
                x: state.panPosition.x + deltaX * SENSITIVITY.pan,
                y: state.panPosition.y + deltaY * SENSITIVITY.pan
              },
              panStart: { x: e.clientX, y: e.clientY }
            });
          }
        },
        
        handleCanvasPanEnd: () => {
          set({ isPanning: false });
        },
        
        handleResizeStart: (e: React.MouseEvent, element: CanvasElement) => {
          e.stopPropagation();
          set({
            isResizing: true,
            resizeStart: {
              width: element.width || 100,
              height: element.height || 100,
              x: e.clientX,
              y: e.clientY
            }
          });
        },
        
        handleResizeMove: (e: React.MouseEvent) => {
          const state = get();
          if (state.isResizing && state.selectedElement) {
            const element = state.canvasElements.find(el => el.id === state.selectedElement);
            if (!element) return;
            
            const deltaX = e.clientX - state.resizeStart.x;
            const deltaY = e.clientY - state.resizeStart.y;
            
            // Manter proporção se largura/altura estiverem definidas
            const aspectRatio = 
              element.width && element.height
                ? element.width / element.height
                : 1;
                
            let newWidth = state.resizeStart.width + deltaX;
            let newHeight = state.resizeStart.height + deltaY;
            
            // Manter proporção se tecla Shift pressionada
            if (e.shiftKey) {
              if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newHeight = newWidth / aspectRatio;
              } else {
                newWidth = newHeight * aspectRatio;
              }
            }
            
            // Garantir tamanho mínimo
            newWidth = Math.max(20, newWidth);
            newHeight = Math.max(20, newHeight);
            
            // Atualizar o elemento
            get().updateSelectedElement({
              width: newWidth,
              height: newHeight
            });
          }
        },
        
        handleResizeEnd: () => {
          const state = get();
          if (state.isResizing) {
            set({ isResizing: false });
            get().addToHistory(state.canvasElements);
          }
        },
        
        handleZoomWheel: (e: React.WheelEvent) => {
          e.preventDefault();
          
          const state = get();
          if (e.ctrlKey) {
            // Zoom com tecla Ctrl
            const direction = e.deltaY > 0 ? -1 : 1;
            
            // Encontrar o índice de zoom atual
            const currentZoomIndex = ZOOM_LEVELS.findIndex(level => level >= state.zoom);
            let newZoomIndex = currentZoomIndex + direction;
            
            // Limitar índice de zoom
            newZoomIndex = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, newZoomIndex));
            
            set({ zoom: ZOOM_LEVELS[newZoomIndex] });
          } else {
            // Roda normal para pan
            set({
              panPosition: {
                x: state.panPosition.x - e.deltaX,
                y: state.panPosition.y - e.deltaY
              }
            });
          }
        },
        
        handleTouchStart: (e: React.TouchEvent) => {
          if (e.touches.length === 1) {
            // Toque único - selecionar/arrastar
            const touch = e.touches[0];
            
            // Lógica para selecionar elemento 
            // (implementação básica; expandir conforme necessário)
          } else if (e.touches.length === 2) {
            // Dois dedos - pinça para zoom
            // (implementação básica; expandir conforme necessário)
          }
        },
        
        handleTouchMove: (e: React.TouchEvent) => {
          const state = get();
          if (e.touches.length === 1 && state.isDragging) {
            // Mover elemento com um dedo
            const touch = e.touches[0];
            
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY
            } as React.MouseEvent;
            
            get().handleCanvasMouseMove(mouseEvent);
          } else if (e.touches.length === 2) {
            // Implementar zoom com dois dedos (pinça)
            // (implementação básica; expandir conforme necessário)
          }
        },
        
        handleTouchEnd: (e: React.TouchEvent) => {
          // Resetar estados de arrastar ou redimensionar
          set({
            isDragging: false,
            isResizing: false
          });
          
          const state = get();
          get().addToHistory(state.canvasElements);
        }
      }),
      {
        name: 'editor-storage',
        partialize: (state) => ({
          canvasElements: state.canvasElements,
          selectedMockup: state.selectedMockup,
          productColor: state.productColor,
          currentView: state.currentView
        })
      }
    )
  )
);

export default useEditorStore; 