import { FC, useState } from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Color {
  id: string
  name: string
  value: string
  inStock: boolean
}

interface Size {
  id: string
  name: string
  value: string
  inStock: boolean
  description?: string
}

interface SizeColorSelectorProps {
  colors: Color[]
  sizes: Size[]
  onColorChange?: (colorId: string) => void
  onSizeChange?: (sizeId: string) => void
  initialColorId?: string
  initialSizeId?: string
}

const SizeColorSelector: FC<SizeColorSelectorProps> = ({
  colors,
  sizes,
  onColorChange,
  onSizeChange,
  initialColorId,
  initialSizeId,
}) => {
  const [selectedColorId, setSelectedColorId] = useState(initialColorId || (colors[0]?.inStock ? colors[0].id : ""))
  const [selectedSizeId, setSelectedSizeId] = useState(initialSizeId || (sizes[0]?.inStock ? sizes[0].id : ""))

  const handleColorChange = (colorId: string) => {
    setSelectedColorId(colorId)
    if (onColorChange) {
      onColorChange(colorId)
    }
  }

  const handleSizeChange = (sizeId: string) => {
    setSelectedSizeId(sizeId)
    if (onSizeChange) {
      onSizeChange(sizeId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label htmlFor="color-selector" className="text-sm font-medium">
            Cor
          </Label>
          {selectedColorId && (
            <span className="text-sm text-gray-500">
              {colors.find(color => color.id === selectedColorId)?.name}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2" id="color-selector">
          {colors.map((color) => (
            <TooltipProvider key={color.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "relative h-10 w-10 rounded-full border-2 transition-all",
                      selectedColorId === color.id
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-200",
                      !color.inStock && "opacity-40 cursor-not-allowed"
                    )}
                    style={{
                      backgroundColor: color.value,
                      boxShadow: color.value === "#FFFFFF" ? "inset 0 0 0 1px #e5e7eb" : undefined,
                    }}
                    onClick={() => color.inStock && handleColorChange(color.id)}
                    disabled={!color.inStock}
                    aria-label={`Cor: ${color.name}${!color.inStock ? " (Esgotada)" : ""}`}
                  >
                    {selectedColorId === color.id && (
                      <CheckIcon
                        className={cn(
                          "absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2",
                          /^#([0-9A-F]{3}){1,2}$/i.test(color.value) && 
                            parseInt(color.value.substring(1), 16) > 0xAAAAAA 
                            ? "text-gray-800" 
                            : "text-white"
                        )}
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-white py-1 px-2 text-xs">
                  {color.name}
                  {!color.inStock && " (Esgotada)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label htmlFor="size-selector" className="text-sm font-medium">
            Tamanho
          </Label>
          <button className="text-sm text-blue-600 hover:underline">
            Guia de tamanhos
          </button>
        </div>
        <RadioGroup
          id="size-selector"
          value={selectedSizeId}
          onValueChange={handleSizeChange}
          className="grid grid-cols-4 sm:grid-cols-6 gap-2"
        >
          {sizes.map((size) => (
            <TooltipProvider key={size.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <RadioGroupItem
                      value={size.id}
                      id={`size-${size.id}`}
                      className="peer sr-only"
                      disabled={!size.inStock}
                    />
                    <Label
                      htmlFor={`size-${size.id}`}
                      className={cn(
                        "flex h-11 w-full cursor-pointer items-center justify-center rounded-md border-2 bg-white text-sm font-medium transition-all hover:border-blue-600",
                        "peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-600",
                        !size.inStock && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      {size.value}
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="bg-gray-800 text-white py-1 px-2 text-xs"
                >
                  {size.description || size.name}
                  {!size.inStock && " (Esgotado)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

export default SizeColorSelector 