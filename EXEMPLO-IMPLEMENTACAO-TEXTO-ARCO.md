# Implementação de Texto em Arco para o Editor de Camisetas

Este documento detalha como implementar a funcionalidade de texto em arco para o editor de camisetas.

## Funcionamento da Feature

A funcionalidade de texto em arco permite que o usuário:

1. Crie texto que segue um caminho curvo (arco superior ou inferior)
2. Ajuste o raio da curvatura para maior ou menor arqueamento
3. Defina a direção do arco (superior/inferior)
4. Mantenha todas as propriedades de texto (fonte, cor, tamanho, etc.)

## Implementação Técnica

### 1. Modificar a função `textToSVG`

Atualmente, a função `textToSVG` no arquivo `app/editor/page.tsx` gera SVGs de texto simples. Precisamos expandir essa função para suportar texto em arco:

```typescript
// Função melhorada para converter texto em SVG com suporte para arco
const textToSVG = (text: string, options: {
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textAlign: string;
  width?: number;
  height?: number;
  arcMode?: "none" | "top" | "bottom"; // Adicionar modo de arco
  arcRadius?: number;                  // Raio do arco
}) => {
  const {
    fontSize,
    fontFamily,
    fontColor,
    fontWeight,
    fontStyle,
    textDecoration,
    textAlign,
    width = fontSize * text.length,
    height = fontSize * 1.5,
    arcMode = "none",
    arcRadius = 100
  } = options;
  
  // Escapamos o texto para evitar problemas com XML
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  
  // Para texto normal (sem arco)
  if (arcMode === "none") {
    // [Código existente para texto normal]
    let x = '50%';
    let anchor = 'middle';
    
    if (textAlign === 'left') {
      x = '0';
      anchor = 'start';
    } else if (textAlign === 'right') {
      x = '100%';
      anchor = 'end';
    }
    
    const decorations = [];
    if (textDecoration === 'underline') {
      decorations.push(`text-decoration="underline"`);
    }
    
    return `data:image/svg+xml,${encodeURIComponent(`
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
    `)}`;
  }
  
  // Para texto em arco
  // Calcular tamanho do SVG para acomodar o arco
  const calculatedWidth = Math.max(width, arcRadius * 2);
  const calculatedHeight = Math.max(height, arcRadius + fontSize + 20);
  
  // Definir o caminho do arco
  let pathD = '';
  let pathId = `textPath-${Date.now()}`;
  let textY = calculatedHeight / 2;
  
  if (arcMode === "top") {
    // Arco superior - texto segue caminho de baixo para cima
    pathD = `M ${calculatedWidth * 0.1},${textY + arcRadius} A ${arcRadius},${arcRadius} 0 0,1 ${calculatedWidth * 0.9},${textY + arcRadius}`;
  } else { // arcMode === "bottom"
    // Arco inferior - texto segue caminho de cima para baixo
    pathD = `M ${calculatedWidth * 0.1},${textY - arcRadius} A ${arcRadius},${arcRadius} 0 0,0 ${calculatedWidth * 0.9},${textY - arcRadius}`;
  }
  
  // Construir o SVG com texto em caminho
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${calculatedWidth}" height="${calculatedHeight}" viewBox="0 0 ${calculatedWidth} ${calculatedHeight}">
      <defs>
        <path id="${pathId}" d="${pathD}" />
      </defs>
      <text 
        font-family="${fontFamily}"
        font-size="${fontSize}px"
        fill="${fontColor}"
        font-weight="${fontWeight}"
        font-style="${fontStyle}"
        text-anchor="${textAlign === 'center' ? 'middle' : (textAlign === 'right' ? 'end' : 'start')}"
        ${textDecoration === 'underline' ? 'text-decoration="underline"' : ''}
      >
        <textPath href="#${pathId}" startOffset="${textAlign === 'center' ? '50%' : (textAlign === 'right' ? '100%' : '0%')}">
          ${escapedText}
        </textPath>
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
```

### 2. Adicionar Controles de UI para Texto em Arco

No componente principal `EditorPage`, precisamos adicionar controles para o modo de arco:

```tsx
// Adicionar estados para controle de arco
const [arcMode, setArcMode] = useState<"none" | "top" | "bottom">("none");
const [arcRadius, setArcRadius] = useState<number>(100);

// Na interface do usuário, adicionar seção para controle de arco
{selectedElement && canvasElements.find(el => el.id === selectedElement)?.type === "text" && (
  <div className="border-t pt-2 mt-2">
    <h3 className="text-sm font-medium mb-2">Estilo de Texto</h3>
    
    {/* Controles existentes para negrito, itálico, etc. */}
    {/* ... */}
    
    {/* Novos controles para arco */}
    <div className="mt-4">
      <h4 className="text-xs font-medium mb-1">Texto em Arco</h4>
      <div className="flex space-x-2 mb-2">
        <Button 
          size="sm" 
          variant={arcMode === "none" ? "default" : "outline"}
          onClick={() => {
            setArcMode("none");
            updateSelectedElementWithTextOptions();
          }}
        >
          Normal
        </Button>
        <Button 
          size="sm" 
          variant={arcMode === "top" ? "default" : "outline"}
          onClick={() => {
            setArcMode("top");
            updateSelectedElementWithTextOptions();
          }}
        >
          Arco Superior
        </Button>
        <Button 
          size="sm" 
          variant={arcMode === "bottom" ? "default" : "outline"}
          onClick={() => {
            setArcMode("bottom");
            updateSelectedElementWithTextOptions();
          }}
        >
          Arco Inferior
        </Button>
      </div>
      
      {arcMode !== "none" && (
        <div className="mb-4">
          <Label className="text-xs mb-1">Raio do Arco</Label>
          <div className="flex items-center space-x-2">
            <Slider 
              value={[arcRadius]} 
              min={50} 
              max={300} 
              step={5}
              onValueChange={(value) => {
                setArcRadius(value[0]);
                updateSelectedElementWithTextOptions();
              }} 
            />
            <span className="text-xs w-8 text-right">{arcRadius}</span>
          </div>
        </div>
      )}
    </div>
  </div>
)}
```

### 3. Atualizar a Função para Atualizar Elementos de Texto

Precisamos também atualizar a função `updateSelectedElement` ou criar uma nova função para atualizar especificamente elementos de texto:

```typescript
// Função específica para atualizar texto com opções de arco
const updateSelectedElementWithTextOptions = () => {
  if (!selectedElement) return;
  
  const selectedTextElement = canvasElements.find(el => el.id === selectedElement);
  if (!selectedTextElement || selectedTextElement.type !== "text") return;
  
  // Recupera o texto original
  const originalText = selectedTextElement.originalText || text;
  
  // Cria as opções de texto com arcMode e arcRadius
  const textOptions = {
    fontSize,
    fontFamily,
    fontColor,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign: align,
    arcMode,
    arcRadius
  };
  
  // Gera o novo SVG com as opções atualizadas
  const newSvgData = textToSVG(originalText, textOptions);
  
  // Atualiza o elemento no canvas
  updateSelectedElement({
    content: newSvgData,
    originalText,
    textOptions,
    isTextSVG: true
  });
};
```

### 4. Atualizar a Função `addTextToCanvas`

Precisamos atualizar a função `addTextToCanvas` para incluir as novas opções de arco:

```typescript
const addTextToCanvas = () => {
  // Construímos as opções do SVG baseadas nas configurações de texto
  const textOptions = {
    fontSize,
    fontFamily,
    fontColor,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign: align,
    arcMode,
    arcRadius
  };
  
  // Convertemos o texto para SVG para melhor qualidade
  const svgData = textToSVG(text, textOptions);
  
  // Calculamos o tamanho baseado na fonte e no comprimento do texto
  // Ajustamos para acomodar arcos, se necessário
  let width = fontSize * text.length * 0.7;
  let height = fontSize * 1.5;
  
  if (arcMode !== "none") {
    width = Math.max(width, arcRadius * 2);
    height = Math.max(height, arcRadius + fontSize + 20);
  }
  
  const newElement = {
    id: `text-${Date.now()}`,
    type: "text" as const,
    content: svgData,
    x: 150,
    y: 200,
    rotation: 0,
    width,
    height,
    originalText: text,
    textOptions,
    isTextSVG: true
  };
  
  setCanvasElements([...canvasElements, newElement]);
  setSelectedElement(newElement.id);
};
```

## Considerações de UI/UX

1. **Visualização Imediata**: Os controles de arco devem mostrar uma pré-visualização em tempo real
2. **Interação Direta**: Considerar adicionar controles visuais no canvas para ajustar o arco diretamente
3. **Templates**: Oferecer alguns presets de configurações de arco populares

## Exemplo Visual

A interface de usuário para texto em arco pode seguir este formato:

```
+------------------------------------------+
| Estilo de Texto                          |
|                                          |
| [B] [I] [U] | [Left] [Center] [Right]    |
|                                          |
| Texto em Arco                            |
| [Normal] [Arco Superior] [Arco Inferior] |
|                                          |
| Raio do Arco                             |
| [-----O---------------------------] 100  |
+------------------------------------------+
```

## Próximos Passos Adicionais

1. Adicionar opções mais avançadas como:
   - Texto em círculo completo
   - Texto seguindo caminho personalizado
   - Inverter texto em arco

2. Permitir editar o texto diretamente no canvas mantendo o estilo de arco

3. Implementar otimizações para melhorar a renderização de texto em arco para fontes diferentes 