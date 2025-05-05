"use client"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X, Image as ImageIcon, FileText, AlertTriangle } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (file: File, preview: string) => void
  onDelete?: () => void
  maxSize?: number // em MB
  acceptedTypes?: string[]
  imageUrl?: string
  className?: string
  label?: string
}

export function ImageUploader({
  onUpload,
  onDelete,
  maxSize = 5, // 5MB padrão
  acceptedTypes = ["image/jpeg", "image/png", "image/svg+xml"],
  imageUrl,
  className = "",
  label = "Upload de Imagem"
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(imageUrl || null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file: File): boolean => {
    // Verificar tipo de arquivo
    if (!acceptedTypes.includes(file.type)) {
      setError(`Tipo de arquivo não suportado. Use: ${acceptedTypes.join(", ")}`)
      toast({
        variant: "destructive",
        title: "Tipo de arquivo não suportado",
        description: `Use um dos formatos aceitos: ${acceptedTypes.map(t => t.split("/")[1]).join(", ")}`
      })
      return false
    }

    // Verificar tamanho do arquivo
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo: ${maxSize}MB`)
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: `O tamanho máximo permitido é ${maxSize}MB`
      })
      return false
    }

    setError(null)
    return true
  }

  const processFile = (file: File) => {
    if (!validateFile(file)) return

    setUploading(true)
    // Simular upload com progresso
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        
        // Criar preview
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setPreview(result)
          onUpload(file, result)
          setUploading(false)
        }
        reader.readAsDataURL(file)
      }
    }, 200)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleDeleteImage = () => {
    setPreview(null)
    setProgress(0)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    if (onDelete) {
      onDelete()
    }
  }

  const getFileTypeIcon = (url: string) => {
    if (url.match(/\.(jpeg|jpg|png|gif|svg)$/i)) {
      return <ImageIcon className="h-6 w-6 text-slate-400" />
    }
    return <FileText className="h-6 w-6 text-slate-400" />
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {preview ? (
        <div className="relative border rounded-md overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto max-h-48 object-contain bg-slate-50 p-2"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleDeleteImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            accept={acceptedTypes.join(",")}
            className="hidden"
          />
          <Upload className="h-8 w-8 mx-auto text-slate-400" />
          <p className="mt-2 text-sm text-slate-600">
            {uploading ? "Carregando..." : "Arraste ou clique para fazer upload"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Formatos aceitos: {acceptedTypes.map(t => t.split("/")[1]).join(", ")}
          </p>
          <p className="text-xs text-slate-500">
            Tamanho máximo: {maxSize}MB
          </p>
          
          {uploading && (
            <Progress className="mt-2" value={progress} />
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 mt-2 text-xs">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 